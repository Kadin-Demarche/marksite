# Installation Guide

## Prerequisites

- Node.js 18 or higher
- npm or yarn

Check your version:
```bash
node --version  # Should be v18.0.0 or higher
```

## Quick Install

### For New Projects

```bash
npx marksite init my-blog
cd my-blog
npm install
npm run build
npm run serve
```

### Global Installation

Install once, use anywhere:

```bash
npm install -g marksite
marksite init my-blog
cd my-blog
npm install
```

Then use:
```bash
marksite build
marksite serve
marksite new "Post Title"
```

## Manual Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/marksite.git
   cd marksite
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Initialize project structure:**
   ```bash
   npm run init
   ```

4. **Build your site:**
   ```bash
   npm run build
   ```

5. **Start development server:**
   ```bash
   npm run serve
   ```

Visit http://localhost:3000

## Troubleshooting

### Port 3000 Already in Use

```bash
npm run serve -- --port 8080
```

### Permission Errors (Global Install)

```bash
sudo npm install -g marksite
```

Or use [nvm](https://github.com/nvm-sh/nvm) to avoid sudo.

### Build Fails

1. Delete `node_modules` and `package-lock.json`
2. Run `npm install` again
3. Try `npm run build`

### Windows Issues

Use PowerShell or Windows Terminal, not CMD.

## Upgrading

```bash
npm update marksite
```

Or for global:
```bash
npm update -g marksite
```

## Uninstall

Local:
```bash
npm uninstall marksite
```

Global:
```bash
npm uninstall -g marksite
```

## Next Steps

- Read the [Quick Start](QUICKSTART.md)
- Check out [Examples](EXAMPLES.md)
- Deploy to [GitHub Pages](#deploying)

## Deploying

See [README.md](README.md#deploy-to-github-pages) for deployment instructions.

