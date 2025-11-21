#!/usr/bin/env node

import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import { fileURLToPath } from 'url';
import { SiteBuilder } from './builder.js';
import { DevServer } from './server.js';
import { createSlug, formatDate } from './utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const commands = {
  /**
   * Initialize a new site
   */
  async init() {
    const siteName = process.argv[3] || 'my-site';
    const siteDir = path.join(process.cwd(), siteName);
    
    if (await fs.pathExists(siteDir)) {
      console.error(chalk.red(`Error: Directory ${siteName} already exists`));
      process.exit(1);
    }
    
    console.log(chalk.blue(`\n📦 Creating new site: ${siteName}\n`));
    
    // Create directory structure
    await fs.ensureDir(path.join(siteDir, 'content', 'posts'));
    await fs.ensureDir(path.join(siteDir, 'content', 'pages'));
    await fs.ensureDir(path.join(siteDir, 'public', 'images'));
    await fs.ensureDir(path.join(siteDir, 'public', 'css'));
    await fs.ensureDir(path.join(siteDir, 'public', 'js'));
    
    // Copy default theme
    const defaultThemeSrc = path.join(__dirname, '..', 'themes', 'default');
    const defaultThemeDest = path.join(siteDir, 'themes', 'default');
    await fs.copy(defaultThemeSrc, defaultThemeDest);
    
    // Create config file
    const config = `site:
  title: "My Awesome Blog"
  description: "A blog about awesome things"
  url: "https://yourusername.github.io"
  author: "Your Name"
  email: "your.email@example.com"
  language: "en"

seo:
  twitter_handle: "@yourusername"
  og_image: "/images/og-image.jpg"
  keywords:
    - blog
    - markdown
    - static site

build:
  posts_per_page: 10
  output_dir: "_site"
  excerpt_length: 160

theme: "default"
`;
    await fs.writeFile(path.join(siteDir, 'config.yml'), config);
    
    // Create example post
    const examplePost = `---
title: "Welcome to MarkSite!"
date: ${new Date().toISOString().split('T')[0]}
author: "Your Name"
tags: ["welcome", "getting-started"]
description: "Welcome to your new blog powered by MarkSite"
---

# Welcome to MarkSite!

Congratulations! Your blog is now up and running. MarkSite is a powerful static site generator that helps you create beautiful, SEO-optimized blogs from Markdown files.

## Getting Started

Edit this file in \`content/posts/welcome.md\` to customize your first post.

## Features

- 🚀 **Fast & Simple** - Write in Markdown, get a beautiful website
- 📱 **Responsive Design** - Looks great on all devices
- 🔍 **SEO Optimized** - Built-in SEO features
- 📊 **RSS Feed** - Automatic feed generation

## Writing Posts

Create new posts with:

\`\`\`bash
npm run new post "My Post Title"
\`\`\`

## Next Steps

1. Edit \`config.yml\` to customize your site
2. Add your own content in \`content/posts/\`
3. Customize the theme in \`themes/default/\`
4. Build your site with \`npm run build\`

Happy blogging! 🎉
`;
    await fs.writeFile(path.join(siteDir, 'content', 'posts', 'welcome.md'), examplePost);
    
    // Create example page
    const examplePage = `---
title: "About"
permalink: "/about/"
---

# About Me

This is the about page. Edit this file in \`content/pages/about.md\`.

## Who Am I?

Write something interesting about yourself here!

## Contact

Feel free to reach out at your.email@example.com
`;
    await fs.writeFile(path.join(siteDir, 'content', 'pages', 'about.md'), examplePage);
    
    // Create basic CSS
    const css = `/* MarkSite Default Theme Styles */

:root {
  --primary-color: #2563eb;
  --text-color: #1f2937;
  --bg-color: #ffffff;
  --border-color: #e5e7eb;
  --code-bg: #f3f4f6;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  line-height: 1.6;
  color: var(--text-color);
  background: var(--bg-color);
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
}

header {
  border-bottom: 1px solid var(--border-color);
  padding: 2rem 0;
  margin-bottom: 3rem;
}

header h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

header p {
  color: #6b7280;
}

nav {
  margin-top: 1rem;
}

nav a {
  margin-right: 1.5rem;
  color: var(--primary-color);
  text-decoration: none;
}

nav a:hover {
  text-decoration: underline;
}

article {
  margin-bottom: 3rem;
}

article h1, article h2, article h3 {
  margin-top: 2rem;
  margin-bottom: 1rem;
}

article h1 { font-size: 2.5rem; }
article h2 { font-size: 2rem; }
article h3 { font-size: 1.5rem; }

article p {
  margin-bottom: 1rem;
}

article ul, article ol {
  margin-bottom: 1rem;
  padding-left: 2rem;
}

article code {
  background: var(--code-bg);
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
  font-size: 0.9em;
}

article pre {
  background: var(--code-bg);
  padding: 1rem;
  border-radius: 5px;
  overflow-x: auto;
  margin-bottom: 1rem;
}

article pre code {
  background: none;
  padding: 0;
}

.post-meta {
  color: #6b7280;
  font-size: 0.9rem;
  margin-bottom: 2rem;
}

.post-list {
  list-style: none;
  padding: 0;
}

.post-item {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--border-color);
}

.post-item h2 {
  margin-bottom: 0.5rem;
}

.post-item h2 a {
  color: var(--text-color);
  text-decoration: none;
}

.post-item h2 a:hover {
  color: var(--primary-color);
}

.tag {
  display: inline-block;
  background: var(--code-bg);
  padding: 0.25rem 0.75rem;
  border-radius: 3px;
  font-size: 0.85rem;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  color: var(--text-color);
  text-decoration: none;
}

.tag:hover {
  background: #e5e7eb;
}

.pagination {
  display: flex;
  justify-content: space-between;
  margin: 3rem 0;
}

.pagination a {
  color: var(--primary-color);
  text-decoration: none;
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 5px;
}

.pagination a:hover {
  background: var(--code-bg);
}

footer {
  border-top: 1px solid var(--border-color);
  padding: 2rem 0;
  margin-top: 4rem;
  text-align: center;
  color: #6b7280;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  article h1 { font-size: 2rem; }
  article h2 { font-size: 1.5rem; }
  article h3 { font-size: 1.25rem; }
}
`;
    await fs.writeFile(path.join(siteDir, 'public', 'css', 'style.css'), css);
    
    // Create .gitignore
    const gitignore = `node_modules/
_site/
.DS_Store
*.log
`;
    await fs.writeFile(path.join(siteDir, '.gitignore'), gitignore);
    
    // Create package.json
    const packageJson = {
      name: siteName,
      version: "1.0.0",
      description: "A blog powered by MarkSite",
      scripts: {
        build: "marksite build",
        dev: "marksite serve",
        new: "marksite new"
      },
      keywords: ["blog", "marksite"],
      author: "",
      license: "MIT"
    };
    await fs.writeJson(path.join(siteDir, 'package.json'), packageJson, { spaces: 2 });
    
    console.log(chalk.green('✨ Site created successfully!\n'));
    console.log(chalk.blue('Next steps:\n'));
    console.log(chalk.gray(`  cd ${siteName}`));
    console.log(chalk.gray('  npm run dev\n'));
  },

  /**
   * Build the site
   */
  async build() {
    const builder = new SiteBuilder(process.cwd());
    await builder.build();
  },

  /**
   * Start development server
   */
  async serve() {
    const port = parseInt(process.argv[3]) || 3000;
    const server = new DevServer(process.cwd(), port);
    await server.start();
  },

  /**
   * Create a new post or page
   */
  async new() {
    const type = process.argv[3] || 'post';
    const title = process.argv.slice(4).join(' ') || 'Untitled';
    
    const slug = createSlug(title);
    const date = new Date().toISOString().split('T')[0];
    
    const frontMatter = `---
title: "${title}"
date: ${date}
author: "Your Name"
tags: []
description: ""
---

# ${title}

Write your content here...
`;
    
    const dir = type === 'post' 
      ? path.join(process.cwd(), 'content', 'posts')
      : path.join(process.cwd(), 'content', 'pages');
    
    const filename = `${slug}.md`;
    const filepath = path.join(dir, filename);
    
    if (await fs.pathExists(filepath)) {
      console.error(chalk.red(`Error: ${type} already exists: ${filename}`));
      process.exit(1);
    }
    
    await fs.writeFile(filepath, frontMatter);
    
    console.log(chalk.green(`✨ Created new ${type}: ${filename}`));
    console.log(chalk.gray(`   ${filepath}`));
  },

  /**
   * Show help
   */
  help() {
    console.log(chalk.bold('\nMarkSite - Static Site Generator\n'));
    console.log(chalk.blue('Usage:\n'));
    console.log('  marksite init [name]       Create a new site');
    console.log('  marksite build             Build the site');
    console.log('  marksite serve [port]      Start dev server (default: 3000)');
    console.log('  marksite new <type> <title> Create new post or page');
    console.log('  marksite help              Show this help\n');
  }
};

// Parse command
const command = process.argv[2] || 'help';

if (commands[command]) {
  commands[command]().catch(error => {
    console.error(chalk.red('Error:'), error.message);
    process.exit(1);
  });
} else {
  console.error(chalk.red(`Unknown command: ${command}\n`));
  commands.help();
  process.exit(1);
}

