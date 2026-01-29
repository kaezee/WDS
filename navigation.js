// Compass Design System - Navigation
// Dynamically generates sidebar navigation for all pages

(function() {
  // Navigation structure
  const navigationItems = [
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

  // Get current page
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  // Generate navigation HTML
  function generateNavigation() {
    let navHTML = '';

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

    return navHTML;
  }

  // Insert navigation into page
  function initNavigation() {
    const sidenavElement = document.getElementById('sidenav');
    if (sidenavElement) {
      sidenavElement.innerHTML = generateNavigation();
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavigation);
  } else {
    initNavigation();
  }
})();
