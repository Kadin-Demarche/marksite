# MarkSite Documentation

Welcome to MarkSite, a modern static site generator for GitHub Pages. This documentation covers all aspects of using and configuring MarkSite.

## Quick Start

Choose your path based on your situation:

- **New to MarkSite?** → Start with [Getting Started](./getting-started.md)
- **Migrating from old structure?** → Read [Migration Guide](./migration.md)
- **Want to understand the architecture?** → Check [Content Directory Structure](./content-directory.md)
- **Need command reference?** → See [CLI Reference](./cli-reference.md)
- **Looking for release notes?** → Read [Releases](./releases/1.2.md)

## Key Features

- 📝 **Write in Markdown** - Simple, clean content format
- 🎨 **Customizable Templates** - Nunjucks template engine with full control
- 🚀 **Fast & Lightweight** - Optimized static site generation
- 📱 **Responsive Design** - Mobile-first default theme
- 🔍 **SEO Optimized** - Built-in sitemaps and RSS feeds
- 🏷️ **Tags & Categories** - Organize your content
- 💡 **Syntax Highlighting** - Beautiful code blocks
- 🔗 **Clean URLs** - User-friendly permalinks
- 🎯 **Full-Text Search** - Client-side search index

## Documentation Structure

```
docs/
├── README.md                    # This file
├── getting-started.md           # New user setup guide
├── migration.md                 # Upgrading from old structure
├── content-directory.md         # Directory structure explanation
├── cli-reference.md             # Command-line interface guide
├── configuration.md             # config.yaml options
├── templates.md                 # Template customization
├── content-format.md            # Markdown front matter and syntax
└── advanced.md                  # Advanced topics
```

## Requirements

- **Node.js**: >= 18.0.0
- **npm**: >= 7.0.0

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/yourusername/marksite.git
cd marksite
npm install
```

## Common Commands

```bash
# Initialize a new project
node cli.js init --content-dir blog-data

# Build your site
node cli.js build --content-dir blog-data

# Start development server
node cli.js serve --content-dir blog-data

# Create a new post
node cli.js new "My First Post" --content-dir blog-data

# Health check
npm run doctor -- --content-dir blog-data

# Remove generated site output
node cli.js clean --content-dir blog-data

# Clear all content (prompts unless forced)
node cli.js clearcontent --content-dir blog-data

# Migrate existing project
node cli.js migrate
```

## Project Structure

MarkSite uses a content directory model that separates your blog content from the framework:

```
your-repo/
├── cli.js                       # Core CLI
├── lib/                         # Core libraries
├── templates/                   # Default templates
├── assets/                      # Default assets
├── package.json
│
└── blog-data/                   # Your content (can be any name)
    ├── config.yaml              # Site configuration
    ├── content/                 # Your pages and posts
    │   ├── index.md
    │   ├── about.md
    │   └── posts/
    │       └── *.md
    ├── templates/               # Optional: custom templates
    ├── assets/                  # Optional: custom assets
    └── _site/                   # Build output (git ignored)
```

## Getting Help

- **Issues**: Report bugs on [GitHub Issues](https://github.com/kadin/marksite/issues)
- **Discussions**: Ask questions in [GitHub Discussions](https://github.com/kadin/marksite/discussions)
- **Contributing**: See [CONTRIBUTING.md](../CONTRIBUTING.md) for contribution guidelines

## License

MarkSite is open source and available under the [MIT License](../LICENSE).
