# Configuration Guide

MarkSite configuration is defined in `config.yaml` inside your content directory.

## Basic Example

```yaml
site:
  title: "My Blog"
  description: "My thoughts and ideas"
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

social:
  github: "https://github.com/yourname"
  twitter: "https://twitter.com/yourname"
```

## Configuration Sections

### `site`

Core site information.

#### `site.title` (required)

Site title displayed in header and browser tab.

```yaml
site:
  title: "My Awesome Blog"
```

#### `site.description` (required)

Short description of your site. Used in meta tags and RSS feeds.

```yaml
site:
  description: "A blog about technology and design"
```

#### `site.url` (required)

Your site's base URL without trailing slash.

```yaml
site:
  url: "https://myblog.com"           # For GitHub Pages
  url: "https://example.com"          # Pair with baseUrl for subdirectories
```

#### `site.author` (optional)

Default post author. Can be overridden in individual posts.

```yaml
site:
  author: "Jane Doe"
```

#### `site.email` (optional)

Contact email, used in RSS feed.

```yaml
site:
  email: "hello@myblog.com"
```

#### `site.language` (optional)

Site language code. Default: `en`

```yaml
site:
  language: "en"      # English
  language: "es"      # Spanish
  language: "fr"      # French
  language: "de"      # German
  language: "ja"      # Japanese
```

#### `site.baseUrl` (optional)

Base URL path if site is in a subdirectory.

```yaml
site:
  url: "https://example.com"
  baseUrl: "/blog"        # Site accessible at /blog/
```

Notes:
- Use a leading slash and no trailing slash for `baseUrl`.
- Keep `site.url` free of the base path; the generator combines `url` + `baseUrl` for canonical/OG/Twitter/JSON-LD/feed links and client-side search.

---

### `blog`

Blog-specific settings.

#### `blog.postsPerPage` (optional)

Number of posts per page in blog listing. Default: `10`

```yaml
blog:
  postsPerPage: 5         # Show 5 posts per page
  postsPerPage: 20        # Show 20 posts per page
```

#### `blog.dateFormat` (optional)

Date format for post dates. Uses date-fns format. Default: `MMMM dd, yyyy`

```yaml
blog:
  dateFormat: "MMMM dd, yyyy"      # November 30, 2025
  dateFormat: "MMM dd, yy"         # Nov 30, 25
  dateFormat: "yyyy-MM-dd"         # 2025-11-30
  dateFormat: "dd/MM/yyyy"         # 30/11/2025
```

---

### `build`

Build output settings. Usually not needed (auto-configured).

#### `build.source` (optional)

Content source directory relative to content dir. Default: `content`

```yaml
build:
  source: "content"       # Default
  source: "posts"         # Alternative
```

#### `build.destination` (optional)

Build output directory. Default: `_site`

```yaml
build:
  destination: "_site"    # Default
  destination: "build"    # Alternative
```

#### `build.templates` (optional)

Template directory. Auto-configured, usually not needed.

```yaml
build:
  templates: "templates"
```

#### `build.assets` (optional)

Assets directory. Auto-configured, usually not needed.

```yaml
build:
  assets: "assets"
```

---

### `seo`

Search engine optimization settings.

#### `seo.enableSitemap` (optional)

Generate `sitemap.xml`. Default: `true`

```yaml
seo:
  enableSitemap: true     # Generate sitemap
  enableSitemap: false    # Skip sitemap
```

#### `seo.enableRSS` (optional)

Generate RSS feed at `/feed.xml`. Default: `true`

```yaml
seo:
  enableRSS: true         # Generate RSS
  enableRSS: false        # Skip RSS
```

#### `seo.keywords` (optional)

Global keywords for meta tags.

```yaml
seo:
  keywords:
    - "technology"
    - "programming"
    - "design"
```

#### `seo.ogImage` (optional)

Default Open Graph image URL.

```yaml
seo:
  ogImage: "https://myblog.com/assets/images/og-image.png"
```

#### `seo.twitterHandle` (optional)

Twitter handle for Twitter card tags.

```yaml
seo:
  twitterHandle: "@yourname"
```

---

### `features`

Optional features to enable/disable.

#### `features.search` (optional)

Enable client-side full-text search. Default: `true`

```yaml
features:
  search: true            # Enable search page
  search: false           # Disable search
```

#### `features.darkMode` (optional)

Enable dark mode toggle. Default: `true`

```yaml
features:
  darkMode: true          # Enable dark mode toggle
  darkMode: false         # Disable dark mode
```

#### `features.comments` (optional)

Enable comments section. Default: `false`

```yaml
features:
  comments: true          # Enable comments
  comments: false         # Disable comments
```

#### `features.analytics` (optional)

Enable analytics integration. Default: `false`

```yaml
features:
  analytics: true
```

---

### `navigation`

Main navigation menu items.

#### Structure

```yaml
navigation:
  - label: "Label"
    url: "/path/"
    title: "Optional tooltip"
  - label: "Another"
    url: "/another/"
```

#### Examples

```yaml
navigation:
  - label: "Home"
    url: "/"
  - label: "Blog"
    url: "/blog/"
  - label: "About"
    url: "/about/"
  - label: "Contact"
    url: "/contact/"
  - label: "Archives"
    url: "/archives/"
    title: "All posts by year"
```

#### Notes

- URLs can be internal (`/path/`) or external (`https://example.com`)
- Use `title` for hover tooltips
- Order defines menu order
- Supports unlimited items

---

### `social`

Social media links displayed in footer/sidebar.

#### Supported Platforms

```yaml
social:
  github: "https://github.com/yourname"
  twitter: "https://twitter.com/yourname"
  linkedin: "https://linkedin.com/in/yourname"
  instagram: "https://instagram.com/yourname"
  facebook: "https://facebook.com/yourname"
  youtube: "https://youtube.com/@yourname"
  email: "hello@example.com"
  rss: "/feed.xml"
```

#### Example

```yaml
social:
  github: "https://github.com/jane-doe"
  twitter: "https://twitter.com/janedoe"
  linkedin: "https://linkedin.com/in/janedoe"
  email: "jane@example.com"
```

---

### `footer`

Footer content.

#### `footer.text` (optional)

Footer copyright or info text.

```yaml
footer:
  text: "© 2025 Jane Doe. All rights reserved."
  text: "Made with ❤️ using MarkSite"
```

#### `footer.showPoweredBy` (optional)

Show "Powered by MarkSite" link. Default: `true`

```yaml
footer:
  showPoweredBy: true
  showPoweredBy: false
```

---

### `contentDir`

Specify content directory (alternative to CLI flag).

```yaml
contentDir: "./blog-data"
```

**Note**: When specified in `config.yaml`, this creates a reference to the content location. Usually better to use `--content-dir` CLI flag.

---

## Complete Example

```yaml
# Site information
site:
  title: "Jane's Tech Blog"
  description: "Thoughts on web development, design, and technology"
  url: "https://janedoe.com"
  author: "Jane Doe"
  email: "hello@janedoe.com"
  language: "en"

# Blog settings
blog:
  postsPerPage: 10
  dateFormat: "MMMM dd, yyyy"

# Build settings (usually auto-configured)
build:
  source: "content"
  destination: "_site"

# SEO settings
seo:
  enableSitemap: true
  enableRSS: true
  keywords:
    - "web development"
    - "design"
    - "technology"
  ogImage: "https://janedoe.com/assets/og-image.png"
  twitterHandle: "@janedoe"

# Features
features:
  search: true
  darkMode: true
  comments: false

# Navigation menu
navigation:
  - label: "Home"
    url: "/"
  - label: "Blog"
    url: "/blog/"
  - label: "Projects"
    url: "/projects/"
  - label: "About"
    url: "/about/"
  - label: "Contact"
    url: "/contact/"

# Social links
social:
  github: "https://github.com/janedoe"
  twitter: "https://twitter.com/janedoe"
  linkedin: "https://linkedin.com/in/janedoe"
  email: "hello@janedoe.com"

# Footer
footer:
  text: "© 2025 Jane Doe"
  showPoweredBy: true
```

---

## Using Configuration in Templates

Access configuration values in templates using Nunjucks:

```html
<!-- Site info -->
<h1>{{ site.title }}</h1>
<p>{{ site.description }}</p>

<!-- Navigation -->
<nav>
  {% for item in navigation %}
    <a href="{{ item.url }}">{{ item.label }}</a>
  {% endfor %}
</nav>

<!-- Social links -->
<div class="social">
  {% if social.github %}
    <a href="{{ social.github }}">GitHub</a>
  {% endif %}
  {% if social.twitter %}
    <a href="{{ social.twitter }}">Twitter</a>
  {% endif %}
</div>

<!-- Blog settings -->
<h2>Latest Posts</h2>
<p>Showing {{ blog.postsPerPage }} posts per page</p>
```

---

## YAML Syntax

Quick YAML reference:

```yaml
# Strings (quotes optional unless special chars)
key: "value"
key: value

# Numbers
key: 42
key: 3.14

# Booleans
key: true
key: false

# Lists
key:
  - item1
  - item2
  - item3

# Or inline
key: [item1, item2, item3]

# Objects
key:
  subkey: value
  another: 123

# Nested
key:
  nested:
    deep: value
```

---

## Validation

Validate your `config.yaml` using an online YAML validator:
- [yamllint.com](https://www.yamllint.com/)
- [yaml-online-parser.appspot.com](https://yaml-online-parser.appspot.com/)

Or check syntax:
```bash
python -m yaml < config.yaml   # If YAML validator available
```

---

## Troubleshooting

**"Invalid configuration" error?**
- Check YAML syntax (indentation matters!)
- Ensure quotes around values with special characters
- Use online YAML validator

**Configuration not loading?**
- Verify `config.yaml` exists in content directory
- Check file name spelling (case-sensitive)
- Check file permissions

**Values not showing in site?**
- Ensure templates use correct variable names
- Check YAML structure matches template expectations
- Rebuild after changing config

---

## Environment Variables

Some configuration can use environment variables:

```bash
# Example: Set site title from environment
export MARKSITE_SITE_TITLE="My Blog"
export MARKSITE_SITE_URL="https://myblog.com"
```

Then reference in config:

```yaml
site:
  title: ${MARKSITE_SITE_TITLE}
  url: ${MARKSITE_SITE_URL}
```

**Note**: This is typically used in CI/CD pipelines.

---

## See Also

- [Content Directory](./content-directory.md) - Config file location
- [CLI Reference](./cli-reference.md) - Build options
- [Templates](./templates.md) - Using config in templates
- [Getting Started](./getting-started.md) - Tutorial
