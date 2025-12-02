# Command-Line Interface Reference

Complete reference for all MarkSite CLI commands.

## Global Options

All commands support these options:

```bash
node cli.js --version          # Show MarkSite version
node cli.js --help             # Show help
node cli.js [command] --help   # Show help for specific command
```

## Commands

### `node cli.js init`

Initialize a new MarkSite project.

#### Syntax

```bash
node cli.js init [options]
```

#### Options

| Option | Short | Description | Default |
|--------|-------|-------------|---------|
| `--dir` | `-d` | Target directory | `.` |
| `--content-dir` | `-c` | Content directory name | `blog-data` |
| `--help` | `-h` | Show command help | - |

#### Examples

```bash
# Initialize in current directory
node cli.js init

# Initialize in specific directory
node cli.js init --dir ./my-blog

# Initialize with custom content directory name
node cli.js init --dir ./my-blog --content-dir content

# Initialize with short options
node cli.js init -d ./my-blog -c my-content
```

#### What It Creates

```
{dir}/
├── {content-dir}/
│   ├── config.yaml
│   ├── content/
│   │   ├── index.md
│   │   ├── about.md
│   │   ├── contact.md
│   │   └── posts/
│   │       └── welcome.md
│   ├── templates/       (with default templates)
│   └── assets/          (with default assets)
└── package.json
```

---

### `node cli.js build`

Build the static site from Markdown content.

#### Syntax

```bash
node cli.js build [options]
```

#### Options

| Option | Short | Description | Default |
|--------|-------|-------------|---------|
| `--content-dir` | `-d` | Content directory path | auto-resolved |
| `--watch` | `-w` | Watch for changes and rebuild | false |
| `--help` | `-h` | Show command help | - |

#### Examples

```bash
# Build with default content directory
node cli.js build

# Build specific content directory
node cli.js build --content-dir ./blog-data

# Build and watch for changes
node cli.js build --watch --content-dir ./blog-data

# Short options
node cli.js build -d ./blog-data -w
```

#### Environment Variable

```bash
export MARKSITE_CONTENT_DIR=blog-data
node cli.js build        # Uses MARKSITE_CONTENT_DIR
```

#### Output

```
blog-data/_site/
├── index.html
├── about/index.html
├── blog/index.html
├── blog/{post-slug}/index.html
├── tag/{tag-name}/index.html
├── category/{category-slug}/index.html
├── feed.xml
├── sitemap.xml
├── search-index.json
└── assets/
```

All generated URLs honor `site.url` and `site.baseUrl` from `config.yaml`, so subdirectory deployments (e.g., GitHub Pages project sites) work out of the box.

---

### `node cli.js serve`

Start a local development server with live rebuilding.

#### Syntax

```bash
node cli.js serve [options]
```

#### Options

| Option | Short | Description | Default |
|--------|-------|-------------|---------|
| `--content-dir` | `-d` | Content directory path | auto-resolved |
| `--port` | `-p` | Port number | `3000` |
| `--help` | `-h` | Show command help | - |

#### Examples

```bash
# Start dev server
node cli.js serve

# Use specific content directory
node cli.js serve --content-dir ./blog-data

# Use custom port
node cli.js serve --port 8080

# Combine options
node cli.js serve -d ./blog-data -p 3001
```

#### Features

- 🔄 Auto-rebuilds on file changes
- 📁 Watches `content/`, `templates/`, `assets/`, `config.yaml`
- 🌐 Clean URLs with trailing slashes
- 📱 Full site preview
- 🎯 Reports build status in console

#### Access

```
http://localhost:3000          # Default
http://localhost:8080          # With --port 8080
```

#### Stop Server

Press `Ctrl+C` to stop.

---

### `node cli.js new`

Create a new blog post with template.

#### Syntax

```bash
node cli.js new <title> [options]
```

#### Arguments

| Argument | Description |
|----------|-------------|
| `title` | Post title (required) |

#### Options

| Option | Short | Description | Default |
|--------|-------|-------------|---------|
| `--content-dir` | `-d` | Content directory path | auto-resolved |
| `--help` | `-h` | Show command help | - |

#### Examples

```bash
# Create new post with title
node cli.js new "My First Post"

# With content directory
node cli.js new "Getting Started" --content-dir ./blog-data

# Title with special characters (use quotes)
node cli.js new "Hello, World! 🚀" --content-dir ./blog-data

# Short option
node cli.js new "My Post" -d ./blog-data
```

#### Generated File

Creates file: `{content-dir}/content/posts/{YYYY-MM-DD}-{slug}.md`

Example: `blog-data/content/posts/2025-11-30-my-first-post.md`

```markdown
---
title: "My First Post"
date: 2025-11-30
author: "Your Name"
tags: []
excerpt: ""
---

# My First Post

Write your post content here...
```

#### Customize Post

Edit the generated file to add:
- Tags
- Excerpt
- Author (if different)
- Content

---

### `node cli.js migrate`

Migrate existing project from old structure to content directory model.

#### Syntax

```bash
node cli.js migrate [options]
```

#### Options

| Option | Short | Description | Default |
|--------|-------|-------------|---------|
| `--dir` | `-d` | Project directory | `.` |
| `--name` | `-n` | Content directory name | `blog-data` |
| `--help` | `-h` | Show command help | - |

#### Examples

```bash
# Migrate current project
node cli.js migrate

# Migrate with custom directory name
node cli.js migrate --name my-content

# Migrate specific project
node cli.js migrate --dir /path/to/repo

# Combine options
node cli.js migrate -d ./my-blog -n content
```

#### What It Does

1. Creates `{name}/` directory
2. Copies `config.yaml` → `{name}/config.yaml`
3. Copies `content/` → `{name}/content/`
4. Copies custom templates if present
5. Copies custom assets if present
6. Displays migration summary

#### After Migration

```bash
# Verify build works
node cli.js build --content-dir blog-data

# Clean up old files (optional)
rm config.yaml
rm -rf content/
rm -rf templates/
rm -rf assets/
```

See [Migration Guide](./migration.md) for detailed instructions.

---

### `node cli.js clean`

Remove the generated build output directory.

#### Syntax

```bash
node cli.js clean [options]
```

#### Options

| Option | Short | Description | Default |
|--------|-------|-------------|---------|
| `--content-dir` | `-d` | Content directory path | auto-resolved |
| `--help` | `-h` | Show command help | - |

#### Example

```bash
node cli.js clean --content-dir ./blog-data
```

---

### `node cli.js clearcontent`

Delete all markdown content under your content directory (prompts for confirmation unless forced) and recreate an empty `content/posts` structure.

#### Syntax

```bash
node cli.js clearcontent [options]
```

#### Options

| Option | Short | Description | Default |
|--------|-------|-------------|---------|
| `--content-dir` | `-d` | Content directory path | auto-resolved |
| `--force` | `-f` | Skip confirmation prompt | `false` |
| `--help` | `-h` | Show command help | - |

#### Example

```bash
node cli.js clearcontent --content-dir ./blog-data --force
```

---

### `node cli.js doctor`

Run health checks against your project to spot common issues (missing config, missing content, posts without required fields).

#### Syntax

```bash
node cli.js doctor [options]
```

#### Options

| Option | Short | Description | Default |
|--------|-------|-------------|---------|
| `--content-dir` | `-d` | Content directory path | auto-resolved |
| `--help` | `-h` | Show command help | - |

#### Example

```bash
node cli.js doctor --content-dir ./blog-data
```

Returns a report with errors/warnings and exits non-zero if errors are found.

## Usage Patterns

### Pattern 1: Quick Development

```bash
# Initialize project
node cli.js init

# Start development server (auto-rebuilds on changes)
node cli.js serve --content-dir blog-data

# In another terminal, create posts
node cli.js new "My Post" --content-dir blog-data
```

### Pattern 2: With NPM Scripts

Add to `package.json`:

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
npm run build                        # Build site
npm run serve                        # Start dev server
npm run new "Post Title"             # Create new post
```

### Pattern 3: Environment Variables

```bash
# Set once
export MARKSITE_CONTENT_DIR=blog-data

# Use without --content-dir flag
node cli.js build
node cli.js serve
node cli.js new "Post"
```

### Pattern 4: Multiple Blogs

```bash
# Build multiple blogs
node cli.js build --content-dir blog-main
node cli.js build --content-dir blog-project
node cli.js build --content-dir blog-archive

# Serve specific blog
node cli.js serve --content-dir blog-main --port 3001
```

### Pattern 5: Automated Deployment

```bash
# Build for production
node cli.js build --content-dir blog-data

# Output is ready in blog-data/_site/
# Copy to server or GitHub Pages
```

---

## Error Messages

### "Config file not found"

**Cause**: Can't find `{contentDir}/config.yaml`

**Solution**:
```bash
# Verify path
ls {contentDir}/config.yaml

# Ensure --content-dir is correct
node cli.js build --content-dir ./blog-data

# Check environment variable
echo $MARKSITE_CONTENT_DIR
```

### "Template rendering error"

**Cause**: Missing template file

**Solution**:
```bash
# Check templates exist
ls {contentDir}/templates/

# Or use core templates (they're automatic)
# Verify core templates exist
ls templates/
```

### "Port already in use"

**Cause**: Another process using the port

**Solution**:
```bash
# Use different port
node cli.js serve --port 3001

# Or find and stop other process
lsof -i :3000
kill -9 {PID}
```

### "Content directory not found"

**Cause**: Invalid path or missing directory

**Solution**:
```bash
# Check directory exists
ls -la blog-data/

# Initialize if missing
node cli.js init --content-dir blog-data

# Create manually
mkdir -p blog-data/content/posts
```

---

## Configuration Precedence

Content directory is resolved in this order:

1. `--content-dir` flag (highest priority)
2. `MARKSITE_CONTENT_DIR` environment variable
3. `contentDir` in root `config.yaml`
4. Legacy `./content/` directory (if exists)
5. Default `./blog-data` (lowest priority)

Example:

```bash
# This takes priority
node cli.js build --content-dir ./explicit

# Falls back to env var
MARKSITE_CONTENT_DIR=blog-data node cli.js build

# Falls back to config
node cli.js build  # Checks root config.yaml for contentDir

# Falls back to legacy
node cli.js build  # Uses ./content/ if exists

# Uses default
node cli.js build  # Uses ./blog-data
```

---

## Keyboard Shortcuts

### In Dev Server

- `Ctrl+C` - Stop server
- `Ctrl+Z` - Suspend (use `fg` to resume)

### Shell Shortcuts

```bash
# Previous command
node cli.js serve              # Run this
!!                          # Re-runs last command

# Search history
Ctrl+R "node cli.js serve"     # Find in history
```

---

## Tips & Tricks

### Faster Development

```bash
# Watch for changes automatically
node cli.js build --watch --content-dir blog-data

# Or use dev server (preferred)
node cli.js serve --content-dir blog-data
```

### Batch Operations

```bash
# Create multiple posts
node cli.js new "First" -d blog-data
node cli.js new "Second" -d blog-data
node cli.js new "Third" -d blog-data

# Use scripts
#!/bin/bash
for title in "Post 1" "Post 2" "Post 3"; do
  node cli.js new "$title" -d blog-data
done
```

### Debugging

```bash
# Add verbose output (if supported)
set -x                      # Enable debug
node cli.js build
set +x                      # Disable debug

# Check generated HTML
cat blog-data/_site/index.html | head -20
```

---

## See Also

- [Getting Started](./getting-started.md) - Tutorial for new users
- [Content Directory](./content-directory.md) - Project structure
- [Configuration](./configuration.md) - Config options
- [Content Format](./content-format.md) - Markdown syntax
