# Content Format Guide

Learn how to write content for MarkSite using Markdown with YAML front matter.

## File Structure

Every content file consists of two parts:

1. **Front Matter** - YAML metadata between `---` delimiters
2. **Content** - Markdown text

```markdown
---
title: "Page or Post Title"
date: 2025-11-30
author: "Author Name"
tags: ["tag1", "tag2"]
---

# Your Markdown content goes here

This is the body of your page or post.
```

## Front Matter

Front matter is YAML metadata that describes your content.

### Common Fields

#### `title` (required)

Page or post title.

```yaml
title: "My Awesome Post"
title: "Getting Started with MarkSite"
```

#### `date` (required for posts)

Publication date. Format: `YYYY-MM-DD`

```yaml
date: 2025-11-30
date: 2025-01-15
```

**Note**: Only required for posts in `content/posts/`. Optional for pages.
Future dates are treated as scheduled and skipped at build time unless `blog.allowFuture` is enabled.

#### `author` (optional)

Post author. Overrides site default author.

```yaml
author: "Jane Doe"
```

If not specified, uses `site.author` from `config.yaml`.

#### `tags` (optional)

List of content tags/categories.

```yaml
tags: ["web development", "tutorial"]
tags: []          # Empty tags
```

Create tag archive pages automatically at `/tag/{tag-name}/`.

#### `excerpt` (optional)

Brief summary shown in blog listings and RSS feeds.

```yaml
excerpt: "Learn how to set up your first MarkSite blog in 5 minutes"
```

If not provided, uses first 100 words of content.

#### `description` (optional)

SEO meta description. Shown in search results.

```yaml
description: "Complete guide to deploying MarkSite to GitHub Pages"
```

If not specified, uses excerpt or auto-generated summary.

#### `layout` (optional)

Content layout template. Default: `page` for regular pages, `post` for blog posts.

```yaml
layout: "page"     # Regular page
layout: "post"     # Blog post
layout: "custom"   # Custom layout (must exist in templates)
```

#### `slug` (optional)

URL-friendly identifier. Auto-generated from title if not provided.

```yaml
slug: "my-custom-slug"
```

For posts: `/blog/{slug}/`
For pages: `/{slug}/`

#### `draft` (optional)

Mark content as draft (not published). Default: `false`

```yaml
draft: false       # Published
draft: true        # Draft (hidden from listings)
```

#### `categories` (optional)

Categorize content in addition to tags.

```yaml
categories: ["guides", "product"]
```

#### `featured` (optional)

Mark content as featured.

```yaml
featured: true     # Show in featured sections
featured: false    # Regular content
```

### Example Front Matter

```yaml
---
title: "Building a Blog with MarkSite"
date: 2025-11-30
author: "Jane Doe"
tags: ["tutorial", "blogging", "static-sites"]
excerpt: "A step-by-step guide to creating your first blog with MarkSite"
description: "Learn how to build and deploy a static blog using MarkSite"
layout: "post"
slug: "marksite-tutorial"
featured: true
---
```

---

## Markdown Content

MarkSite uses [CommonMark](https://commonmark.org/) Markdown with syntax highlighting.

### Headings

```markdown
# H1 Heading
## H2 Heading
### H3 Heading
#### H4 Heading
##### H5 Heading
###### H6 Heading
```

### Paragraphs

```markdown
This is a paragraph.

This is another paragraph separated by a blank line.
```

### Line Breaks

```markdown
This line has a  
hard line break (two spaces at end)

This is a soft break
on the next line (no double space).
```

### Emphasis

```markdown
*italic* or _italic_
**bold** or __bold__
***bold italic***
~~strikethrough~~
```

Rendered:
- *italic* or _italic_
- **bold** or __bold__
- ***bold italic***
- ~~strikethrough~~

### Links

```markdown
[Link text](https://example.com)
[Link with title](https://example.com "Optional title")
[Internal link](/about/)
[Link to post](/blog/my-post/)

Direct link: https://example.com
```

### Images

```markdown
![Alt text](https://example.com/image.jpg)
![Alt text](/assets/images/local-image.png)
![Alt text with title](/assets/images/image.png "Image title")
```

**Tip**: Use absolute paths starting with `/`:
```markdown
![Logo](/assets/images/logo.png)
```

### Lists

#### Unordered Lists

```markdown
- Item 1
- Item 2
  - Nested item 2.1
  - Nested item 2.2
- Item 3
```

#### Ordered Lists

```markdown
1. First item
2. Second item
   1. Nested item 2.1
   2. Nested item 2.2
3. Third item
```

#### Task Lists

```markdown
- [x] Completed task
- [ ] Incomplete task
- [x] Another done task
```

### Blockquotes

```markdown
> This is a blockquote.
>
> It can span multiple paragraphs.
>
> > And can be nested.
```

Rendered as:
> This is a blockquote.
>
> It can span multiple paragraphs.

### Code

#### Inline Code

```markdown
Use `const x = 5;` for inline code.
```

#### Code Blocks

With language highlighting:

````markdown
```javascript
function hello() {
  console.log("Hello, World!");
}
```
````

Supported languages: `javascript`, `python`, `html`, `css`, `bash`, `json`, `yaml`, `markdown`, `sql`, etc.

### Horizontal Rules

```markdown
---
***
___
```

All create a horizontal line.

### Tables

```markdown
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |
```

Rendered:

| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |

### HTML

Raw HTML is supported:

```html
<div class="custom">
  <p>Custom HTML content</p>
</div>
```

---

## Special MarkSite Features

### Table of Contents

Auto-generated from headings:

```markdown
---
title: "Article with TOC"
---

# Article Title

<!-- TOC can be inserted here -->

## Section 1
Content...

## Section 2
Content...
```

The `toc` variable in templates contains the table of contents.

### Reading Time

Auto-calculated based on word count.

```markdown
<!-- In template -->
{{ post.readingTime }} min read
```

### Syntax Highlighting

Code blocks automatically highlighted:

````markdown
```python
def hello():
    print("Hello, World!")
```
````

Supported languages via [Highlight.js](https://highlightjs.org/):

- `javascript`, `typescript`
- `python`
- `html`, `css`, `scss`
- `bash`, `shell`, `zsh`
- `json`, `yaml`, `xml`
- `sql`
- `ruby`, `php`, `java`, `csharp`
- `go`, `rust`, `cpp`, `c`
- And many more...

### Install Buttons

Add a download-focused call to action for package files:

```markdown
:::install
[MarkSite CLI](https://example.com/marksite-cli.tar.gz)
v1.2.3 • 14 MB
:::
```

- First line: Markdown link used for the install button.
- Optional extra lines: helper text shown under the title (version, size, platform).
- Renders as a styled card with a prominent download button and the `download` attribute.

---

## File Organization

### Pages

Root-level `.md` files become pages:

```
content/
├── index.md         → /index.html (homepage)
├── about.md         → /about/index.html
├── contact.md       → /contact/index.html
├── privacy.md       → /privacy/index.html
└── posts/           → Blog posts
```

### Blog Posts

Posts in `posts/` subdirectory:

```
content/posts/
├── 2025-11-30-first-post.md     → /blog/first-post/
├── 2025-11-29-second-post.md    → /blog/second-post/
├── 2025-11-28-third-post.md     → /blog/third-post/
└── ...
```

**Naming Convention**: `YYYY-MM-DD-slug.md`

### Nested Content

Create subdirectories for organized content:

```
content/
├── documentation/
│   ├── index.md              → /documentation/
│   ├── getting-started.md    → /documentation/getting-started/
│   └── advanced.md           → /documentation/advanced/
├── tutorials/
│   ├── index.md              → /tutorials/
│   ├── react-basics.md       → /tutorials/react-basics/
│   └── vue-guide.md          → /tutorials/vue-guide/
└── ...
```

---

## Examples

### Simple Page

```markdown
---
title: "About Me"
description: "Learn more about me and my interests"
---

# About Me

Hi! I'm Jane Doe, a web developer and designer.

## My Skills

- Web Development
- UI/UX Design
- Project Management

## Contact

[Email me](mailto:jane@example.com) to get in touch!
```

### Blog Post

```markdown
---
title: "Getting Started with React Hooks"
date: 2025-11-30
author: "Jane Doe"
tags: ["react", "javascript", "tutorial"]
excerpt: "Learn how to use React Hooks to write functional components"
description: "Complete guide to React Hooks: useState, useEffect, and custom hooks"
---

# Getting Started with React Hooks

React Hooks were introduced in React 16.8 and have become the preferred way to write React components.

## What are Hooks?

Hooks are functions that let you use React features without writing class components.

## Common Hooks

### useState

```javascript
const [count, setCount] = useState(0);

function increment() {
  setCount(count + 1);
}
```

### useEffect

```javascript
useEffect(() => {
  console.log('Component mounted');
  return () => console.log('Component unmounted');
}, []);
```

## Best Practices

- Only call hooks at the top level
- Only call hooks from React functions
- Use the ESLint plugin to enforce these rules

## Learn More

Check out the [React documentation](https://react.dev/reference/react/hooks) for more details.
```

### Complex Post with Tables

```markdown
---
title: "JavaScript Performance Comparison"
date: 2025-11-30
tags: ["javascript", "performance", "optimization"]
---

# JavaScript Performance Comparison

Let's compare the performance of different JavaScript methods.

## Method Performance

| Method | Time (ms) | Memory | Notes |
|--------|-----------|--------|-------|
| Array.map() | 15 | Medium | Recommended |
| for loop | 12 | Low | Fast but verbose |
| forEach | 18 | Medium | Clean syntax |
| reduce | 20 | High | Flexible |

## Benchmark Results

```javascript
const arr = Array.from({length: 1000000}, (_, i) => i);

// Method 1: map()
console.time('map');
arr.map(x => x * 2);
console.timeEnd('map'); // ~15ms

// Method 2: for loop
console.time('for');
for (let i = 0; i < arr.length; i++) {
  arr[i] = arr[i] * 2;
}
console.timeEnd('for'); // ~12ms
```

## Conclusion

- Use `for` loops for performance-critical code
- Use `map()` for clarity and functional style
- Benchmark in your specific use case

> Remember: premature optimization is the root of all evil. Choose clarity first, optimize if needed.
```

---

## Tips & Best Practices

### Writing Good Content

1. **Use descriptive titles** - Helps SEO and readability
2. **Add excerpts** - Improves blog listings
3. **Use consistent dates** - Keeps chronological order
4. **Organize with tags** - Helps categorization
5. **Break into sections** - Improves scannability

### Markdown Best Practices

1. **One H1 per document** - Better structure and SEO
2. **Use proper heading hierarchy** - H1 → H2 → H3
3. **Add alt text to images** - Accessibility and SEO
4. **Link to related content** - Improves navigation
5. **Use lists for clarity** - Easier to read

### Organization

1. **Consistent naming** - `YYYY-MM-DD-lowercase-slug.md`
2. **Descriptive filenames** - Helps when listing files
3. **Related content together** - Use subdirectories
4. **Regular backups** - Git commits frequently

---

## Common Mistakes

**Missing front matter delimiter**
```markdown
# Wrong
title: "Post"
content here

# Correct
---
title: "Post"
---
content here
```

**Incorrect date format**
```yaml
# Wrong
date: "November 30, 2025"

# Correct
date: 2025-11-30
```

**Improper indentation in YAML**
```yaml
# Wrong
tags:
- tag1
- tag2

# Correct
tags:
  - tag1
  - tag2
```

**Link to image instead of embedding**
```markdown
# Wrong
[image.png](./image.png)

# Correct
![Alt text](/assets/images/image.png)
```

---

## See Also

- [Getting Started](./getting-started.md) - Quick tutorial
- [Configuration](./configuration.md) - Configure front matter defaults
- [Templates](./templates.md) - Use content in templates
- [CLI Reference](./cli-reference.md) - Create posts with `node cli.js new`
