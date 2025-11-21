# MarkSite Project Index

Quick navigation guide to all project documentation.

## 📚 Documentation

### Getting Started
- **[README.md](README.md)** - Main documentation and overview
- **[QUICKSTART.md](QUICKSTART.md)** - Get up and running in 5 minutes
- **[USAGE_GUIDE.md](USAGE_GUIDE.md)** - Comprehensive usage guide

### Advanced Topics
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Deploy to GitHub Pages, Netlify, Vercel, etc.
- **[FEATURES.md](FEATURES.md)** - Complete feature list and comparisons
- **[EXAMPLES.md](EXAMPLES.md)** - Code examples and templates

### Development
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - How to contribute
- **[CHANGELOG.md](CHANGELOG.md)** - Version history
- **[LICENSE](LICENSE)** - MIT License

## 🏗️ Project Structure

```
marksite/
├── src/                    # Source code
│   ├── index.js           # CLI entry point
│   ├── builder.js         # Site builder engine
│   ├── server.js          # Dev server
│   ├── markdown.js        # Markdown parser
│   ├── template.js        # Template renderer
│   ├── seo.js            # SEO utilities
│   └── utils.js          # Helper functions
│
├── themes/                # Themes
│   └── default/          # Default theme
│       ├── layout.ejs    # Main layout
│       ├── index.ejs     # Home page
│       ├── post.ejs      # Post template
│       ├── page.ejs      # Page template
│       ├── tag.ejs       # Tag page
│       ├── tags.ejs      # All tags
│       ├── archive.ejs   # Archive page
│       └── 404.ejs       # Error page
│
├── bin/                   # CLI executable
│   └── marksite.js       # CLI script
│
├── .github/               # GitHub specific
│   └── workflows/        # GitHub Actions
│       └── deploy.yml    # Deployment workflow
│
└── [Documentation files]
```

## 🎯 Quick Links

### For Users

| Need | Document |
|------|----------|
| Get started quickly | [QUICKSTART.md](QUICKSTART.md) |
| Learn all features | [USAGE_GUIDE.md](USAGE_GUIDE.md) |
| See examples | [EXAMPLES.md](EXAMPLES.md) |
| Deploy your site | [DEPLOYMENT.md](DEPLOYMENT.md) |
| Troubleshoot | [USAGE_GUIDE.md#troubleshooting](USAGE_GUIDE.md#troubleshooting) |

### For Developers

| Need | Document |
|------|----------|
| Contribute | [CONTRIBUTING.md](CONTRIBUTING.md) |
| Feature list | [FEATURES.md](FEATURES.md) |
| Architecture | This file (below) |
| License | [LICENSE](LICENSE) |

## 🔧 Core Components

### Builder (`src/builder.js`)
- Main site generation engine
- Loads and processes content
- Renders templates
- Generates pages
- Handles pagination
- Creates tag pages
- Builds archives

### Markdown Parser (`src/markdown.js`)
- Parses Markdown to HTML
- Handles plugins
- Generates anchors
- Calculates reading time
- Extracts excerpts

### Template Renderer (`src/template.js`)
- EJS template engine
- Helper functions
- Template caching
- Partial support

### SEO Module (`src/seo.js`)
- Meta tag generation
- Structured data
- Sitemap creation
- RSS/Atom feeds
- robots.txt

### Dev Server (`src/server.js`)
- Express-based server
- File watching
- Auto-rebuild
- Hot reload
- Error handling

### Utilities (`src/utils.js`)
- File operations
- Date formatting
- Slug generation
- Configuration loading
- Helper functions

## 📦 Dependencies

### Production
- `markdown-it` - Markdown parsing
- `markdown-it-anchor` - Heading anchors
- `markdown-it-attrs` - Attributes support
- `front-matter` - Front matter parsing
- `ejs` - Template engine
- `feed` - RSS/Atom generation
- `express` - Dev server
- `chokidar` - File watching
- `fs-extra` - File operations
- `chalk` - Terminal colors
- `slugify` - URL slugs
- `date-fns` - Date handling
- `glob` - File patterns

## 🎨 Theme System

### Template Files
All templates use EJS syntax and have access to:
- `config` - Site configuration
- `post/page` - Content data
- `posts` - Post collections
- `tags` - Tag data
- `pagination` - Pagination info

### Helper Functions
- `formatDate(date)` - Format dates
- `excerpt(text, length)` - Truncate text
- `urlJoin(...parts)` - Join URL parts
- `escapeHtml(text)` - Escape HTML
- `truncateWords(text, max)` - Limit words

### Customization
1. Modify templates in `themes/default/`
2. Add CSS in `public/css/`
3. Add JS in `public/js/`
4. Override with custom theme

## 🚀 Commands

### CLI Commands
```bash
marksite init [name]        # Create new site
marksite build             # Build site
marksite serve [port]      # Start dev server
marksite new <type> <title> # Create content
marksite help              # Show help
```

### NPM Scripts (in generated site)
```bash
npm run build              # Build site
npm run dev               # Start dev server
npm run new               # Create content
```

## 📝 Content Structure

### Posts
- Location: `content/posts/*.md`
- Required: `title`, `date`
- Optional: `author`, `tags`, `description`, `image`
- URL: `/posts/[slug]/`

### Pages
- Location: `content/pages/*.md`
- Required: `title`
- Optional: `permalink`
- URL: `/[slug]/` or custom

### Front Matter
```yaml
---
title: "Required"
date: 2024-01-15          # Required for posts
author: "Optional"
tags: ["optional"]
description: "Optional but recommended"
image: "/images/cover.jpg"
permalink: "/custom/"     # Optional
---
```

## 🔧 Configuration

### config.yml Structure
```yaml
site:           # Site metadata
seo:            # SEO settings
build:          # Build options
theme:          # Theme selection
```

### Key Settings
- `site.url` - Production URL (important!)
- `build.posts_per_page` - Pagination
- `build.output_dir` - Output directory
- `seo.og_image` - Default social image

## 🌐 Generated Files

### Pages
- `/` - Home with post list
- `/posts/[slug]/` - Individual posts
- `/[page-slug]/` - Static pages
- `/tags/` - All tags
- `/tags/[tag]/` - Tag archives
- `/archive/` - Date archive
- `/page/[n]/` - Pagination
- `/404.html` - Error page

### SEO Files
- `/sitemap.xml` - XML sitemap
- `/feed.xml` - RSS 2.0 feed
- `/atom.xml` - Atom 1.0 feed
- `/feed.json` - JSON Feed
- `/robots.txt` - Robots file

## 🎯 Use Cases

### Personal Blog
- Write posts regularly
- Share knowledge
- Build audience
- SEO optimized

### Documentation Site
- Create pages
- Organize content
- Search engine friendly
- Easy navigation

### Portfolio
- Showcase projects
- Blog about work
- Professional presence
- Custom pages

### Technical Blog
- Code examples
- Syntax highlighting
- Tag organization
- RSS for readers

## 🏆 Best Practices

### Content
1. Write clear titles (SEO)
2. Add descriptions to posts
3. Use tags consistently
4. Add alt text to images
5. Link between posts

### Performance
1. Optimize images
2. Minimize custom code
3. Use system fonts
4. Leverage CDN

### SEO
1. Submit sitemap
2. Use descriptive URLs
3. Write meta descriptions
4. Add structured data
5. Monitor Search Console

### Development
1. Test locally first
2. Use Git for version control
3. Write drafts
4. Regular commits
5. Deploy frequently

## 📊 Workflow

### Typical Workflow
1. Write post in Markdown
2. Preview with dev server
3. Build for production
4. Deploy to hosting
5. Submit to search engines

### Content Creation
1. `npm run new post "Title"`
2. Edit Markdown file
3. Add images to `public/images/`
4. Preview changes
5. Build and deploy

### Theme Development
1. Modify templates
2. Update CSS
3. Test responsive design
4. Check all pages
5. Deploy changes

## 🐛 Common Issues

### Build Errors
- Check front matter syntax
- Verify date format
- Check YAML indentation

### Server Won't Start
- Port in use
- Node version
- Dependencies installed

### Styling Issues
- Check CSS syntax
- Clear cache
- Inspect elements

## 📈 Future Roadmap

See [CHANGELOG.md](CHANGELOG.md) for planned features.

Priority features:
- Draft support
- Related posts
- Search functionality
- Image optimization
- Multiple authors

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for:
- Bug reports
- Feature requests
- Pull requests
- Development setup
- Code style

## 📄 License

MIT License - see [LICENSE](LICENSE)

---

**Quick Start**: Read [QUICKSTART.md](QUICKSTART.md)  
**Full Guide**: Read [USAGE_GUIDE.md](USAGE_GUIDE.md)  
**Deploy**: Read [DEPLOYMENT.md](DEPLOYMENT.md)

Happy blogging! 🚀

