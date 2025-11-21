# MarkSite Usage Guide

Complete guide to using MarkSite for your blog.

## Table of Contents

- [Installation](#installation)
- [Getting Started](#getting-started)
- [Writing Content](#writing-content)
- [Configuration](#configuration)
- [Customization](#customization)
- [SEO](#seo)
- [Deployment](#deployment)
- [Tips & Tricks](#tips--tricks)

## Installation

### Prerequisites

- Node.js 18+ installed
- Basic knowledge of Markdown
- Text editor

### Setup

1. **Clone or download MarkSite**
   ```bash
   cd marksite
   npm install
   ```

2. **Make CLI executable** (Unix/Mac)
   ```bash
   chmod +x bin/marksite.js
   ```

3. **Optional: Install globally**
   ```bash
   npm link
   ```

## Getting Started

### Create Your Site

```bash
# Create new site
npm run init my-blog

# Navigate to site
cd my-blog
```

This creates:
```
my-blog/
├── content/
│   ├── posts/       # Blog posts
│   └── pages/       # Static pages
├── themes/
│   └── default/     # Theme files
├── public/          # Static assets
└── config.yml       # Configuration
```

### Start Development

```bash
# Start dev server
npm run dev
```

Open http://localhost:3000

The server watches for changes and rebuilds automatically!

### Create First Post

```bash
npm run new post "My First Post"
```

Edit `content/posts/my-first-post.md`:

```markdown
---
title: "My First Post"
date: 2024-01-15
author: "Your Name"
tags: ["intro", "blog"]
description: "My first blog post"
---

# Hello World!

This is my first post with **MarkSite**.

## What's Next?

- Write more posts
- Customize the theme
- Deploy to GitHub Pages
```

## Writing Content

### Post Structure

Every post needs front matter:

```markdown
---
title: "Post Title"          # Required
date: 2024-01-15            # Required
author: "Author Name"        # Optional
tags: ["tag1", "tag2"]      # Optional
description: "SEO desc"      # Recommended
image: "/images/cover.jpg"   # Optional
---

# Your Content

Write your post here using Markdown...
```

### Markdown Features

**Basic Formatting**
```markdown
**bold** *italic* ~~strikethrough~~
```

**Links**
```markdown
[Link text](https://example.com)
[Internal link](/about/)
```

**Images**
```markdown
![Alt text](/images/photo.jpg)
```

**Code Blocks**
````markdown
```javascript
const greeting = "Hello!";
console.log(greeting);
```
````

**Lists**
```markdown
- Item 1
- Item 2
  - Nested item

1. First
2. Second
3. Third
```

**Tables**
```markdown
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
```

**Blockquotes**
```markdown
> This is a quote
> It spans multiple lines
```

**Headings**
```markdown
# H1
## H2
### H3
```

### Creating Pages

Pages are for static content (About, Contact, etc.):

```bash
npm run new page "About"
```

Edit `content/pages/about.md`:

```markdown
---
title: "About Me"
permalink: "/about/"
---

# About Me

Information about yourself...
```

### Custom Permalinks

Control your URLs:

```yaml
---
title: "My Post"
permalink: "/custom-url/"
---
```

### Draft Posts

Set `published: false` to hide posts:

```yaml
---
title: "Work in Progress"
published: false
---
```

## Configuration

### Basic Config

Edit `config.yml`:

```yaml
site:
  title: "My Blog"
  description: "A blog about things"
  url: "https://yourusername.github.io"
  author: "Your Name"
  email: "you@example.com"

seo:
  twitter_handle: "@username"
  og_image: "/images/default-og.jpg"

build:
  posts_per_page: 10
  excerpt_length: 160
```

### Site Settings

| Setting | Description | Default |
|---------|-------------|---------|
| `site.title` | Site name | My Blog |
| `site.description` | Site description | - |
| `site.url` | Production URL | - |
| `site.author` | Default author | - |
| `site.email` | Contact email | - |
| `site.language` | Language code | en |

### Build Settings

| Setting | Description | Default |
|---------|-------------|---------|
| `build.posts_per_page` | Posts per page | 10 |
| `build.output_dir` | Output directory | _site |
| `build.excerpt_length` | Excerpt length | 160 |

### SEO Settings

| Setting | Description |
|---------|-------------|
| `seo.twitter_handle` | Twitter username |
| `seo.og_image` | Default social image |
| `seo.keywords` | Site keywords |

## Customization

### Theme Files

Located in `themes/default/`:

- `layout.ejs` - Main layout wrapper
- `index.ejs` - Home page template
- `post.ejs` - Blog post template
- `page.ejs` - Static page template
- `tag.ejs` - Tag archive template
- `tags.ejs` - All tags page
- `archive.ejs` - Date archive
- `404.ejs` - Error page

### Custom CSS

Add styles to `public/css/style.css`:

```css
/* Custom colors */
:root {
  --primary-color: #your-color;
}

/* Custom styles */
.post h2 {
  color: var(--primary-color);
}
```

### Custom JavaScript

Add scripts to `public/js/main.js`:

```javascript
// Custom functionality
document.addEventListener('DOMContentLoaded', () => {
  console.log('Site loaded!');
});
```

Include in `themes/default/layout.ejs`:

```html
<script src="/js/main.js"></script>
```

### Template Variables

Available in all templates:

| Variable | Description |
|----------|-------------|
| `config` | Site configuration |
| `post` | Current post data |
| `page` | Current page data |
| `posts` | Array of posts |
| `tags` | Tags object |
| `pagination` | Pagination data |

### Helper Functions

Available in templates:

```ejs
<%= formatDate(post.date) %>
<%= excerpt(text, 100) %>
<%= urlJoin('/blog', post.slug) %>
<%= escapeHtml(text) %>
```

## SEO

### Meta Tags

Automatically generated:
- Title and description
- Open Graph tags
- Twitter Cards
- Schema.org markup

### Sitemap

Automatically generated at `/sitemap.xml`

Submit to Google Search Console:
1. Verify your site
2. Submit sitemap URL
3. Monitor indexing

### RSS Feed

Automatically generated:
- `/feed.xml` - RSS 2.0
- `/atom.xml` - Atom 1.0
- `/feed.json` - JSON Feed

### Robots.txt

Automatically generated at `/robots.txt`

### SEO Checklist

- [ ] Set unique titles (under 60 chars)
- [ ] Write descriptions (under 160 chars)
- [ ] Add images with alt text
- [ ] Use heading hierarchy (H1 → H2 → H3)
- [ ] Add internal links
- [ ] Set canonical URLs
- [ ] Submit sitemap
- [ ] Test with Google Rich Results

## Deployment

### Build for Production

```bash
npm run build
```

Output is in `_site/` directory.

### GitHub Pages

**Method 1: GitHub Actions**

1. Copy `.github/workflows/deploy.yml` to your repo
2. Push to GitHub
3. Enable GitHub Pages in settings

**Method 2: Manual**

```bash
npm run build
cd _site
git init
git add .
git commit -m "Deploy"
git push -f YOUR_REPO main:gh-pages
```

### Custom Domain

1. Add `CNAME` file to `public/`:
   ```bash
   echo "yourdomain.com" > public/CNAME
   ```

2. Configure DNS:
   - CNAME: `www` → `username.github.io`
   - A records for apex domain

### Other Platforms

**Netlify**
- Build command: `npm run build`
- Publish directory: `_site`

**Vercel**
- Build command: `npm run build`
- Output directory: `_site`

**Custom Server**
```bash
npm run build
rsync -avz _site/ server:/var/www/html/
```

## Tips & Tricks

### Organizing Posts

Use dates in filenames:
```
2024-01-15-my-post.md
2024-01-20-another-post.md
```

### Image Optimization

- Use WebP format
- Compress before uploading
- Use appropriate sizes
- Add alt text

### Writing Tips

1. **Start with an outline**
2. **Write drafts** (set `published: false`)
3. **Use headers** for structure
4. **Add code examples**
5. **Include images**
6. **Proofread** before publishing

### Workflow

```bash
# Morning: Start new post
npm run new post "Today's Topic"

# Write and preview
npm run dev

# Afternoon: Finish and publish
npm run build
git add .
git commit -m "Add new post"
git push
```

### Keyboard Shortcuts

While dev server is running:
- Save file = Auto-rebuild
- Refresh browser = See changes

### Backup Strategy

```bash
# Regular commits
git add .
git commit -m "Update content"
git push
```

Your content is always safe in Git!

### Performance

- Keep images under 200KB
- Minimize custom CSS/JS
- Use system fonts
- Enable CDN (via hosting platform)

### Analytics

Add to `themes/default/layout.ejs`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

### Comments

Integrate with:
- Disqus
- Utterances (GitHub)
- Commento

Add script to post template.

### Search

Add Algolia or Lunr.js for client-side search.

### Social Sharing

Add to post template:

```html
<div class="share">
  <a href="https://twitter.com/share?url=URL&text=TITLE">
    Share on Twitter
  </a>
</div>
```

## Troubleshooting

### Build Fails

- Check front matter syntax
- Verify date format (YYYY-MM-DD)
- Check for unclosed code blocks

### Dev Server Won't Start

- Port already in use? Try different port
- Check Node.js version (18+)
- Run `npm install` again

### Changes Not Showing

- Hard refresh browser (Cmd+Shift+R)
- Check terminal for errors
- Restart dev server

### Broken Links

- Use absolute paths: `/images/photo.jpg`
- Check file exists in `public/`
- Verify URL in config

### Styling Issues

- Check CSS syntax
- Clear browser cache
- Inspect with DevTools

## Getting Help

- [Full Documentation](README.md)
- [Examples](EXAMPLES.md)
- [Deployment Guide](DEPLOYMENT.md)
- [Features List](FEATURES.md)
- [GitHub Issues](https://github.com/yourusername/marksite/issues)

## Next Steps

1. ✅ Install MarkSite
2. ✅ Create your first site
3. ✅ Write a post
4. ⬜ Customize theme
5. ⬜ Deploy to GitHub Pages
6. ⬜ Submit sitemap to Google
7. ⬜ Share your first post!

Happy blogging! 🚀

