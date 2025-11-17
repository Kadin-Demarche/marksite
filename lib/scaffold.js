import fs from 'fs-extra';
import path from 'path';
import yaml from 'js-yaml';
import { format } from 'date-fns';
import slugify from 'slugify';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function scaffoldProject(targetDir) {
  const resolvedDir = path.resolve(targetDir);
  const projectRoot = path.resolve(path.join(__dirname, '..'));
  
  // Create directory structure
  await fs.ensureDir(resolvedDir);
  await fs.ensureDir(path.join(resolvedDir, 'content'));
  await fs.ensureDir(path.join(resolvedDir, 'content', 'posts'));
  await fs.ensureDir(path.join(resolvedDir, 'templates'));
  await fs.ensureDir(path.join(resolvedDir, 'assets', 'css'));
  await fs.ensureDir(path.join(resolvedDir, 'assets', 'images'));
  await fs.ensureDir(path.join(resolvedDir, 'assets', 'js'));

  // Copy config if not exists
  const configPath = path.join(resolvedDir, 'config.yaml');
  const configSource = path.join(projectRoot, 'config.yaml');
  if (!await fs.pathExists(configPath) && configSource !== configPath) {
    if (await fs.pathExists(configSource)) {
      await fs.copy(configSource, configPath);
    }
  }

  // Copy templates if they don't exist and source is different from destination
  const templatesSource = path.join(projectRoot, 'templates');
  const templatesDest = path.join(resolvedDir, 'templates');
  if (await fs.pathExists(templatesSource) && templatesSource !== templatesDest) {
    const hasTemplates = (await fs.readdir(templatesDest)).length > 0;
    if (!hasTemplates) {
      await fs.copy(templatesSource, templatesDest);
    }
  }

  // Copy assets if they don't exist and source is different from destination
  const assetsSource = path.join(projectRoot, 'assets');
  const assetsDest = path.join(resolvedDir, 'assets');
  if (await fs.pathExists(assetsSource) && assetsSource !== assetsDest) {
    // Copy CSS
    const cssSource = path.join(assetsSource, 'css', 'style.css');
    const cssDest = path.join(assetsDest, 'css', 'style.css');
    if (await fs.pathExists(cssSource) && !await fs.pathExists(cssDest)) {
      await fs.copy(cssSource, cssDest);
    }
    
    // Copy JS
    const jsSource = path.join(assetsSource, 'js', 'main.js');
    const jsDest = path.join(assetsDest, 'js', 'main.js');
    if (await fs.pathExists(jsSource) && !await fs.pathExists(jsDest)) {
      await fs.copy(jsSource, jsDest);
    }
  }

  // Create sample content
  await createSampleContent(resolvedDir);

  console.log(`✓ Created project structure in ${resolvedDir}`);
}

async function createSampleContent(dir) {
  // Only create sample content if it doesn't already exist
  
  // Index page
  const indexPath = path.join(dir, 'content', 'index.md');
  if (!await fs.pathExists(indexPath)) {
    const indexContent = `---
title: "Welcome to MarkSite"
layout: page
---

# Welcome to MarkSite

A modern, SEO-friendly static site generator for GitHub Pages.

## Features

- 📝 Write in Markdown
- 🎨 Beautiful, responsive themes
- 🚀 Fast and lightweight
- 🔍 SEO optimized
- 📊 Built-in analytics support
- 🏷️ Tags and categories
- 📱 Mobile-first design
- 💡 Syntax highlighting
- 🔗 Clean URLs

## Getting Started

1. Edit \`config.yaml\` to customize your site
2. Create posts in \`content/posts/\`
3. Run \`npm run build\` to build your site
4. Deploy to GitHub Pages

Check out the [blog](/blog) for more information!
`;
    await fs.writeFile(indexPath, indexContent);
  }

  // About page
  const aboutPath = path.join(dir, 'content', 'about.md');
  if (!await fs.pathExists(aboutPath)) {
    const aboutContent = `---
title: "About"
layout: page
---

# About

This is a sample about page. Edit \`content/about.md\` to customize it.

## Who We Are

Write about yourself or your organization here.
`;
    await fs.writeFile(aboutPath, aboutContent);
  }

  // Contact page
  const contactPath = path.join(dir, 'content', 'contact.md');
  if (!await fs.pathExists(contactPath)) {
    const contactContent = `---
title: "Contact"
layout: page
---

# Contact

Get in touch with us!

- Email: your.email@example.com
- Twitter: @yourusername
- GitHub: @yourusername
`;
    await fs.writeFile(contactPath, contactContent);
  }

  // Sample blog post
  const postPath = path.join(dir, 'content', 'posts', 'welcome.md');
  if (!await fs.pathExists(postPath)) {
    const postContent = `---
title: "Welcome to Your New Blog"
date: ${format(new Date(), 'yyyy-MM-dd')}
author: "Your Name"
tags: ["welcome", "getting-started"]
excerpt: "This is your first blog post. Learn how to create amazing content with MarkSite."
---

# Welcome to Your New Blog

This is your first blog post! Here's how you can create more content.

## Writing Posts

Create new posts in the \`content/posts/\` directory. Each post should have:

- A title
- A date
- Optional tags and categories
- Your content in Markdown

## Markdown Features

You can use all standard Markdown features:

### Code Blocks

\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

### Lists

- Item 1
- Item 2
- Item 3

### Links

Check out [MarkSite documentation](https://example.com) for more.

## Next Steps

1. Edit this post or delete it
2. Create new posts with \`npm run new "Your Post Title"\`
3. Customize your theme in \`templates/\`
4. Deploy to GitHub Pages

Happy blogging!
`;
    await fs.writeFile(postPath, postContent);
  }
}

export async function createNewPost(title, configPath) {
  const config = yaml.load(await fs.readFile(configPath, 'utf-8'));
  const slug = slugify(title, { lower: true, strict: true });
  const date = format(new Date(), 'yyyy-MM-dd');
  
  const content = `---
title: "${title}"
date: ${date}
author: "${config.site?.author || 'Your Name'}"
tags: []
excerpt: ""
---

# ${title}

Write your post content here...
`;

  const filename = `${date}-${slug}.md`;
  const filepath = path.join(config.build.source, 'posts', filename);
  
  await fs.writeFile(filepath, content);
  
  return filepath;
}

