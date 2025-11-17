let searchIndex = null;
let allPosts = [];

// Load search index
async function loadSearchIndex() {
  try {
    const response = await fetch('/search-index.json');
    const data = await response.json();
    allPosts = data.posts || [];
    return allPosts;
  } catch (error) {
    console.error('Failed to load search index:', error);
    return [];
  }
}

// Simple search function
function searchPosts(query, selectedTags = []) {
  const lowerQuery = query ? query.toLowerCase() : '';
  
  let results = allPosts.filter(post => {
    // First, filter by tags if any are selected (AND logic - must have ALL selected tags)
    if (selectedTags.length > 0) {
      const hasAllTags = selectedTags.every(tag => post.tags && post.tags.includes(tag));
      if (!hasAllTags) return false;
    }
    
    // If no search query, show all posts (with tag filter applied if any)
    if (!query) {
      return true;
    }
    
    // If there's a search query, filter the results further
    return (
      post.title.toLowerCase().includes(lowerQuery) ||
      (post.excerpt && post.excerpt.toLowerCase().includes(lowerQuery)) ||
      (post.content && post.content.toLowerCase().includes(lowerQuery)) ||
      (post.tags && post.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
    );
  });
  
  // Sort by date, newest first
  return results.sort((a, b) => new Date(b.date) - new Date(a.date));
}

// Display search results
function displayResults(results) {
  const resultsContainer = document.getElementById('search-results');
  
  if (results.length === 0) {
    resultsContainer.innerHTML = '<p class="search-hint">No posts found matching your search.</p>';
    return;
  }
  
  const html = results.map(post => `
    <article class="search-result-item">
      <h2><a href="${post.url}">${post.title}</a></h2>
      <div class="post-meta">
        <time>${new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
      </div>
      ${post.excerpt ? `<p class="post-excerpt">${post.excerpt}</p>` : ''}
      ${post.tags.length > 0 ? `
        <div class="post-tags">
          ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
      ` : ''}
    </article>
  `).join('');
  
  resultsContainer.innerHTML = html;
}

// Get all unique tags
function getAllTags() {
  const tags = new Set();
  allPosts.forEach(post => {
    post.tags.forEach(tag => tags.add(tag));
  });
  return Array.from(tags).sort();
}

// Display tag filters
function displayTagFilters(selectedTags = []) {
  const container = document.getElementById('tag-filters');
  const tags = getAllTags();
  
  if (tags.length === 0) {
    container.innerHTML = '';
    return;
  }
  
  const html = tags.map(tag => {
    const isSelected = selectedTags.includes(tag);
    return `
      <button 
        class="tag ${isSelected ? 'tag-selected' : ''}" 
        data-tag="${tag}"
        style="${isSelected ? 'background-color: var(--primary-color); color: white;' : ''}"
      >
        ${tag}
      </button>
    `;
  }).join('');
  
  container.innerHTML = html;
  
  // Add click handlers
  container.querySelectorAll('.tag').forEach(button => {
    button.addEventListener('click', () => {
      const tag = button.dataset.tag;
      const index = selectedTags.indexOf(tag);
      
      if (index > -1) {
        selectedTags.splice(index, 1);
      } else {
        selectedTags.push(tag);
      }
      
      displayTagFilters(selectedTags);
      performSearch();
    });
  });
}

// Perform search
let selectedTags = [];
function performSearch() {
  const query = document.getElementById('search-input').value;
  const results = searchPosts(query, selectedTags);
  displayResults(results);
}

// Initialize search page
if (document.getElementById('search-input')) {
  loadSearchIndex().then(() => {
    displayTagFilters();
    
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', performSearch);
    
    // Check for URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');
    if (query) {
      searchInput.value = query;
    }
    
    // Always show results on load (all posts if no query)
    performSearch();
  });
}

