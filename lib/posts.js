import fs from 'fs-extra';
import path from 'path';
import fm from 'front-matter';
import slugify from 'slugify';
import { MarkdownProcessor } from './markdown.js';

export async function collectPosts(config) {
  const postsDir = path.join(config.build.source, 'posts');
  
  if (!await fs.pathExists(postsDir)) {
    return [];
  }

  const files = await fs.readdir(postsDir);
  const markdown = new MarkdownProcessor(config);
  const posts = [];

  for (const file of files) {
    if (!file.endsWith('.md') && !file.endsWith('.markdown')) continue;

    const filePath = path.join(postsDir, file);
    const content = await fs.readFile(filePath, 'utf-8');
    const { attributes, body } = fm(content);
    
    // Process the post
    const processed = await markdown.process(content);
    
    // Generate slug
    const slug = attributes.slug || slugify(attributes.title || file, { 
      lower: true, 
      strict: true 
    });
    
    // Parse and validate date
    let postDate = new Date();
    if (attributes.date) {
      const parsedDate = new Date(attributes.date);
      if (!isNaN(parsedDate.getTime())) {
        postDate = parsedDate;
      }
    }
    
    // Create post object
    const post = {
      ...attributes,
      slug,
      url: `/blog/${slug}/`,
      date: postDate,
      content: processed.html,
      excerpt: processed.data.excerpt,
      readingTime: processed.data.readingTime,
      toc: processed.data.toc,
      formattedDate: processed.data.formattedDate,
      tags: attributes.tags || [],
      author: attributes.author || config.site.author,
    };

    posts.push(post);
  }

  // Sort posts by date
  posts.sort((a, b) => b.date - a.date);

  // Calculate prev/next for each post and write pages
  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    const prevPost = i < posts.length - 1 ? { 
      title: posts[i + 1].title, 
      url: posts[i + 1].url 
    } : null;
    const nextPost = i > 0 ? { 
      title: posts[i - 1].title, 
      url: posts[i - 1].url 
    } : null;

    await writePostPage(post, config, post.content, prevPost, nextPost);
  }

  return posts;
}

async function writePostPage(post, config, content, prevPost, nextPost) {
  const { TemplateRenderer } = await import('./template.js');
  const renderer = new TemplateRenderer(config);
  
  const html = await renderer.render('post', {
    ...post,
    post,
    content,
    title: post.title,
    layout: 'post',
    prevPost,
    nextPost,
  });

  const outputPath = path.join(
    config.build.destination,
    'blog',
    post.slug,
    'index.html'
  );

  await fs.ensureDir(path.dirname(outputPath));
  
  const { minify } = await import('html-minifier-terser');
  const minified = await minify(html, {
    collapseWhitespace: true,
    removeComments: true,
    minifyCSS: true,
    minifyJS: true,
  });
  
  await fs.writeFile(outputPath, minified);
}

export function generatePagination(posts, postsPerPage) {
  const pages = [];
  const totalPages = Math.ceil(posts.length / postsPerPage);

  for (let i = 0; i < totalPages; i++) {
    const start = i * postsPerPage;
    const end = start + postsPerPage;
    
    pages.push({
      number: i + 1,
      posts: posts.slice(start, end),
      isFirst: i === 0,
      isLast: i === totalPages - 1,
      prevUrl: i > 0 ? (i === 1 ? '/blog/' : `/blog/page/${i}/`) : null,
      nextUrl: i < totalPages - 1 ? `/blog/page/${i + 2}/` : null,
      totalPages,
    });
  }

  return pages;
}

