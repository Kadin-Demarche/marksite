// Smooth scrolling for anchor links with offset for sticky navbar
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const target = document.querySelector(targetId);
    if (target) {
      const navbarHeight = 80; // Account for sticky navbar
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// Mobile menu toggle (if needed in future)
const initMobileMenu = () => {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
  }
};

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMobileMenu);
} else {
  initMobileMenu();
}

// External link handling
document.querySelectorAll('a[href^="http"]').forEach(link => {
  if (!link.href.includes(window.location.host)) {
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
  }
});

// Code block copy button
const addCopyButtons = () => {
  document.querySelectorAll('pre code').forEach(block => {
    const button = document.createElement('button');
    button.className = 'copy-button';
    button.textContent = 'Copy';
    button.addEventListener('click', () => {
      navigator.clipboard.writeText(block.textContent);
      button.textContent = 'Copied!';
      setTimeout(() => {
        button.textContent = 'Copy';
      }, 2000);
    });
    block.parentElement.style.position = 'relative';
    block.parentElement.appendChild(button);
  });
};

// Initialize copy buttons
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', addCopyButtons);
} else {
  addCopyButtons();
}

// Dark Mode Toggle
const initDarkMode = () => {
  const toggle = document.getElementById('darkModeToggle');
  if (!toggle) return;

  // Check for saved theme preference or default to light mode
  const currentTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);
  
  // Update button icon
  updateDarkModeIcon(currentTheme);

  // Toggle theme on button click
  toggle.addEventListener('click', () => {
    const theme = document.documentElement.getAttribute('data-theme');
    const newTheme = theme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateDarkModeIcon(newTheme);
  });
};

const updateDarkModeIcon = (theme) => {
  const toggle = document.getElementById('darkModeToggle');
  if (toggle) {
    toggle.textContent = theme === 'light' ? '🌙' : '☀️';
  }
};

// Initialize dark mode
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDarkMode);
} else {
  initDarkMode();
}

// Table of Contents - Active Section Highlighting
const initTOC = () => {
  const tocLinks = document.querySelectorAll('.table-of-contents a[data-target]');
  if (tocLinks.length === 0) return;

  const headings = Array.from(document.querySelectorAll('h2[id], h3[id], h4[id]'));
  
  const observerOptions = {
    rootMargin: '-80px 0px -80% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        tocLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('data-target') === id) {
            link.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);

  headings.forEach(heading => observer.observe(heading));
};

// Initialize TOC
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTOC);
} else {
  initTOC();
}

// Install button downloader with spinner and inline download
const initInstallButtons = () => {
  const buttons = document.querySelectorAll('.install-button');
  if (!buttons.length) return;

  const getFileName = (btn, url, disposition) => {
    if (disposition) {
      const match = /filename\\*=UTF-8''([^;]+)|filename="?([^\";]+)"?/i.exec(disposition);
      if (match) {
        return decodeURIComponent(match[1] || match[2]);
      }
    }
    const hinted = btn.getAttribute('data-filename');
    if (hinted) return hinted;
    try {
      const parsed = new URL(url);
      const last = parsed.pathname.split('/').filter(Boolean).pop();
      if (last) return last;
    } catch (err) {
      // ignore
    }
    return 'download';
  };

  buttons.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const url = btn.getAttribute('data-download-url') || btn.getAttribute('href');
      if (!url) return;
      e.preventDefault();
      if (btn.dataset.state === 'loading') return;

      const textEl = btn.querySelector('.install-button-text');
      const iconEl = btn.querySelector('.install-button-icon');
      const originalText = textEl ? textEl.textContent : '';
      const originalIcon = iconEl ? iconEl.textContent : '';

      const setState = (state, label, icon) => {
        btn.dataset.state = state || '';
        btn.classList.remove('success', 'error', 'loading');
        if (state) btn.classList.add(state);
        if (label && textEl) textEl.textContent = label;
        if (icon && iconEl) iconEl.textContent = icon;
      };

      const showFeedback = (message, isError = false) => {
        const card = btn.closest('.install-card');
        if (!card) return;
        let feedback = card.querySelector('.install-feedback');
        if (!feedback) {
          feedback = document.createElement('div');
          feedback.className = 'install-feedback';
          card.appendChild(feedback);
        }
        feedback.textContent = message || '';
        feedback.style.display = message ? 'block' : 'none';
        if (isError) {
          feedback.setAttribute('role', 'alert');
        } else {
          feedback.removeAttribute('role');
        }
      };

      showFeedback('');
      setState('loading', 'Downloading...', '⟳');

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Download failed: ${response.status}`);
        }

        const blob = await response.blob();
        const filename = getFileName(btn, url, response.headers.get('content-disposition'));

        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = filename;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(blobUrl);

        setState('success', 'Downloaded', '✓');
        showFeedback('');
        setTimeout(() => setState('', originalText, originalIcon), 2000);
      } catch (err) {
        console.error(err);
        setState('error', 'Retry', '↻');
        showFeedback(err?.message || 'Download failed. Please try again.', true);
        setTimeout(() => setState('', originalText, originalIcon), 2500);
      }
    });
  });
};

// Initialize install buttons
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initInstallButtons);
} else {
  initInstallButtons();
}
