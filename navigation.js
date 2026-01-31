// COMPASS DESIGN SYSTEM - NAVIGATION
// Dynamically generates sidebar navigation for all pages

(function() {
  // ============================================================
  // NAVIGATION CONFIGURATION
  // ============================================================
  
  const navigationItems = [
    {
      title: 'Getting Started',
      collapsible: true,
      items: [
        { name: 'Overview', href: 'index.html' }
      ]
    },
    {
      title: 'Foundation',
      collapsible: true,
      items: [
        { name: 'Colors', href: 'colors.html' },
        { name: 'Typography', href: 'typography.html' }
      ]
    },
    {
      title: 'Components',
      collapsible: true,
      items: [
        { name: 'Buttons', href: 'buttons.html' },
        { name: 'Certification Badges', href: 'badges.html' },
        { name: 'Status Indicators', href: 'status-indicators.html' },
        { name: 'Input Fields & Forms', href: 'forms.html' },
        { name: 'Accordion', href: 'accordion.html' },
        { name: 'Stepper', href: 'stepper.html' },
        { name: 'Snackbar', href: 'snackbar.html' },
        { name: 'Chips', href: 'chips.html' },
        { 
          name: 'Cards', 
          href: 'cards.html',
          collapsible: true,
          children: [
            { name: 'Product Cards', href: 'product-cards.html' },
            { name: 'Supplier Cards', href: 'supplier-cards.html' },
            { name: 'Checkout Cards', href: 'checkout-cards.html' },
            { name: 'Blog Cards', href: 'blog-cards.html' }
          ]
        },
        { name: 'Modal', href: 'modal.html' }
      ]
    },
    {
      title: 'Patterns',
      collapsible: true,
      items: [
        { name: 'Examples', href: 'examples.html' }
      ]
    }
  ];

  // ============================================================
  // AUTO-DETECTION CONFIGURATION (Optional)
  // ============================================================
  
  // Enable auto-detection of new pages?
  const AUTO_DETECT_PAGES = false; // Disabled for GitHub Pages
  
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
        if (item.children) {
          item.children.forEach(child => listedPages.add(child.href));
        }
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
      const isExpanded = section.items.some(item => {
        if (currentPage === item.href) return true;
        if (item.children) {
          return item.children.some(child => currentPage === child.href);
        }
        return false;
      });
      
      const collapsibleClass = section.collapsible ? 'sidenav-section-collapsible' : '';
      const expandedClass = isExpanded ? 'expanded' : '';
      
      navHTML += `
        <div class="sidenav-section ${collapsibleClass} ${expandedClass}">
          <div class="sidenav-section-header">
            <div class="sidenav-section-title">${section.title}</div>
            ${section.collapsible ? '<button class="sidenav-section-toggle" aria-label="Toggle section"><span class="sidenav-chevron"></span></button>' : ''}
          </div>
          <div class="sidenav-section-content ${expandedClass}">
      `;
      
      section.items.forEach(item => {
        const isActive = currentPage === item.href ? 'active' : '';
        
        // Check if item has children
        if (item.children && item.children.length > 0) {
          const isExpanded = item.children.some(child => currentPage === child.href) || currentPage === item.href;
          const collapsibleClass = item.collapsible ? 'sidenav-collapsible' : '';
          const expandedClass = isExpanded ? 'expanded' : '';
          
          // Parent item with children
          navHTML += `
            <div class="sidenav-item-parent ${collapsibleClass} ${expandedClass}">
              <div class="sidenav-item-wrapper">
                <a href="${item.href}" class="sidenav-item ${isActive}">
                  ${item.name}
                </a>
                ${item.collapsible ? '<button class="sidenav-toggle" aria-label="Toggle submenu"><span class="sidenav-chevron"></span></button>' : ''}
              </div>
              <div class="sidenav-children ${expandedClass}">
          `;
          
          // Add children
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
      
      navHTML += `
          </div>
        </div>
      `;
    });
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
      
      // Add styles for children and auto-detected badge
      addNavigationStyles();
    }
  }

  // ============================================================
  // STYLING FOR CHILDREN AND AUTO-DETECTED PAGES
  // ============================================================
  
  function addNavigationStyles() {
    const style = document.createElement('style');
    style.textContent = `
      /* Section-level collapsible */
      .sidenav-section-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--spacing-2);
      }
      
      .sidenav-section-toggle {
        width: 20px;
        height: 20px;
        background: none;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: var(--radius-sm);
        transition: background 0.2s ease;
        padding: 0;
      }
      
      .sidenav-section-toggle:hover {
        background: var(--color-pearl-100);
      }
      
      .sidenav-section-content {
        max-height: 2000px;
        overflow: hidden;
        transition: max-height 0.3s ease;
      }
      
      .sidenav-section-collapsible .sidenav-section-content:not(.expanded) {
        max-height: 0;
      }
      
      /* Item-level collapsible */
      .sidenav-item-parent {
        display: flex;
        flex-direction: column;
      }
      
      .sidenav-item-wrapper {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--spacing-2);
      }
      
      .sidenav-item-wrapper .sidenav-item {
        flex: 1;
      }
      
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
      }
      
      .sidenav-toggle:hover {
        background: var(--color-pearl-100);
      }
      
      .sidenav-chevron {
        width: 10px;
        height: 10px;
        border-right: 2px solid var(--color-pearl-500);
        border-bottom: 2px solid var(--color-pearl-500);
        transform: rotate(45deg);
        transition: transform 0.2s ease;
      }
      
      .sidenav-section-collapsible.expanded .sidenav-section-toggle .sidenav-chevron,
      .sidenav-collapsible.expanded .sidenav-chevron {
        transform: rotate(-135deg);
      }
      
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
      
      .sidenav-child {
        padding-left: var(--spacing-8) !important;
        font-size: 13px;
      }
      
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
    
    // Add click handlers for collapsible sections
    setTimeout(() => {
      // Section-level toggles
      document.querySelectorAll('.sidenav-section-toggle').forEach(toggle => {
        toggle.addEventListener('click', function(e) {
          e.preventDefault();
          const section = this.closest('.sidenav-section');
          const content = section.querySelector('.sidenav-section-content');
          
          section.classList.toggle('expanded');
          content.classList.toggle('expanded');
        });
      });
      
      // Item-level toggles
      document.querySelectorAll('.sidenav-toggle').forEach(toggle => {
        toggle.addEventListener('click', function(e) {
          e.preventDefault();
          const parent = this.closest('.sidenav-item-parent');
          const children = parent.querySelector('.sidenav-children');
          
          parent.classList.toggle('expanded');
          children.classList.toggle('expanded');
        });
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
