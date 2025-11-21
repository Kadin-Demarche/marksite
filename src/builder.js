import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
import {
  getMarkdownFiles,
  readMarkdownFile,
  createSlug,
  sortByDate,
  paginate,
  groupBy,
  ensureDir,
  cleanDir,
  copyDir,
  loadConfig
} from './utils.js';
import { parseMarkdown, extractExcerpt, calculateReadingTime } from './markdown.js';
import { createRenderer } from './template.js';
import {
  generateMetaTags,
  generateStructuredData,
  generateSitemap,
  generateRSSFeed,
  generateRobotsTxt
} from './seo.js';

/**
 * Main site builder class
 */
export class SiteBuilder {
  constructor(siteDir = process.cwd()) {
    this.siteDir = siteDir;
    this.config = null;
    this.renderer = null;
    this.posts = [];
    this.pages = [];
    this.tags = {};
  }

  /**
   * Initialize the builder
   */
  async init() {
    console.log(chalk.blue('Initializing MarkSite builder...'));
    
    // Load configuration
    const configPath = path.join(this.siteDir, 'config.yml');
    this.config = await loadConfig(configPath);
    
    // Setup template renderer
    const themePath = path.join(this.siteDir, 'themes', this.config.theme);
    this.renderer = createRenderer(themePath);
    
    console.log(chalk.green('✓ Configuration loaded'));
  }

  /**
   * Load all content (posts and pages)
   */
  async loadContent() {
    console.log(chalk.blue('Loading content...'));
    
    // Load posts
    const postsDir = path.join(this.siteDir, 'content', 'posts');
    const postFiles = await getMarkdownFiles(postsDir);
    
    this.posts = await Promise.all(
      postFiles.map(async (file) => {
        const { frontMatter, content } = await readMarkdownFile(file);
        const filename = path.basename(file, '.md');
        const slug = frontMatter.slug || createSlug(frontMatter.title || filename);
        const html = parseMarkdown(content);
        const excerpt = frontMatter.description || extractExcerpt(content, this.config.build.excerpt_length);
        const readingTime = calculateReadingTime(content);
        
        return {
          ...frontMatter,
          slug,
          url: `/posts/${slug}/`,
          content: html,
          excerpt,
          readingTime,
          type: 'post',
          date: frontMatter.date || new Date(),
          tags: frontMatter.tags || []
        };
      })
    );
    
    // Sort posts by date
    this.posts = sortByDate(this.posts, 'date');
    
    // Group posts by tags
    this.posts.forEach(post => {
      post.tags.forEach(tag => {
        if (!this.tags[tag]) {
          this.tags[tag] = [];
        }
        this.tags[tag].push(post);
      });
    });
    
    console.log(chalk.green(`✓ Loaded ${this.posts.length} posts`));
    
    // Load pages
    const pagesDir = path.join(this.siteDir, 'content', 'pages');
    const pageFiles = await getMarkdownFiles(pagesDir);
    
    this.pages = await Promise.all(
      pageFiles.map(async (file) => {
        const { frontMatter, content } = await readMarkdownFile(file);
        const filename = path.basename(file, '.md');
        const slug = frontMatter.slug || createSlug(frontMatter.title || filename);
        const html = parseMarkdown(content);
        
        return {
          ...frontMatter,
          slug,
          url: frontMatter.permalink || `/${slug}/`,
          content: html,
          type: 'page'
        };
      })
    );
    
    console.log(chalk.green(`✓ Loaded ${this.pages.length} pages`));
  }

  /**
   * Build the entire site
   */
  async build() {
    console.log(chalk.bold.blue('\n🚀 Building site...\n'));
    
    await this.init();
    await this.loadContent();
    
    const outputDir = path.join(this.siteDir, this.config.build.output_dir);
    await cleanDir(outputDir);
    
    // Build pages
    await this.buildHomePage(outputDir);
    await this.buildPosts(outputDir);
    await this.buildPages(outputDir);
    await this.buildTagPages(outputDir);
    await this.buildArchive(outputDir);
    await this.build404Page(outputDir);
    
    // Generate SEO files
    await this.generateSEOFiles(outputDir);
    
    // Copy static assets
    await this.copyAssets(outputDir);
    
    console.log(chalk.bold.green('\n✨ Build complete!\n'));
    console.log(chalk.gray(`Output directory: ${outputDir}`));
  }

  /**
   * Build home page with post list
   */
  async buildHomePage(outputDir) {
    console.log(chalk.blue('Building home page...'));
    
    const perPage = this.config.build.posts_per_page;
    const totalPages = Math.ceil(this.posts.length / perPage);
    
    for (let page = 1; page <= totalPages; page++) {
      const paginatedData = paginate(this.posts, page, perPage);
      
      const html = await this.renderer.render('index', {
        posts: paginatedData.items,
        pagination: paginatedData,
        config: this.config,
        meta: generateMetaTags({ url: page === 1 ? '/' : `/page/${page}/` }, this.config),
        structuredData: generateStructuredData({}, this.config),
        currentPage: 'home'
      });
      
      const pageDir = page === 1 
        ? outputDir 
        : path.join(outputDir, 'page', String(page));
      
      await ensureDir(pageDir);
      await fs.writeFile(path.join(pageDir, 'index.html'), html);
    }
    
    console.log(chalk.green(`✓ Built home page (${totalPages} page${totalPages > 1 ? 's' : ''})`));
  }

  /**
   * Build individual post pages
   */
  async buildPosts(outputDir) {
    console.log(chalk.blue('Building posts...'));
    
    for (const post of this.posts) {
      const html = await this.renderer.render('post', {
        post,
        config: this.config,
        meta: generateMetaTags(post, this.config),
        structuredData: generateStructuredData(post, this.config),
        currentPage: 'post'
      });
      
      const postDir = path.join(outputDir, 'posts', post.slug);
      await ensureDir(postDir);
      await fs.writeFile(path.join(postDir, 'index.html'), html);
    }
    
    console.log(chalk.green(`✓ Built ${this.posts.length} posts`));
  }

  /**
   * Build static pages
   */
  async buildPages(outputDir) {
    console.log(chalk.blue('Building pages...'));
    
    for (const page of this.pages) {
      const html = await this.renderer.render('page', {
        page,
        config: this.config,
        meta: generateMetaTags(page, this.config),
        structuredData: generateStructuredData(page, this.config),
        currentPage: page.slug
      });
      
      const pageDir = path.join(outputDir, page.slug);
      await ensureDir(pageDir);
      await fs.writeFile(path.join(pageDir, 'index.html'), html);
    }
    
    console.log(chalk.green(`✓ Built ${this.pages.length} pages`));
  }

  /**
   * Build tag archive pages
   */
  async buildTagPages(outputDir) {
    console.log(chalk.blue('Building tag pages...'));
    
    const tagCount = Object.keys(this.tags).length;
    
    for (const [tag, posts] of Object.entries(this.tags)) {
      const tagSlug = createSlug(tag);
      const html = await this.renderer.render('tag', {
        tag,
        posts: sortByDate(posts, 'date'),
        config: this.config,
        meta: generateMetaTags({
          title: `Tag: ${tag}`,
          url: `/tags/${tagSlug}/`,
          description: `Posts tagged with ${tag}`
        }, this.config),
        structuredData: generateStructuredData({}, this.config),
        currentPage: 'tag'
      });
      
      const tagDir = path.join(outputDir, 'tags', tagSlug);
      await ensureDir(tagDir);
      await fs.writeFile(path.join(tagDir, 'index.html'), html);
    }
    
    // Build tags index page
    const html = await this.renderer.render('tags', {
      tags: this.tags,
      config: this.config,
      meta: generateMetaTags({
        title: 'All Tags',
        url: '/tags/',
        description: 'Browse all tags'
      }, this.config),
      structuredData: generateStructuredData({}, this.config),
      currentPage: 'tags'
    });
    
    const tagsDir = path.join(outputDir, 'tags');
    await ensureDir(tagsDir);
    await fs.writeFile(path.join(tagsDir, 'index.html'), html);
    
    console.log(chalk.green(`✓ Built ${tagCount} tag pages`));
  }

  /**
   * Build archive page
   */
  async buildArchive(outputDir) {
    console.log(chalk.blue('Building archive...'));
    
    // Group posts by year and month
    const archive = groupBy(this.posts, post => {
      const date = new Date(post.date);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    });
    
    const html = await this.renderer.render('archive', {
      archive,
      config: this.config,
      meta: generateMetaTags({
        title: 'Archive',
        url: '/archive/',
        description: 'Post archive'
      }, this.config),
      structuredData: generateStructuredData({}, this.config),
      currentPage: 'archive'
    });
    
    const archiveDir = path.join(outputDir, 'archive');
    await ensureDir(archiveDir);
    await fs.writeFile(path.join(archiveDir, 'index.html'), html);
    
    console.log(chalk.green('✓ Built archive page'));
  }

  /**
   * Build 404 error page
   */
  async build404Page(outputDir) {
    console.log(chalk.blue('Building 404 page...'));
    
    const html = await this.renderer.render('404', {
      config: this.config,
      meta: generateMetaTags({
        title: '404 - Page Not Found',
        url: '/404.html',
        description: 'Page not found'
      }, this.config),
      structuredData: generateStructuredData({}, this.config),
      currentPage: '404'
    });
    
    await fs.writeFile(path.join(outputDir, '404.html'), html);
    
    console.log(chalk.green('✓ Built 404 page'));
  }

  /**
   * Generate SEO files (sitemap, RSS, robots.txt)
   */
  async generateSEOFiles(outputDir) {
    console.log(chalk.blue('Generating SEO files...'));
    
    // Generate sitemap
    const allPages = [
      { url: '/', type: 'page' },
      ...this.posts,
      ...this.pages,
      { url: '/tags/', type: 'page' },
      { url: '/archive/', type: 'page' }
    ];
    const sitemap = generateSitemap(allPages, this.config);
    await fs.writeFile(path.join(outputDir, 'sitemap.xml'), sitemap);
    
    // Generate RSS feeds
    const feeds = generateRSSFeed(this.posts, this.config);
    await fs.writeFile(path.join(outputDir, 'feed.xml'), feeds.rss);
    await fs.writeFile(path.join(outputDir, 'atom.xml'), feeds.atom);
    await fs.writeFile(path.join(outputDir, 'feed.json'), feeds.json);
    
    // Generate robots.txt
    const robotsTxt = generateRobotsTxt(this.config);
    await fs.writeFile(path.join(outputDir, 'robots.txt'), robotsTxt);
    
    console.log(chalk.green('✓ Generated SEO files'));
  }

  /**
   * Copy static assets
   */
  async copyAssets(outputDir) {
    console.log(chalk.blue('Copying assets...'));
    
    const publicDir = path.join(this.siteDir, 'public');
    if (await fs.pathExists(publicDir)) {
      await copyDir(publicDir, outputDir);
      console.log(chalk.green('✓ Copied static assets'));
    } else {
      console.log(chalk.yellow('⚠ No public directory found'));
    }
  }
}

