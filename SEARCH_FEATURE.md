# Search Feature Documentation

MarkSite includes a powerful, client-side search feature with tag filtering.

## ✨ Features

- 🔍 **Full-text search** - Search across post titles, content, and tags
- 🏷️ **Tag filtering** - Filter posts by one or multiple tags
- ⚡ **Instant results** - Client-side search for blazing fast performance
- 🎯 **Smart relevance** - Posts are ranked by relevance to your query
- 💡 **Highlighting** - Search terms are highlighted in results
- 🔗 **URL parameters** - Share search results via URL
- 📱 **Responsive** - Works perfectly on mobile devices
- 🌙 **Dark mode support** - Follows your theme preference

## 🚀 How It Works

### Search Index Generation

During the build process, MarkSite generates a `search-index.json` file containing:

- Post titles
- Excerpts
- Cleaned content (HTML stripped, limited to 5000 chars for performance)
- Tags
- Authors
- Dates
- URLs

### Client-Side Search

The search runs entirely in the browser:

1. **Index Loading** - `search-index.json` is loaded once when you visit the search page
2. **Real-time Search** - As you type, results update instantly
3. **Tag Filtering** - Click tags to filter results
4. **Relevance Scoring** - Results are ranked by:
   - Title matches (highest priority)
   - Tag matches
   - Excerpt matches
   - Content matches

## 📖 Usage

### Basic Search

1. Click "Search" in the navigation menu or visit `/search/`
2. Type your search query in the search box
3. Results appear instantly

### Tag Filtering

1. Click on any tag to filter results
2. Click multiple tags to filter by multiple tags (OR logic)
3. Click "All Posts" to clear all tag filters
4. Active filters are shown below the search box

### Combining Search and Tags

You can use both text search and tag filters together:

1. Type a search query
2. Click one or more tags
3. Results will match your query AND have at least one of the selected tags

### URL Parameters

Share specific searches using URL parameters:

```
/search/?q=javascript          # Search for "javascript"
/search/?tag=tutorial          # Filter by "tutorial" tag
/search/?q=react&tag=frontend  # Search "react" with "frontend" tag
```

## 🎨 Customization

### Disable Search

To disable search, edit `config.yaml`:

```yaml
features:
  search: false
```

### Customize Search Index Size

Edit `lib/search.js` to change the content limit:

```javascript
.substring(0, 5000); // Change 5000 to your preferred limit
```

### Customize Relevance Scoring

Edit `assets/js/search.js` to adjust scoring weights:

```javascript
if (post.title.toLowerCase().includes(word)) score += 10;  // Title weight
if (post.excerpt.toLowerCase().includes(word)) score += 5; // Excerpt weight
if (post.tags.some(tag => tag.toLowerCase().includes(word))) score += 7; // Tag weight
if (searchText.includes(word)) score += 1; // Content weight
```

### Styling

The search page includes inline CSS that you can customize by editing `templates/search.html`.

Key CSS classes:
- `.search-container` - Main container
- `.search-input` - Search input field
- `.tag-filter` - Tag filter buttons
- `.search-result` - Individual result cards
- `.search-result-excerpt mark` - Highlighted search terms

## 🔧 Advanced Features

### Search from Any Page

Add a search form to any template:

```html
<form action="/search/" method="get">
  <input type="search" name="q" placeholder="Search...">
  <button type="submit">Search</button>
</form>
```

### Quick Search in Navbar

Add to `templates/base.html`:

```html
<div class="quick-search">
  <input 
    type="search" 
    id="quick-search" 
    placeholder="Search..."
    onkeypress="if(event.key==='Enter'){window.location.href='/search/?q='+this.value}"
  >
</div>
```

### Keyboard Shortcuts

Add to `assets/js/main.js`:

```javascript
// Focus search with "/" key
document.addEventListener('keypress', (e) => {
  if (e.key === '/' && e.target.tagName !== 'INPUT') {
    e.preventDefault();
    window.location.href = '/search/';
  }
});
```

## 📊 Performance

### Index Size

The search index size depends on your content:

- **10 posts** ≈ 50-100 KB
- **100 posts** ≈ 500 KB - 1 MB
- **1000 posts** ≈ 5-10 MB

For large sites (500+ posts), consider:

1. Reducing content length in the index
2. Implementing pagination in search results
3. Using a server-side search solution

### Optimization Tips

1. **Limit content length** - Already limited to 5000 chars per post
2. **Compress JSON** - Enable gzip compression on your server
3. **Lazy loading** - Search index only loads on the search page
4. **Caching** - Browser caches the index file

## 🎯 Examples

### Example 1: Search for Multiple Terms

```
Query: "javascript tutorial"
Result: Posts containing both "javascript" AND "tutorial" rank highest
```

### Example 2: Filter by Multiple Tags

```
Click: "tutorial" + "javascript"
Result: Posts tagged with either "tutorial" OR "javascript"
```

### Example 3: Combined Search

```
Query: "async"
Tags: "javascript", "tutorial"
Result: Posts containing "async" AND tagged with "javascript" OR "tutorial"
```

## 🐛 Troubleshooting

### Search Not Working

1. **Check search index exists**: Verify `/search-index.json` exists
2. **Check browser console**: Look for JavaScript errors
3. **Rebuild site**: Run `npm run build` to regenerate the index
4. **Check feature flag**: Ensure `features.search: true` in `config.yaml`

### No Results Found

1. **Try different keywords**: Use different search terms
2. **Clear filters**: Remove all tag filters
3. **Check spelling**: Verify search terms are spelled correctly

### Search is Slow

1. **Reduce content limit**: Lower the 5000 char limit in `lib/search.js`
2. **Fewer posts**: Consider pagination or archive system
3. **Browser cache**: The index should be cached after first load

## 🔮 Future Enhancements

Potential improvements for future versions:

- [ ] Fuzzy search (typo tolerance)
- [ ] Search suggestions/autocomplete
- [ ] Search within specific date ranges
- [ ] Boolean operators (AND, OR, NOT)
- [ ] Search analytics
- [ ] Recent searches
- [ ] Popular searches
- [ ] Category filtering (beyond tags)

## 📝 API Reference

### Search Index Structure

```json
{
  "posts": [
    {
      "title": "Post Title",
      "url": "/blog/post-slug/",
      "excerpt": "Post excerpt...",
      "content": "Full post content...",
      "tags": ["tag1", "tag2"],
      "author": "Author Name",
      "date": "2025-11-20T00:00:00.000Z",
      "formattedDate": "November 20, 2025",
      "readingTime": "5 min read"
    }
  ],
  "tags": [
    {
      "name": "javascript",
      "count": 15,
      "url": "/tag/javascript/"
    }
  ]
}
```

### JavaScript API

```javascript
// Access search data (after loaded)
const searchData = searchIndex;

// Programmatically search
currentFilters.query = "your query";
currentFilters.tags.add("tag-name");
performSearch();

// Clear search
currentFilters.query = "";
currentFilters.tags.clear();
performSearch();
```

## 💡 Best Practices

1. **Use descriptive titles** - They have the highest search weight
2. **Add relevant tags** - Tags significantly boost discoverability
3. **Write good excerpts** - Custom excerpts help search relevance
4. **Use keywords naturally** - Don't keyword-stuff, write naturally
5. **Keep posts focused** - Well-focused posts rank better in search

---

Happy searching! 🔍

