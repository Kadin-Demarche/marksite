# MarkSite

A modern static site generator for GitHub Pages. Write in Markdown, deploy in seconds.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)

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

| Feature | MarkSite | Jekyll | Hugo | Gatsby |
|---------|----------|--------|------|--------|
| Setup Time | < 1 min | ~5 min | ~2 min | ~10 min |
| Language | JavaScript | Ruby | Go | React |
| Build Speed | Fast | Slow | Very Fast | Medium |
| Search Built-in | ✅ | ❌ | ❌ | ❌ |
| Dark Mode | ✅ | Plugin | Plugin | Manual |
| Zero Config | ✅ | ❌ | ❌ | ❌ |

### What You Get

- Full-text search with tag filtering
- Automatic sitemap and RSS feed
- Syntax highlighting for code
- Reading time calculation
- Dark mode support
- Mobile-responsive design
- Clean URLs
- GitHub Pages ready

## Installation

### Option 1: Quick Init

```bash
npx marksite init my-blog
cd my-blog
npm install
```

### Option 2: Clone and Use

```bash
git clone https://github.com/yourusername/marksite.git
cd marksite
npm install
npm run init
```

## Usage

### Create a Post

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

### Build & Deploy

```bash
npm run build    # Generates _site/
npm run serve    # Preview at localhost:3000
```

### Deploy to GitHub Pages

1. Create a repo on GitHub
2. Update `config.yaml` with your URL:
   ```yaml
   site:
     url: "https://username.github.io"
   ```
3. Push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```
4. Enable GitHub Pages in repo settings → Pages

**Or use GitHub Actions** (included in `.github/workflows/deploy.yml`) for automatic deployment.

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

## Customization

### Themes

Edit `assets/css/style.css`:

```css
:root {
  --color-primary: #2563eb;
  --color-bg: #ffffff;
  --color-text: #1f2937;
}
```

### Templates

Templates use Nunjucks. Edit files in `templates/`:

- `base.html` - Main layout
- `post.html` - Blog posts
- `page.html` - Static pages
- `blog.html` - Post listing
- `search.html` - Search page

### Add Pages

Create `content/yourpage.md`:

```markdown
---
title: "Your Page"
---

# Content here
```

## Pros & Cons

### Pros

✅ **No complex toolchains** - Just Node.js, no Ruby gems or Go binaries

✅ **Modern by default** - Search, dark mode, and responsive out of the box

✅ **Actually zero-config** - Sensible defaults, customize only what you need

✅ **Fast development** - Hot reload, instant preview

✅ **GitHub Pages optimized** - Built specifically for GH Pages deployment

✅ **Searchable** - Client-side search works on static hosting

### Cons

❌ **New project** - Not battle-tested like Jekyll or Hugo

❌ **Smaller ecosystem** - Fewer themes and plugins

❌ **Node.js required** - If you hate JavaScript, use Hugo

❌ **Limited to blogs** - Not designed for complex sites (use Next.js/Gatsby)

## When to Use MarkSite

**Good for:**
- Personal blogs
- Technical documentation
- Project sites
- Portfolio sites
- GitHub Pages hosting

**Not good for:**
- E-commerce sites
- Large corporate sites
- Dynamic applications
- Sites requiring server-side logic

## Comparison with Alternatives

### vs Jekyll

**Jekyll**: Ruby-based, GitHub's default, mature ecosystem

**MarkSite**: Faster setup (no Ruby), built-in search, modern defaults

**Choose Jekyll if**: You need plugins or existing themes

**Choose MarkSite if**: You want simplicity and modern features

### vs Hugo

**Hugo**: Blazing fast builds, written in Go

**MarkSite**: Easier setup (no Go required), simpler configuration

**Choose Hugo if**: You have 1000+ posts or need max speed

**Choose MarkSite if**: You want JavaScript-based tooling

### vs Gatsby

**Gatsby**: React-based, huge plugin ecosystem, complex

**MarkSite**: Simple, no build complexity, works immediately

**Choose Gatsby if**: Building a complex React application

**Choose MarkSite if**: You just want a blog that works

## Commands

```bash
marksite init [dir]           # Initialize new site
marksite build                # Build site
marksite build --watch        # Build and watch for changes
marksite serve                # Start dev server
marksite serve --port 8080    # Use custom port
marksite new "Post Title"     # Create new post
```

## Project Structure

```
my-blog/
├── content/           # Your markdown files
│   ├── posts/        # Blog posts
│   ├── index.md      # Homepage
│   └── about.md      # Other pages
├── templates/         # HTML templates
├── assets/           # CSS, JS, images
├── _site/            # Generated site (deploy this)
└── config.yaml       # Site configuration
```

## Requirements

- Node.js 18 or higher
- npm or yarn

## Documentation

- [Quick Start](QUICKSTART.md) - Get started in 5 minutes
- [Examples](EXAMPLES.md) - Common use cases and recipes
- [Search Feature](SEARCH_FEATURE.md) - How search works
- [Features List](FEATURES.md) - Complete feature documentation

## Contributing

Contributions welcome! Open an issue or submit a PR.

## License

MIT License - use it for anything.

## Credits

Built with:
- [Marked](https://marked.js.org/) - Markdown parser
- [Nunjucks](https://mozilla.github.io/nunjucks/) - Template engine
- [Highlight.js](https://highlightjs.org/) - Syntax highlighting

---

**Made for developers who just want to write.** No configuration marathons, no complex build processes. Just Markdown and done.
