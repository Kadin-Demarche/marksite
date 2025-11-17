# Contributing to MarkSite

Thanks for considering contributing!

## How to Contribute

### Reporting Bugs

Open an issue with:
- Clear description
- Steps to reproduce
- Expected vs actual behavior
- Your environment (OS, Node version)

### Suggesting Features

Open an issue describing:
- The feature
- Why it's useful
- How it might work

### Pull Requests

1. Fork the repo
2. Create a branch: `git checkout -b feature-name`
3. Make your changes
4. Test thoroughly: `npm run build && npm run serve`
5. Commit: `git commit -m "Add feature"`
6. Push: `git push origin feature-name`
7. Open a PR

## Development Setup

```bash
git clone https://github.com/yourusername/marksite.git
cd marksite
npm install
npm run init
npm run build
npm run serve
```

## Code Style

- Use ES6+ features
- Follow existing patterns
- Keep functions focused
- Add comments only where necessary

## Testing

Before submitting:

```bash
npm run build   # Should complete without errors
npm run serve   # Should start successfully
```

Test your changes with:
- Creating new posts
- Building the site
- Viewing in browser
- Testing on mobile

## License

By contributing, you agree your contributions will be licensed under MIT.

