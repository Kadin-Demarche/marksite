# Quick Start Guide

Get your blog running in 5 minutes.

## 1. Install Dependencies

```bash
cd marksite
npm install
```

## 2. Initialize Your Site

```bash
npm run init
```

This creates sample content, templates, and configuration.

## 3. Customize Configuration

Edit `config.yaml`:

```yaml
site:
  title: "My Awesome Blog"
  description: "Thoughts and tutorials"
  url: "https://yourusername.github.io"
  author: "Your Name"
  email: "your@email.com"
```

## 4. Write Your First Post

```bash
npm run new "Hello World"
```

This creates `content/posts/2025-11-21-hello-world.md`

Edit the file:

```markdown
---
title: "Hello World"
date: 2025-11-21
author: "Your Name"
tags: ["introduction"]
excerpt: "My first blog post"
---

# Hello World

Welcome to my blog! This is my first post.

## What to Expect

- Technical tutorials
- Personal thoughts
- Project updates

Stay tuned!
```

## 5. Build Your Site

```bash
npm run build
```

Your site is now in the `_site/` directory!

## 6. Preview Locally

```bash
npm run serve
```

Visit http://localhost:3000 to see your site!

## 7. Deploy to GitHub Pages

### Method 1: Manual Deploy

1. Create a repository on GitHub
2. Update `config.yaml` with your URL
3. Build the site: `npm run build`
4. Push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/your-repo.git
   git push -u origin main
   ```
5. Enable GitHub Pages in repository settings

### Method 2: GitHub Actions (Recommended)

1. Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
      - run: npm install
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./_site
```

2. Push to GitHub - automatic deployment!

## Common Tasks

### Create a New Post

```bash
npm run new "Post Title"
```

### Add a New Page

Create `content/pagename.md`:

```markdown
---
title: "Page Title"
---

Content here...
```

### Add Images

Place images in `assets/images/` and reference:

```markdown
![Alt text](/assets/images/photo.jpg)
```

### Customize Styles

Edit `assets/css/style.css`

### Change Theme Colors

Update CSS variables in `assets/css/style.css`:

```css
:root {
  --color-primary: #2563eb; /* Change to your color */
}
```

## Tips

- Posts are sorted by date (newest first)
- Use tags to organize content
- Enable dark mode in config
- Syntax highlighting works automatically
- Images are lazy-loaded for performance

## Troubleshooting

**Site not building?**

- Check YAML frontmatter syntax
- Ensure dates are in YYYY-MM-DD format
- Run `npm install` again

**Changes not showing?**

- Clear `_site/` directory
- Rebuild with `npm run build`
- Hard refresh browser (Cmd+Shift+R or Ctrl+Shift+R)

**GitHub Pages not working?**

- Check repository settings
- Verify `config.yaml` URL matches your repo
- Wait a few minutes for deployment

## Next Steps

1. ✅ Read the full [README.md](README.md)
2. ✅ Customize your theme
3. ✅ Write more posts
4. ✅ Add your social links
5. ✅ Set up Google Analytics (optional)
6. ✅ Share your blog!

---

Need help? Check the [README.md](README.md) for detailed documentation!
