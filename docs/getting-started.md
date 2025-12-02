# Getting Started with MarkSite

This guide walks you through setting up your first MarkSite blog in 5 minutes.

## Prerequisites

- Node.js >= 18.0.0
- npm >= 7.0.0

Check your versions:
```bash
node --version
npm --version
```

## Step 1: Clone MarkSite

Clone the MarkSite repository:

```bash
git clone https://github.com/yourusername/marksite.git my-blog
cd my-blog
npm install
```

## Step 2: Initialize Your Content Directory

Initialize a new MarkSite project with the content directory:

```bash
node cli.js init --content-dir blog-data
```

This creates the following structure:

```
my-blog/
├── blog-data/
│   ├── config.yaml              # Site configuration
│   ├── content/
│   │   ├── index.md             # Homepage
│   │   ├── about.md             # About page
│   │   ├── contact.md           # Contact page
│   │   └── posts/
│   │       └── welcome.md       # Sample blog post
│   ├── templates/               # Custom templates
│   ├── assets/                  # Custom assets
│   │   ├── css/
│   │   ├── js/
│   │   └── images/
│   └── _site/                   # Build output (don't edit)
├── node_modules/
└── package.json
```

## Step 3: Customize Your Configuration

Edit `blog-data/config.yaml`:

```yaml
site:
  title: "My Awesome Blog"
  description: "A place where I share my thoughts"
  url: "https://myblog.com"
  author: "Your Name"
  email: "your.email@example.com"
  language: "en"

blog:
  postsPerPage: 10

seo:
  enableSitemap: true
  enableRSS: true

features:
  search: true

navigation:
  - label: "Home"
    url: "/"
  - label: "Blog"
    url: "/blog/"
  - label: "About"
    url: "/about/"
  - label: "Contact"
    url: "/contact/"

social:
  github: "https://github.com/yourname"
  twitter: "https://twitter.com/yourname"
  linkedin: "https://linkedin.com/in/yourname"
```

## Step 4: Build Your Site

Build the static site:

```bash
node cli.js build --content-dir blog-data
```

Your site is now generated in `blog-data/_site/`!

## Step 5: Preview Locally

Start the development server:

```bash
node cli.js serve --content-dir blog-data
```

Open your browser to `http://localhost:3000` to see your site.

The server automatically rebuilds when you change files.

Run a quick health check anytime:

```bash
npm run doctor -- --content-dir blog-data
```

This reports errors/warnings for missing config, posts without titles, etc.

## Step 6: Create New Posts

Create your first blog post:

```bash
node cli.js new "My First Post" --content-dir blog-data
```

This creates a file like `blog-data/content/posts/2025-11-30-my-first-post.md`.

Edit the file:

```markdown
---
title: "My First Post"
date: 2025-11-30
author: "Your Name"
tags: ["welcome", "first-post"]
excerpt: "My thoughts on getting started with MarkSite"
---

# My First Post

This is my first blog post! I'm excited to start sharing my thoughts.

## Key Points

- Static site generation is fast
- Markdown is easy to write
- No databases needed

Check out [my other posts](/blog) for more!
```

Save and rebuild to see changes immediately in the dev server.

## Simplify with NPM Scripts

To make commands easier, add to `package.json`:

```json
{
  "scripts": {
    "build": "node cli.js build --content-dir blog-data",
    "serve": "node cli.js serve --content-dir blog-data",
    "new": "node cli.js new --content-dir blog-data"
  }
}
```

Then use:
```bash
npm run build                    # Build the site
npm run serve                    # Start dev server
npm run new -- "Post Title"      # Create new post
```

Or set the environment variable:

```bash
export MARKSITE_CONTENT_DIR=blog-data
node cli.js build
node cli.js serve
node cli.js new "Post Title"
```

## Deploy to GitHub Pages

### Create a GitHub Repository

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/your-blog.git
git push -u origin main
```

### Update .gitignore

Ensure these are in `.gitignore`:

```
node_modules/
blog-data/_site/
.DS_Store
```

### Deploy Using GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Build site
        run: npm run build
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./blog-data/_site
```

### Configure GitHub Pages

1. Go to your repository Settings
2. Navigate to "Pages"
3. Set "Source" to "Deploy from a branch"
4. Select "gh-pages" branch
5. Save

Your site will be published at `https://yourusername.github.io/your-blog`

## Next Steps

- Read [Content Format](./content-format.md) to learn Markdown syntax
- Explore [Configuration](./configuration.md) for advanced options
- Learn [Templates](./templates.md) to customize the design
- Check [CLI Reference](./cli-reference.md) for all commands

## Troubleshooting

**Port already in use?**
```bash
node cli.js serve --content-dir blog-data --port 3001
```

**Need to rebuild?**
```bash
rm -rf blog-data/_site
node cli.js build --content-dir blog-data
```

**Config not found?**
Make sure `blog-data/config.yaml` exists and is valid YAML.

**Template not found?**
Ensure templates are in `blog-data/templates/` or core `templates/` directory.
