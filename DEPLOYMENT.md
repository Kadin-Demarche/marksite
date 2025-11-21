# Deployment Guide

This guide covers deploying your MarkSite blog to various platforms.

## GitHub Pages

### Option 1: Manual Deployment

1. Build your site:
   ```bash
   npm run build
   ```

2. Deploy to gh-pages branch:
   ```bash
   cd _site
   git init
   git add .
   git commit -m "Deploy site"
   git push -f https://github.com/username/username.github.io.git main:gh-pages
   ```

3. Configure GitHub Pages:
   - Go to repository Settings → Pages
   - Select `gh-pages` branch
   - Save

### Option 2: GitHub Actions (Recommended)

Copy the included `.github/workflows/deploy.yml` to your repository:

```bash
mkdir -p .github/workflows
cp .github/workflows/deploy.yml .github/workflows/
```

Then simply push to main:
```bash
git push origin main
```

The workflow will automatically build and deploy your site!

### Update Your Config

In `config.yml`, set your GitHub Pages URL:

```yaml
site:
  url: "https://username.github.io"
```

## Netlify

1. Connect your GitHub repository to Netlify

2. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `_site`

3. Deploy!

Netlify will automatically rebuild on every push.

## Vercel

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   npm run build
   cd _site
   vercel
   ```

Or connect your GitHub repository via Vercel dashboard.

## Custom Server

After building, upload the `_site` directory to any web server:

```bash
npm run build
rsync -avz _site/ user@server:/var/www/html/
```

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /404.html;
    }
}
```

### Apache Configuration

Create `.htaccess` in your `_site` directory:

```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /$1/index.html [L]
```

## CloudFlare Pages

1. Connect your GitHub repository

2. Build settings:
   - Build command: `npm run build`
   - Build output directory: `_site`

3. Deploy!

## Custom Domain

### GitHub Pages

1. Add a `CNAME` file to your `public` directory:
   ```bash
   echo "yourdomain.com" > public/CNAME
   ```

2. Configure DNS:
   - Add CNAME record: `www` → `username.github.io`
   - Or A records for apex domain

### SSL/TLS

Most platforms provide free SSL certificates automatically:
- GitHub Pages: Automatic with custom domains
- Netlify: Automatic
- Vercel: Automatic
- CloudFlare: Automatic

## Build Optimization

### Pre-deployment Checklist

- [ ] Update `config.yml` with production URL
- [ ] Optimize images in `public/images/`
- [ ] Test build locally: `npm run build`
- [ ] Check for broken links
- [ ] Verify sitemap: `/sitemap.xml`
- [ ] Test RSS feed: `/feed.xml`
- [ ] Check mobile responsiveness

### Performance Tips

1. **Optimize Images**
   - Use WebP format
   - Compress images
   - Use appropriate sizes

2. **Minimize Dependencies**
   - Only include necessary CSS/JS
   - Use CDN for external resources

3. **Enable Caching**
   - Configure headers for static assets
   - Use service workers (optional)

## Continuous Deployment

### Git Workflow

```bash
# Make changes
git add .
git commit -m "Add new post"
git push origin main

# Site automatically rebuilds and deploys!
```

### Multiple Environments

Create branches for different environments:
- `main` - Production
- `staging` - Staging/preview
- `dev` - Development

## Troubleshooting

**Build fails in CI/CD**
- Check Node version matches your local environment
- Ensure all dependencies are in `package.json`
- Review build logs for specific errors

**Assets not loading**
- Verify paths in config (use absolute URLs)
- Check that `public` directory is being copied
- Ensure base URL is correct

**404 errors**
- Verify routing is configured correctly
- Check that index.html files exist in directories
- Configure server for SPA-style routing if needed

## Monitoring

After deployment, monitor:
- Google Search Console (submit sitemap)
- Analytics (Google Analytics, Plausible, etc.)
- Uptime monitoring
- Performance metrics (Lighthouse)

## Backup

Always keep your source files in version control:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/username/blog.git
git push -u origin main
```

Your `_site` directory can always be regenerated from source!

