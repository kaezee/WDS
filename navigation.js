// COMPASS DESIGN SYSTEM - NAVIGATION
// Dynamically generates sidebar navigation for all pages

(function() {
  // ============================================================
  // NAVIGATION CONFIGURATION
  // ============================================================
  
  const navigationItems = [
    {
      title: 'Getting Started',
      items: [
        { name: 'Overview', href: 'index.html' }
      ]
    },
    {
      title: 'Foundation',
      items: [
        { name: 'Colors', href: 'colors.html' },
        { name: 'Typography', href: 'typography.html' }
      ]
    },
    {
      title: 'Components',
      items: [
        { name: 'Buttons', href: 'buttons.html' },
        { name: 'Certification Badges', href: 'badges.html' },
        { name: 'Status Indicators', href: 'status-indicators.html' },
        { name: 'Input Fields & Forms', href: 'forms.html' },
        { name: 'Accordion', href: 'accordion.html' },
        { name: 'Stepper', href: 'stepper.html' },
        { name: 'Snackbar', href: 'snackbar.html' },
        { name: 'Chips', href: 'chips.html' }
      ]
    },
    {
      title: 'Patterns',
      items: [
        { name: 'Product Cards', href: 'components.html' },
        { name: 'Examples', href: 'examples.html' }
      ]
    }
  ];

  // ============================================================
  // AUTO-DETECTION CONFIGURATION (Optional)
  // ============================================================
  
  // Enable auto-detection of new pages?
  const AUTO_DETECT_PAGES = true;
  
  // Pages to exclude from auto-detection
  const EXCLUDED_PAGES = [
    '404.html',
    'test.html',
    'draft.html',
    'temp.html'
  ];
  
  // Section to add auto-detected pages to
  const AUTO_DETECT_SECTION = 'Other Pages';

  // ============================================================
  // GET CURRENT PAGE
  // ============================================================
  
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  // ============================================================
  // AUTO-DETECTION: Discover unlisted HTML files
  // ============================================================
  
  async function getAutoDetectedPages() {
    if (!AUTO_DETECT_PAGES) return [];
    
    // Get all explicitly listed pages
    const listedPages = new Set();
    navigationItems.forEach(section => {
      section.items.forEach(item => {
        listedPages.add(item.href);
      });
    });
    
    // Detect new pages by trying to fetch them
    // Note: This only works if you have a pattern (e.g., all pages end in .html)
    // For production, you'd use a build script to generate this list
    
    const autoDetected = [];
    
    // Check if current page is unlisted
    if (currentPage && 
        currentPage.endsWith('.html') && 
        !listedPages.has(currentPage) && 
        !EXCLUDED_PAGES.includes(currentPage)) {
      
      // Generate friendly name from filename
      const friendlyName = currentPage
        .replace('.html', '')
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      autoDetected.push({
        name: friendlyName,
        href: currentPage,
        isAutoDetected: true
      });
    }
    
    return autoDetected;
  }

  // ============================================================
  // GENERATE NAVIGATION HTML
  // ============================================================
  
  async function generateNavigation() {
    let navHTML = '<aside class="sidenav">';
    
    // Add explicitly configured sections
    navigationItems.forEach(section => {
      navHTML += `
        <div class="sidenav-section">
          <div class="sidenav-section-title">${section.title}</div>
      `;
      
      section.items.forEach(item => {
        const isActive = currentPage === item.href ? 'active' : '';
        navHTML += `
          <a href="${item.href}" class="sidenav-item ${isActive}">
            ${item.name}
          </a>
        `;
      });
      
      navHTML += '</div>';
    });
    
    // Add auto-detected pages section (if any found)
    if (AUTO_DETECT_PAGES) {
      const autoDetected = await getAutoDetectedPages();
      
      if (autoDetected.length > 0) {
        navHTML += `
          <div class="sidenav-section">
            <div class="sidenav-section-title">${AUTO_DETECT_SECTION}</div>
        `;
        
        autoDetected.forEach(item => {
          const isActive = currentPage === item.href ? 'active' : '';
          navHTML += `
            <a href="${item.href}" class="sidenav-item ${isActive}">
              ${item.name}
              <span class="auto-detected-badge">New</span>
            </a>
          `;
        });
        
        navHTML += '</div>';
      }
    }
    
    navHTML += '</aside>';
    return navHTML;
  }

  // ============================================================
  // INJECT NAVIGATION INTO PAGE
  // ============================================================
  
  async function initNavigation() {
    const mainContent = document.querySelector('.main-content');
    
    if (mainContent) {
      const navHTML = await generateNavigation();
      mainContent.insertAdjacentHTML('beforebegin', navHTML);
      
      // Add styles for auto-detected badge
      if (AUTO_DETECT_PAGES) {
        addAutoDetectedStyles();
      }
    }
  }

  // ============================================================
  // STYLING FOR AUTO-DETECTED PAGES
  // ============================================================
  
  function addAutoDetectedStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .auto-detected-badge {
        display: inline-block;
        margin-left: 8px;
        padding: 2px 6px;
        background: #FEF3C7;
        color: #F59E0B;
        font-size: 11px;
        font-weight: 600;
        border-radius: 4px;
        text-transform: uppercase;
      }
    `;
    document.head.appendChild(style);
  }

  // ============================================================
  // INITIALIZE
  // ============================================================
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavigation);
  } else {
    initNavigation();
  }
})();
