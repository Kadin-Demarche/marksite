import fs from 'fs-extra';
import path from 'path';
import yaml from 'js-yaml';
import chokidar from 'chokidar';
import { MarkdownProcessor } from './markdown.js';
import { TemplateRenderer } from './template.js';
import { SitemapGenerator } from './sitemap.js';
import { RSSGenerator } from './rss.js';
import { SearchIndexGenerator } from './search.js';
import { collectPosts, generatePagination } from './posts.js';
import { minify } from 'html-minifier-terser';
import slugify from 'slugify';
import { fileURLToPath } from 'url';

export class SiteBuilder {
  constructor(contentDir) {
    this.contentDir = path.resolve(contentDir);
    const modulePath = fileURLToPath(import.meta.url);
    this.projectRoot = path.resolve(path.join(path.dirname(modulePath), '..'));
    this.loadConfig();
    this.markdown = new MarkdownProcessor(this.config);
    this.renderer = new TemplateRenderer(this.config);
  }

  loadConfig() {
    try {
      const configPath = path.join(this.contentDir, 'config.yaml');
      if (!fs.existsSync(configPath)) {
        throw new Error(`Config file not found at ${configPath}`);
      }
      
      this.configPath = configPath;
      
      const configFile = fs.readFileSync(configPath, 'utf-8');
      this.config = yaml.load(configFile);
      
      this.config.contentDir = this.contentDir;
      
      this.config.build = this.config.build || {};
      this.config.build.source = path.resolve(this.contentDir, this.config.build.source || 'content');
      this.config.build.destination = path.resolve(this.contentDir, this.config.build.destination || '_site');
      
      const userTemplates = path.join(this.contentDir, 'templates');
      this.config.build.templates = fs.existsSync(userTemplates) ? userTemplates : path.join(this.projectRoot, 'templates');
      
      const userAssets = path.join(this.contentDir, 'assets');
      this.config.build.assets = fs.existsSync(userAssets) ? userAssets : path.join(this.projectRoot, 'assets');
    } catch (error) {
      throw new Error(`Failed to load config: ${error.message}`);
    }
  }

  async build() {
    console.log('🚀 Building site...');
    
    // Clean and prepare destination
    await fs.emptyDir(this.config.build.destination);
    
    // Copy assets
    await this.copyAssets();
    
    // Collect and process posts
    const posts = await collectPosts(this.config);
    
    // Generate pages
    await this.generatePages(posts);
    
    // Generate blog index with pagination
    await this.generateBlogIndex(posts);
    
    // Generate tag pages
    await this.generateTagPages(posts);
    await this.generateCategoryPages(posts);
    
    // Generate search page
    await this.generateSearchPage(posts);
    
    // Generate SEO files
    if (this.config.seo?.enableSitemap) {
      await this.generateSitemap(posts);
    }
    
    if (this.config.seo?.enableRSS) {
      await this.generateRSS(posts);
    }
    
    // Generate search index
    if (this.config.features?.search !== false) {
      await this.generateSearchIndex(posts);
    }
    
    console.log(`✓ Built ${posts.length} posts and pages`);
  }

  async copyAssets() {
    const assetsDir = this.config.build.assets;
    if (await fs.pathExists(assetsDir)) {
      await fs.copy(assetsDir, path.join(this.config.build.destination, 'assets'));
    }
  }

  async generatePages(posts) {
    const contentDir = this.config.build.source;
    const pages = await fs.readdir(contentDir);
    
    for (const page of pages) {
      const pagePath = path.join(contentDir, page);
      const stat = await fs.stat(pagePath);
      
      if (stat.isFile() && (page.endsWith('.md') || page.endsWith('.markdown'))) {
        const content = await fs.readFile(pagePath, 'utf-8');
        const processed = await this.markdown.process(content);
        
        const outputPath = this.getOutputPath(page);
        const pageUrl = this.getPageUrl(page);
        const html = await this.renderer.render('page', {
          ...processed.data,
          content: processed.html,
          title: processed.data.title || 'Page',
          url: pageUrl,
          posts: posts.slice(0, 5), // Recent posts for sidebar
          layout: 'page',
        });
        
        await this.writeHTML(outputPath, html);
      }
    }
  }

  async generateBlogIndex(posts) {
    const sortedPosts = posts.sort((a, b) => b.date - a.date);
    const pagination = generatePagination(sortedPosts, this.config.blog?.postsPerPage || 10);
    
    for (const page of pagination) {
      const html = await this.renderer.render('blog', {
        posts: page.posts,
        pagination: page,
        title: page.number === 1 ? 'Blog' : `Blog - Page ${page.number}`,
        url: page.number === 1 ? '/blog/' : `/blog/page/${page.number}/`,
        layout: 'blog',
      });
      
      const outputPath = page.number === 1 
        ? path.join(this.config.build.destination, 'blog', 'index.html')
        : path.join(this.config.build.destination, 'blog', 'page', `${page.number}`, 'index.html');
      
      await this.writeHTML(outputPath, html);
    }
  }

  async generateTagPages(posts) {
    const tagMap = new Map();
    
    posts.forEach(post => {
      (post.tags || []).forEach(tag => {
        const slug = slugify(tag, { lower: true, strict: true });
        if (!tagMap.has(slug)) {
          tagMap.set(slug, { label: tag, posts: [] });
        }
        const entry = tagMap.get(slug);
        if (!entry.label) entry.label = tag;
        entry.posts.push(post);
      });
    });
    
    for (const [slug, tagData] of tagMap) {
      const sortedPosts = tagData.posts.sort((a, b) => b.date - a.date);
      const tagUrl = `/tag/${slug}/`;
      const html = await this.renderer.render('tag', {
        tag: tagData.label,
        posts: sortedPosts,
        title: `Tag: ${tagData.label}`,
        url: tagUrl,
        layout: 'tag',
      });
      
      const outputPath = path.join(this.config.build.destination, 'tag', slug, 'index.html');
      await this.writeHTML(outputPath, html);
    }
  }

  async generateCategoryPages(posts) {
    const categoryMap = new Map();
    
    posts.forEach(post => {
      (post.categories || []).forEach(cat => {
        if (!categoryMap.has(cat)) {
          categoryMap.set(cat, []);
        }
        categoryMap.get(cat).push(post);
      });
    });
    
    for (const [category, categoryPosts] of categoryMap) {
      const sortedPosts = categoryPosts.sort((a, b) => b.date - a.date);
      const slug = slugify(category, { lower: true, strict: true });
      const categoryUrl = `/category/${slug}/`;
      const html = await this.renderer.render('category', {
        category,
        posts: sortedPosts,
        title: `Category: ${category}`,
        url: categoryUrl,
        layout: 'category',
      });
      
      const outputPath = path.join(this.config.build.destination, 'category', slug, 'index.html');
      await this.writeHTML(outputPath, html);
    }
  }

  async generateSitemap(posts) {
    const generator = new SitemapGenerator(this.config);
    const sitemap = generator.generate(posts);
    
    const outputPath = path.join(this.config.build.destination, 'sitemap.xml');
    await fs.writeFile(outputPath, sitemap);
  }

  async generateRSS(posts) {
    const generator = new RSSGenerator(this.config);
    const rss = generator.generate(posts);
    
    const outputPath = path.join(this.config.build.destination, 'feed.xml');
    await fs.writeFile(outputPath, rss);
  }

  async generateSearchPage(posts) {
    const allTags = this.extractAllTags(posts);
    const url = '/search/';
    const html = await this.renderer.render('search', {
      title: 'Search',
      tags: allTags,
      url,
      layout: 'search',
    });
    
    const outputPath = path.join(this.config.build.destination, 'search', 'index.html');
    await this.writeHTML(outputPath, html);
  }

  async generateSearchIndex(posts) {
    const generator = new SearchIndexGenerator(this.config);
    await generator.write(posts, this.config.build.destination);
  }

  extractAllTags(posts) {
    const tagMap = new Map();
    
    posts.forEach(post => {
      (post.tags || []).forEach(tag => {
        const slug = slugify(tag, { lower: true, strict: true });
        if (!tagMap.has(slug)) {
          tagMap.set(slug, { name: tag, slug, count: 0 });
        }
        const entry = tagMap.get(slug);
        if (!entry.name) entry.name = tag;
        entry.count++;
      });
    });

    return Array.from(tagMap.values())
      .sort((a, b) => b.count - a.count);
  }

  getOutputPath(filename) {
    const basename = path.basename(filename, path.extname(filename));
    if (basename === 'index') {
      return path.join(this.config.build.destination, 'index.html');
    }
    return path.join(this.config.build.destination, basename, 'index.html');
  }

  getPageUrl(filename) {
    const basename = path.basename(filename, path.extname(filename));
    return basename === 'index' ? '/' : `/${basename}/`;
  }

  async writeHTML(outputPath, html) {
    await fs.ensureDir(path.dirname(outputPath));
    
    // Minify HTML
    const minified = await minify(html, {
      collapseWhitespace: true,
      removeComments: true,
      minifyCSS: true,
      minifyJS: true,
    });
    
    await fs.writeFile(outputPath, minified);
  }

  async watch(callback) {
    const watchPaths = [
      this.config.build.source,
      this.config.build.templates,
      this.config.build.assets,
      this.configPath,
    ].filter(p => p && typeof p === 'string' && p.trim() !== '');
    
    if (watchPaths.length === 0) {
      throw new Error('No valid paths to watch');
    }
    
    const watcher = chokidar.watch(watchPaths, {
      ignored: /node_modules/,
      persistent: true,
    });
    
    watcher.on('change', async (filepath) => {
      console.log(`\n📝 Changed: ${filepath}`);
      if (callback) {
        await callback();
      } else {
        await this.build();
      }
    });
  }
}
