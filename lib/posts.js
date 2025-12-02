import fs from 'fs-extra';
import path from 'path';
import fm from 'front-matter';
import slugify from 'slugify';
import { MarkdownProcessor } from './markdown.js';

export async function collectPosts(config) {
  const postsDir = path.join(config.build.source, 'posts');
  const cachePath = path.join(config.contentDir || process.cwd(), '.marksite-cache.json');
  const cache = await loadCache(cachePath);
  
  if (!await fs.pathExists(postsDir)) {
    return [];
  }

  const files = await fs.readdir(postsDir);
  const markdown = new MarkdownProcessor(config);
  const posts = [];
  const skipped = [];
  const includeDrafts = config.blog?.includeDrafts === true;
  const allowFuture = config.blog?.allowFuture === true;
  const now = new Date();

  for (const file of files) {
    if (!file.endsWith('.md') && !file.endsWith('.markdown')) continue;

    const filePath = path.join(postsDir, file);
    const stat = await fs.stat(filePath);
    const content = await fs.readFile(filePath, 'utf-8');
    const { attributes, body } = fm(content);
    
    if (!attributes.title) {
      skipped.push({ file: filePath, reason: 'Missing title' });
      continue;
    }

    // Process the post (use cache if unchanged)
    const cacheKey = path.relative(postsDir, filePath);
    let processed = null;
    if (cache[cacheKey] && cache[cacheKey].mtime === stat.mtimeMs) {
      processed = cache[cacheKey].processed;
    } else {
      processed = await markdown.process(content);
      cache[cacheKey] = {
        mtime: stat.mtimeMs,
        processed,
      };
    }
    
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

    if (attributes.draft && !includeDrafts) {
      skipped.push({ file: filePath, reason: 'Draft' });
      continue;
    }

    if (postDate > now && !allowFuture) {
      skipped.push({ file: filePath, reason: 'Scheduled (future date)' });
      continue;
    }

    const categories = Array.isArray(attributes.categories)
      ? attributes.categories
      : attributes.categories
        ? [attributes.categories]
        : [];
    
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
      categories,
      author: attributes.author || config.site.author,
    };

    posts.push(post);
  }

  // Sort posts by date
  posts.sort((a, b) => b.date - a.date);

  attachRelatedPosts(posts);

  if (skipped.length) {
    console.log(`⚠️  Skipped ${skipped.length} post(s):`);
    skipped.forEach(item => console.log(`   - ${item.file}: ${item.reason}`));
  }

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

    await writePostPage(post, config, post.content, prevPost, nextPost, post.related);
  }

  await saveCache(cachePath, cache);

  return posts;
}

async function writePostPage(post, config, content, prevPost, nextPost, related) {
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
    related,
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

function attachRelatedPosts(posts) {
  const maxRelated = 3;

  for (const post of posts) {
    const scores = [];
    for (const other of posts) {
      if (other.slug === post.slug) continue;

      const sharedTags = intersection(post.tags || [], other.tags || []);
      const sharedCategories = intersection(post.categories || [], other.categories || []);

      const score = sharedTags.length + sharedCategories.length * 2;
      if (score > 0) {
        scores.push({ post: other, score });
      }
    }

    post.related = scores
      .sort((a, b) => b.score - a.score || b.post.date - a.post.date)
      .slice(0, maxRelated)
      .map(item => ({
        title: item.post.title,
        url: item.post.url,
        date: item.post.date,
        readingTime: item.post.readingTime,
      }));
  }
}

function intersection(a = [], b = []) {
  const setB = new Set(b);
  return a.filter(item => setB.has(item));
}

async function loadCache(cachePath) {
  try {
    if (await fs.pathExists(cachePath)) {
      return JSON.parse(await fs.readFile(cachePath, 'utf-8'));
    }
  } catch (err) {
    console.warn('⚠️  Could not read cache, rebuilding all posts.');
  }
  return {};
}

async function saveCache(cachePath, cache) {
  try {
    await fs.writeFile(cachePath, JSON.stringify(cache, null, 2));
  } catch (err) {
    console.warn('⚠️  Could not write cache file:', err.message);
  }
}
