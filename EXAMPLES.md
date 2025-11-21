# MarkSite Examples

Real-world examples and recipes for common use cases.

## Example Blog Post

```markdown
---
title: "10 Tips for Better Code"
date: 2025-11-21
author: "John Doe"
tags: ["programming", "tips", "best-practices"]
excerpt: "Improve your coding skills with these 10 practical tips"
image: "/assets/images/coding-tips.jpg"
---

# 10 Tips for Better Code

Writing clean, maintainable code is crucial for any developer.

## 1. Use Meaningful Names

Variables and functions should clearly describe their purpose:

\`\`\`javascript
// Bad
const x = 10;

// Good
const maxRetryAttempts = 10;
\`\`\`

## 2. Keep Functions Small

Each function should do one thing well.

## 3. Write Tests

Tests give you confidence to refactor.

[Read more about testing...](https://example.com)

---

_What are your favorite coding tips? Share in the comments!_
```

## Example Landing Page

```markdown
---
title: "Welcome to My Portfolio"
layout: page
---

# Hi, I'm Jane Smith

I'm a **full-stack developer** passionate about creating beautiful web experiences.

## What I Do

- 🎨 Frontend Development
- ⚙️ Backend Architecture
- 📱 Mobile Apps
- ☁️ Cloud Infrastructure

## Featured Projects

### Project Alpha

A revolutionary app that does amazing things.
[View Project →](/projects/alpha)

### Project Beta

An open-source tool used by thousands.
[View Project →](/projects/beta)

## Get In Touch

- 📧 [Email me](mailto:jane@example.com)
- 🐦 [Twitter](https://twitter.com/janesmith)
- 💼 [LinkedIn](https://linkedin.com/in/janesmith)

[View my resume →](/resume)
```

## Example Tutorial Post

```markdown
---
title: "Building a REST API with Node.js"
date: 2025-11-21
author: "Tech Writer"
tags: ["nodejs", "tutorial", "api"]
excerpt: "A step-by-step guide to building your first REST API"
---

# Building a REST API with Node.js

Let's build a simple REST API from scratch.

## Prerequisites

- Node.js 18+
- npm or yarn
- Basic JavaScript knowledge

## Step 1: Setup

First, initialize your project:

\`\`\`bash
mkdir my-api
cd my-api
npm init -y
npm install express
\`\`\`

## Step 2: Create the Server

Create `server.js`:

\`\`\`javascript
const express = require('express');
const app = express();

app.get('/api/users', (req, res) => {
res.json({ users: [] });
});

app.listen(3000, () => {
console.log('Server running on port 3000');
});
\`\`\`

## Step 3: Test It

\`\`\`bash
node server.js
curl http://localhost:3000/api/users
\`\`\`

## Next Steps

- Add database integration
- Implement authentication
- Add error handling

## Resources

- [Express Documentation](https://expressjs.com)
- [Node.js Best Practices](https://example.com)
```

## Config Examples

### Personal Blog

```yaml
site:
  title: "My Journey"
  description: "Personal thoughts and experiences"
  url: "https://johndoe.github.io"
  author: "John Doe"

blog:
  postsPerPage: 5
  dateFormat: "MMMM dd, yyyy"

navigation:
  - title: "Home"
    url: "/"
  - title: "Blog"
    url: "/blog"
  - title: "About"
    url: "/about"
```

### Tech Blog

```yaml
site:
  title: "Code & Coffee"
  description: "Tutorials, tips, and tech thoughts"
  url: "https://techblog.dev"
  author: "TechWriter"

blog:
  postsPerPage: 15
  dateFormat: "MMM dd, yyyy"

features:
  syntaxHighlighting: true
  tableOfContents: true
  readingTime: true

navigation:
  - title: "Tutorials"
    url: "/blog"
  - title: "Snippets"
    url: "/snippets"
  - title: "About"
    url: "/about"
```

### Company Blog

```yaml
site:
  title: "Acme Corp Blog"
  description: "Updates and insights from Acme Corp"
  url: "https://blog.acme.com"
  author: "Acme Team"

blog:
  postsPerPage: 10
  dateFormat: "MMMM dd, yyyy"

seo:
  enableSitemap: true
  enableRSS: true
  twitterHandle: "@acmecorp"

navigation:
  - title: "News"
    url: "/blog"
  - title: "Products"
    url: "/products"
  - title: "Careers"
    url: "/careers"
  - title: "Contact"
    url: "/contact"
```

## Custom Template Example

### Custom Post Layout

Create `templates/tutorial.html`:

```html
{% extends "base.html" %} {% block content %}
<div class="container">
  <article class="tutorial">
    <div class="tutorial-header">
      <span class="tutorial-label">Tutorial</span>
      <h1>{{ post.title }}</h1>

      <div class="tutorial-meta">
        <span>⏱️ {{ post.readingTime }}</span>
        <span>📅 {{ post.formattedDate }}</span>
        {% if post.difficulty %}
        <span class="difficulty-{{ post.difficulty }}">
          {{ post.difficulty | upper }}
        </span>
        {% endif %}
      </div>
    </div>

    {% if post.prerequisites %}
    <div class="prerequisites">
      <h2>Prerequisites</h2>
      <ul>
        {% for req in post.prerequisites %}
        <li>{{ req }}</li>
        {% endfor %}
      </ul>
    </div>
    {% endif %}

    <div class="tutorial-content">{{ content | safe }}</div>

    {% if post.resources %}
    <div class="resources">
      <h2>Additional Resources</h2>
      <ul>
        {% for resource in post.resources %}
        <li><a href="{{ resource.url }}">{{ resource.title }}</a></li>
        {% endfor %}
      </ul>
    </div>
    {% endif %}
  </article>
</div>
{% endblock %}
```

Use it in your post:

```markdown
---
title: "Advanced React Patterns"
layout: tutorial
difficulty: intermediate
prerequisites:
  - "React basics"
  - "JavaScript ES6+"
resources:
  - title: "React Docs"
    url: "https://react.dev"
---

Your content here...
```

## Custom Filter Example

Add to `lib/template.js`:

```javascript
// Truncate text
this.env.addFilter("truncate", (str, length) => {
  if (str.length <= length) return str;
  return str.substring(0, length) + "...";
});

// Format number
this.env.addFilter("number_format", (num) => {
  return new Intl.NumberFormat().format(num);
});

// Pluralize
this.env.addFilter("pluralize", (count, singular, plural) => {
  return count === 1 ? singular : plural;
});
```

Use in templates:

```html
<p>{{ post.excerpt | truncate(150) }}</p>
<p>{{ views | number_format }} views</p>
<p>{{ posts.length }} {{ posts.length | pluralize('post', 'posts') }}</p>
```

## Deployment Examples

### Netlify

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "_site"

[[redirects]]
  from = "/*"
  to = "/404.html"
  status = 404
```

### Vercel

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "_site",
  "installCommand": "npm install"
}
```

### Custom Domain (GitHub Pages)

1. Add `CNAME` file to `_site/`:

```
blog.example.com
```

2. Update `config.yaml`:

```yaml
site:
  url: "https://blog.example.com"
```

## Tips & Tricks

### Add Reading Progress

Already included! See `assets/js/main.js`

### Add Google Analytics

In `templates/base.html`, before `</head>`:

```html
<!-- Google Analytics -->
<script
  async
  src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag("js", new Date());
  gtag("config", "G-XXXXXXXXXX");
</script>
```

### Add Comments (Disqus)

In `templates/post.html`, after content:

```html
<div id="disqus_thread"></div>
<script>
  var disqus_config = function () {
    this.page.url = "{{ site.url }}{{ post.url }}";
    this.page.identifier = "{{ post.slug }}";
  };
  (function () {
    var d = document,
      s = d.createElement("script");
    s.src = "https://YOUR-SITE.disqus.com/embed.js";
    s.setAttribute("data-timestamp", +new Date());
    (d.head || d.body).appendChild(s);
  })();
</script>
```

### Newsletter Signup

Add to footer or post template:

```html
<div class="newsletter-signup">
  <h3>Subscribe to Newsletter</h3>
  <form action="https://yourservice.com/subscribe" method="post">
    <input type="email" name="email" placeholder="your@email.com" required />
    <button type="submit">Subscribe</button>
  </form>
</div>
```

---

Need more examples? Check the [README.md](README.md) or open an issue!
