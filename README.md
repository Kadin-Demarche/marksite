# MarkSite

A modern static site generator for GitHub Pages. Write in Markdown, deploy in seconds.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)

## Contents

- [Why MarkSite?](#why-marksite)
- [Quick Start](#quick-start)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [Search](#search)
- [Customization](#customization)
- [Comparison](#comparison)
- [Contributing](#contributing)

## Why MarkSite?

**Simple**. No Ruby, no Go toolchains. Just Node.js and Markdown.

**Fast**. Client-side search, instant builds, no database needed.

**Complete**. SEO, dark mode, search, and responsive design included.

## Quick Start

```bash
npx marksite init my-blog
cd my-blog
npm install
npm run build
npm run serve
```

Visit `http://localhost:3000` - you're done.

## Features

- Full-text search with tag filtering
- Automatic sitemap and RSS feed
- Syntax highlighting for code blocks
- Reading time calculation
- Dark mode support (system-aware)
- Mobile-responsive design
- Clean, SEO-friendly URLs
- GitHub Pages optimized

## Installation

### Option 1: Quick Init (Recommended)

```bash
npx marksite init my-blog
cd my-blog
npm install
```

### Option 2: Global Install

```bash
npm install -g marksite
marksite init my-blog
cd my-blog
npm install
```

### Option 3: Clone Repository

```bash
git clone https://github.com/Kadin-Demarche/marksite.git
cd marksite
npm install
npm run init
```

## Usage

### Create Content

**New post:**

```bash
npm run new "My Post Title"
```

This creates `content/posts/YYYY-MM-DD-my-post-title.md`:

```markdown
---
title: "My Post Title"
date: 2025-11-21
tags: ["tag1", "tag2"]
---

Your content here...
```

**New page:** Create `content/pagename.md`:

```markdown
---
title: "About"
---

# About

Your content here...
```

### Build & Preview

```bash
npm run build    # Build site to _site/
npm run serve    # Preview at localhost:3000
```

### Commands

```bash
marksite init [dir]           # Initialize new site
marksite build                # Build site
marksite build --watch        # Build and watch for changes
marksite serve                # Start dev server (port 3000)
marksite serve --port 8080    # Use custom port
marksite new "Post Title"     # Create new post
```

## Configuration

Edit `config.yaml`:

```yaml
site:
  title: "My Blog"
  description: "About my blog"
  url: "https://yourusername.github.io"
  author: "Your Name"

blog:
  postsPerPage: 10
  dateFormat: "MMMM dd, yyyy"

features:
  syntaxHighlighting: true
  search: true
  darkMode: true
```

## Deployment

### GitHub Pages with GitHub Actions

1. Update `config.yaml` with your URL:

   ```yaml
   site:
     url: "https://username.github.io"
     baseUrl: "/repo-name" # If using project pages
   ```

2. Push to GitHub:

   ```bash
   git push origin main
   ```

3. Enable GitHub Pages:
   - Go to Settings → Pages
   - Source: GitHub Actions

The included workflow (`.github/workflows/deploy.yml`) handles automatic deployment.

### Other Platforms

**Netlify/Vercel:**

- Build command: `npm run build`
- Publish directory: `_site`

**Custom Server:**

- Upload contents of `_site/` folder
- Any static file host works

## Search

MarkSite includes full-text search with tag filtering. Search runs client-side (no server needed).

**Features:**

- Search post titles, content, and tags
- Filter by multiple tags
- Instant results
- URL parameters for sharing searches

**Usage:**

- Visit `/search/` on your site
- Or use URL: `/search/?q=keyword&tag=tagname`

The search index is automatically generated during build.

## Customization

### Styling

Edit `assets/css/style.css`:

```css
:root {
  --color-primary: #2563eb;
  --color-bg: #ffffff;
  --color-text: #1f2937;
}
```

### Templates

Templates use [Nunjucks](https://mozilla.github.io/nunjucks/). Edit files in `templates/`:

- `base.html` - Main layout with header/footer
- `post.html` - Individual blog posts
- `page.html` - Static pages
- `blog.html` - Post listing with pagination
- `search.html` - Search page

### Add Custom Filters

Edit `lib/template.js`:

```javascript
this.env.addFilter("uppercase", (str) => {
  return str.toUpperCase();
});
```

## Comparison

| Feature         | MarkSite   | Jekyll | Hugo      | Gatsby  |
| --------------- | ---------- | ------ | --------- | ------- |
| Setup Time      | < 1 min    | ~5 min | ~2 min    | ~10 min |
| Language        | JavaScript | Ruby   | Go        | React   |
| Build Speed     | Fast       | Slow   | Very Fast | Medium  |
| Search Built-in | ✅         | ❌     | ❌        | ❌      |
| Dark Mode       | ✅         | Plugin | Plugin    | Manual  |
| Zero Config     | ✅         | ❌     | ❌        | ❌      |

### When to Use MarkSite

**Good for:**

- Personal blogs
- Technical documentation
- Project sites
- Portfolio sites

**Not good for:**

- E-commerce sites
- Large corporate sites
- Dynamic applications

### vs Jekyll

Jekyll is mature with a large ecosystem. MarkSite is simpler with modern features built-in.

Choose Jekyll if you need existing themes or plugins.
Choose MarkSite if you want quick setup with modern defaults.

### vs Hugo

Hugo has blazing fast builds. MarkSite is easier to set up without Go toolchain.

Choose Hugo if you have 1000+ posts or need maximum speed.
Choose MarkSite if you prefer JavaScript tooling.

### vs Gatsby

Gatsby is powerful but complex. MarkSite is simple and works immediately.

Choose Gatsby if building a complex React application.
Choose MarkSite if you just want a blog.

## Project Structure

```
my-blog/
├── content/           # Your markdown files
│   ├── posts/        # Blog posts
│   ├── index.md      # Homepage
│   └── about.md      # Other pages
├── templates/         # HTML templates (Nunjucks)
├── assets/
│   ├── css/          # Stylesheets
│   ├── js/           # JavaScript
│   └── images/       # Images
├── _site/            # Generated site (deploy this)
└── config.yaml       # Configuration
```

## Requirements

- Node.js 18 or higher
- npm or yarn

## Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly (`npm run build && npm run serve`)
5. Submit a pull request

## License

MIT License - use it for anything.

## Credits

Built with:

- [Marked](https://marked.js.org/) - Markdown parser
- [Nunjucks](https://mozilla.github.io/nunjucks/) - Template engine
- [Highlight.js](https://highlightjs.org/) - Syntax highlighting

---

**Made for developers who just want to write.**
