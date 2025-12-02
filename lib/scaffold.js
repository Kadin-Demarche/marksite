import fs from 'fs-extra';
import path from 'path';
import yaml from 'js-yaml';
import { format } from 'date-fns';
import slugify from 'slugify';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function scaffoldProject(targetDir, contentDir, preset) {
  const resolvedDir = path.resolve(targetDir);
  const projectRoot = path.resolve(path.join(__dirname, '..'));
  
  const coreTemplatesPath = path.join(projectRoot, 'templates');
  const coreAssetsPath = path.join(projectRoot, 'assets');
  const coreConfigPath = path.join(projectRoot, 'config.yaml');
  
  if (!await fs.pathExists(coreTemplatesPath) || !await fs.pathExists(coreAssetsPath)) {
    throw new Error(
      `MarkSite framework files not found. ` +
      `Please install marksite locally with 'npm install marksite' or clone the repository. ` +
      `Project root: ${projectRoot}`
    );
  }
  
  let dataDir = resolvedDir;
  
  if (contentDir) {
    dataDir = path.resolve(path.join(resolvedDir, contentDir));
  }
  
  try {
    await fs.ensureDir(resolvedDir);
    await fs.ensureDir(dataDir);
    await fs.ensureDir(path.join(dataDir, 'content'));
    await fs.ensureDir(path.join(dataDir, 'content', 'posts'));
    await fs.ensureDir(path.join(dataDir, 'templates'));
    await fs.ensureDir(path.join(dataDir, 'assets', 'css'));
    await fs.ensureDir(path.join(dataDir, 'assets', 'images'));
    await fs.ensureDir(path.join(dataDir, 'assets', 'js'));

    const configPath = path.join(dataDir, 'config.yaml');
    const configSource = path.join(projectRoot, 'config.yaml');
    if (!await fs.pathExists(configPath) && configSource !== configPath) {
      if (await fs.pathExists(configSource)) {
        await fs.copy(configSource, configPath);
      }
    }

    const templatesSource = path.join(projectRoot, 'templates');
    const templatesDest = path.join(dataDir, 'templates');
    if (await fs.pathExists(templatesSource) && templatesSource !== templatesDest) {
      const hasTemplates = (await fs.readdir(templatesDest)).length > 0;
      if (!hasTemplates) {
        await fs.copy(templatesSource, templatesDest);
      }
    }

    const assetsSource = path.join(projectRoot, 'assets');
    const assetsDest = path.join(dataDir, 'assets');
    if (await fs.pathExists(assetsSource) && assetsSource !== assetsDest) {
      const cssSource = path.join(assetsSource, 'css', 'style.css');
      const cssDest = path.join(assetsDest, 'css', 'style.css');
      if (await fs.pathExists(cssSource) && !await fs.pathExists(cssDest)) {
        await fs.copy(cssSource, cssDest);
      }
      const cssCoreDest = path.join(assetsDest, 'css', 'style.core.css');
      if (await fs.pathExists(cssSource) && !await fs.pathExists(cssCoreDest)) {
        await fs.copy(cssSource, cssCoreDest);
      }
      
      const jsSource = path.join(assetsSource, 'js', 'main.js');
      const jsDest = path.join(assetsDest, 'js', 'main.js');
      if (await fs.pathExists(jsSource) && !await fs.pathExists(jsDest)) {
        await fs.copy(jsSource, jsDest);
      }
    }

    // Preserve base assets before applying presets
    await ensureBaseAssets(dataDir, projectRoot);

    const appliedPreset = await applyPreset(preset, dataDir, projectRoot);

    if (!appliedPreset) {
      await createSampleContent(dataDir);
    }

    await ensureBaseAssets(dataDir, projectRoot);

    console.log(`✓ Created project structure in ${dataDir}`);
  } catch (error) {
    throw new Error(`Failed to scaffold project: ${error.message}`);
  }
}

async function applyPreset(preset, dataDir, projectRoot) {
  if (!preset) return false;
  const allowed = ['blog', 'docs', 'landing'];
  if (!allowed.includes(preset)) {
    throw new Error(`Unknown preset "${preset}". Use one of: ${allowed.join(', ')}`);
  }
  const presetPath = path.join(projectRoot, 'starters', preset);
  if (!await fs.pathExists(presetPath)) {
    throw new Error(`Preset "${preset}" files not found at ${presetPath}`);
  }

  await fs.copy(presetPath, dataDir, { overwrite: true, errorOnExist: false });
  console.log(`✓ Applied "${preset}" starter template`);
  return true;
}

async function ensureBaseAssets(dataDir, projectRoot) {
  const coreStyleSrc = (await fs.pathExists(path.join(projectRoot, 'core-assets', 'css', 'style.css')))
    ? path.join(projectRoot, 'core-assets', 'css', 'style.css')
    : path.join(projectRoot, 'assets', 'css', 'style.css');
  const coreStyleDest = path.join(dataDir, 'assets', 'css', 'style.core.css');
  if (await fs.pathExists(coreStyleSrc)) {
    await fs.copy(coreStyleSrc, coreStyleDest, { overwrite: true });
  }

  const mainJsSrc = (await fs.pathExists(path.join(projectRoot, 'core-assets', 'js', 'main.js')))
    ? path.join(projectRoot, 'core-assets', 'js', 'main.js')
    : path.join(projectRoot, 'assets', 'js', 'main.js');
  const mainJsDest = path.join(dataDir, 'assets', 'js', 'main.js');
  if (await fs.pathExists(mainJsSrc)) {
    await fs.copy(mainJsSrc, mainJsDest, { overwrite: true });
  }
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

export async function createNewPost(title, contentDir) {
  const configPath = path.join(contentDir, 'config.yaml');
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
  const postsDir = path.join(contentDir, 'content', 'posts');
  await fs.ensureDir(postsDir);
  const filepath = path.join(postsDir, filename);
  
  await fs.writeFile(filepath, content);
  
  return filepath;
}
