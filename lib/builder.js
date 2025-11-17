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

export class SiteBuilder {
  constructor(configPath) {
    this.configPath = configPath;
    this.loadConfig();
    this.markdown = new MarkdownProcessor(this.config);
    this.renderer = new TemplateRenderer(this.config);
  }

  loadConfig() {
    try {
      const configFile = fs.readFileSync(this.configPath, 'utf-8');
      this.config = yaml.load(configFile);
      
      // Set defaults
      this.config.build = this.config.build || {};
      this.config.build.source = this.config.build.source || 'content';
      this.config.build.destination = this.config.build.destination || '_site';
      this.config.build.templates = this.config.build.templates || 'templates';
      this.config.build.assets = this.config.build.assets || 'assets';
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
        const html = await this.renderer.render('page', {
          ...processed.data,
          content: processed.html,
          title: processed.data.title || 'Page',
          posts: posts.slice(0, 5), // Recent posts for sidebar
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
        if (!tagMap.has(tag)) {
          tagMap.set(tag, []);
        }
        tagMap.get(tag).push(post);
      });
    });
    
    for (const [tag, tagPosts] of tagMap) {
      const sortedPosts = tagPosts.sort((a, b) => b.date - a.date);
      const html = await this.renderer.render('tag', {
        tag,
        posts: sortedPosts,
        title: `Tag: ${tag}`,
      });
      
      const outputPath = path.join(this.config.build.destination, 'tag', tag, 'index.html');
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
    const html = await this.renderer.render('search', {
      title: 'Search',
      tags: allTags,
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
        if (!tagMap.has(tag)) {
          tagMap.set(tag, { name: tag, count: 0 });
        }
        tagMap.get(tag).count++;
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
    ];
    
    const watcher = chokidar.watch(watchPaths, {
      ignored: /node_modules/,
      persistent: true,
    });
    
    watcher.on('change', async (path) => {
      console.log(`\n📝 Changed: ${path}`);
      if (callback) {
        await callback();
      } else {
        await this.build();
      }
    });
  }
}

