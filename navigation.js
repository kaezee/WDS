// COMPASS DESIGN SYSTEM - NAVIGATION
// Enhanced version with categorized collapsible navigation

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
        { name: 'Chips', href: 'chips.html' },
        { name: 'Accordion', href: 'accordion.html' },
        { 
          name: 'Cards',
          hasChildren: true,
          children: [
            { name: 'Product Cards', href: 'product-cards.html' },
            { name: 'Supplier Cards', href: 'supplier-cards.html' },
            { name: 'Checkout Cards', href: 'checkout-cards.html' },
            { name: 'Blog Cards', href: 'blog-cards.html' }
          ]
        },
        { 
          name: 'Form Components',
          hasChildren: true,
          children: [
            { name: 'Input Fields & Forms', href: 'forms.html' },
            { name: 'Dropdown Menu', href: 'dropdown.html' },
            { name: 'Search Bar', href: 'search.html' }
          ]
        },
        { 
          name: 'Feedback & Notifications',
          hasChildren: true,
          children: [
            { name: 'Snackbar', href: 'snackbar.html' },
            { name: 'Modal', href: 'modal.html' },
            { name: 'Tooltip', href: 'tooltip.html' }
          ]
        },
        { 
          name: 'Navigation & Layout',
          hasChildren: true,
          children: [
            { name: 'Breadcrumbs', href: 'breadcrumbs.html' },
            { name: 'Pagination', href: 'pagination.html' },
            { name: 'Tabs', href: 'tabs.html' },
            { name: 'Stepper', href: 'stepper.html' }
          ]
        },
        { 
          name: 'Data Display',
          hasChildren: true,
          children: [
            { name: 'Table', href: 'table.html' },
            { name: 'Empty States', href: 'empty-states.html' },
            { name: 'Loading States', href: 'loading-states.html' },
            { name: 'Status Indicators', href: 'status-indicators.html' }
          ]
        }
      ]
    },
    {
      title: 'Patterns',
      items: [
        { name: 'Examples', href: 'examples.html' }
      ]
    }
  ];

  // ============================================================
  // AUTO-DETECTION SETTINGS
  // ============================================================
  
  const CONFIG = {
    autoDetect: true,
    manifestFile: 'pages-manifest.json',
    excludedPages: [
      '404.html',
      'test.html',
      'draft.html',
      'temp.html',
      'navigation.html'
    ],
    autoDetectSection: 'Other Pages',
    showNewBadge: true,
    sortAlphabetically: true
  };

  // ============================================================
  // UTILITY: Generate friendly name from filename
  // ============================================================
  
  function generateFriendlyName(filename) {
    return filename
      .replace('.html', '')
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  // ============================================================
  // AUTO-DETECTION: Load manifest and find unlisted pages
  // ============================================================
  
  async function getAutoDetectedPages() {
    if (!CONFIG.autoDetect) return [];
    
    try {
      const response = await fetch(CONFIG.manifestFile);
      
      if (!response.ok) {
        console.log('No manifest file found - auto-detection disabled');
        return fallbackAutoDetection();
      }
      
      const manifest = await response.json();
      
      // Get all explicitly listed pages
      const listedPages = new Set();
      navigationItems.forEach(section => {
        section.items.forEach(item => {
          listedPages.add(item.href);
          if (item.children) {
            item.children.forEach(child => listedPages.add(child.href));
          }
        });
      });
      
      // Find unlisted pages
      const autoDetected = manifest.pages
        .filter(page => 
          !listedPages.has(page) && 
          !CONFIG.excludedPages.includes(page) &&
          page.endsWith('.html')
        )
        .map(page => ({
          name: generateFriendlyName(page),
          href: page,
          isAutoDetected: true
        }));
      
      if (CONFIG.sortAlphabetically) {
        autoDetected.sort((a, b) => a.name.localeCompare(b.name));
      }
      
      return autoDetected;
      
    } catch (error) {
      console.log('Auto-detection error:', error.message);
      return fallbackAutoDetection();
    }
  }

  // ============================================================
  // FALLBACK: Check if current page is unlisted
  // ============================================================
  
  function fallbackAutoDetection() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    const listedPages = new Set();
    navigationItems.forEach(section => {
      section.items.forEach(item => {
        listedPages.add(item.href);
        if (item.children) {
          item.children.forEach(child => listedPages.add(child.href));
        }
      });
    });
    
    if (currentPage && 
        currentPage.endsWith('.html') && 
        !listedPages.has(currentPage) && 
        !CONFIG.excludedPages.includes(currentPage)) {
      
      return [{
        name: generateFriendlyName(currentPage),
        href: currentPage,
        isAutoDetected: true
      }];
    }
    
    return [];
  }

  // ============================================================
  // GENERATE NAVIGATION HTML
  // ============================================================
  
  async function generateNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    let navHTML = '<aside class="sidenav">';
    
    // Add explicitly configured sections
    navigationItems.forEach(section => {
      navHTML += `
        <div class="sidenav-section">
          <div class="sidenav-section-title">${section.title}</div>
      `;
      
      section.items.forEach(item => {
        const isActive = currentPage === item.href ? 'active' : '';
        
        // Check if item has children (nested navigation)
        if (item.hasChildren && item.children && item.children.length > 0) {
          // Determine if any child is active
          const isChildActive = item.children.some(child => currentPage === child.href);
          const isExpanded = isChildActive;
          
          navHTML += `
            <div class="sidenav-item-parent ${isExpanded ? 'expanded' : ''}">
              <div class="sidenav-item-header">
                <span class="sidenav-item-label">
                  ${item.name}
                </span>
                <button class="sidenav-toggle" aria-label="Toggle ${item.name}">
                  <span class="sidenav-chevron"></span>
                </button>
              </div>
              <div class="sidenav-children ${isExpanded ? 'expanded' : ''}">
          `;
          
          // Add child items
          item.children.forEach(child => {
            const childActive = currentPage === child.href ? 'active' : '';
            navHTML += `
              <a href="${child.href}" class="sidenav-item sidenav-child ${childActive}">
                ${child.name}
              </a>
            `;
          });
          
          navHTML += `
              </div>
            </div>
          `;
        } else {
          // Regular item without children
          navHTML += `
            <a href="${item.href}" class="sidenav-item ${isActive}">
              ${item.name}
            </a>
          `;
        }
      });
      
      navHTML += '</div>';
    });
    
    // Add auto-detected pages section
    const autoDetected = await getAutoDetectedPages();
    
    if (autoDetected.length > 0) {
      navHTML += `
        <div class="sidenav-section">
          <div class="sidenav-section-title">${CONFIG.autoDetectSection}</div>
      `;
      
      autoDetected.forEach(item => {
        const isActive = currentPage === item.href ? 'active' : '';
        const badge = CONFIG.showNewBadge ? '<span class="auto-detected-badge">New</span>' : '';
        
        navHTML += `
          <a href="${item.href}" class="sidenav-item ${isActive}">
            ${item.name}
            ${badge}
          </a>
        `;
      });
      
      navHTML += '</div>';
    }
    
    navHTML += '</aside>';
    return navHTML;
  }

  // ============================================================
  // INJECT NAVIGATION
  // ============================================================
  
  async function initNavigation() {
    const mainContent = document.querySelector('.main-content');
    
    if (mainContent) {
      const navHTML = await generateNavigation();
      mainContent.insertAdjacentHTML('beforebegin', navHTML);
      
      // Add styles and event handlers
      addNavigationStyles();
      attachToggleHandlers();
    }
  }

  // ============================================================
  // STYLING
  // ============================================================
  
  function addNavigationStyles() {
    const style = document.createElement('style');
    style.textContent = `
      /* Nested navigation parent container */
      .sidenav-item-parent {
        display: flex;
        flex-direction: column;
      }
      
      /* Header with link + toggle button */
      .sidenav-item-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--spacing-2);
      }
      
      /* Non-clickable parent label */
      .sidenav-item-label {
        flex: 1;
        padding: var(--spacing-3) var(--spacing-4);
        font-family: var(--font-heading);
        font-size: 14px;
        font-weight: var(--font-weight-medium);
        color: var(--color-text-primary);
        cursor: default;
      }
      
      .sidenav-item-header .sidenav-item {
        flex: 1;
      }
      
      /* Toggle button for expand/collapse */
      .sidenav-toggle {
        width: 24px;
        height: 24px;
        background: none;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: var(--radius-sm);
        transition: background 0.2s ease;
        flex-shrink: 0;
      }
      
      .sidenav-toggle:hover {
        background: var(--color-pearl-100);
      }
      
      /* Chevron icon */
      .sidenav-chevron {
        width: 10px;
        height: 10px;
        border-right: 2px solid var(--color-pearl-500);
        border-bottom: 2px solid var(--color-pearl-500);
        transform: rotate(45deg);
        transition: transform 0.2s ease;
      }
      
      .sidenav-item-parent.expanded .sidenav-chevron {
        transform: rotate(-135deg);
      }
      
      /* Children container */
      .sidenav-children {
        display: flex;
        flex-direction: column;
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.3s ease;
      }
      
      .sidenav-children.expanded {
        max-height: 500px;
      }
      
      /* Child items (indented) */
      .sidenav-child {
        padding-left: var(--spacing-8) !important;
        font-size: 13px;
      }
      
      /* Auto-detected badge */
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
        letter-spacing: 0.5px;
      }
      
      .sidenav-item:hover .auto-detected-badge {
        background: #FDE68A;
      }
    `;
    document.head.appendChild(style);
  }

  // ============================================================
  // EVENT HANDLERS
  // ============================================================
  
  function attachToggleHandlers() {
    // Wait a tick for DOM to be ready
    setTimeout(() => {
      // Make entire header clickable
      document.querySelectorAll('.sidenav-item-header').forEach(header => {
        header.addEventListener('click', function(e) {
          e.preventDefault();
          
          const parent = this.closest('.sidenav-item-parent');
          const children = parent.querySelector('.sidenav-children');
          
          // Toggle expanded state
          parent.classList.toggle('expanded');
          children.classList.toggle('expanded');
        });
        
        // Add cursor pointer
        header.style.cursor = 'pointer';
      });
    }, 100);
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
