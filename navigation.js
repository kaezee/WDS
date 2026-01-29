// COMPASS DESIGN SYSTEM - NAVIGATION
// Include this script on every page for consistent sidebar navigation

document.addEventListener('DOMContentLoaded', function() {
    // Create and inject sidebar HTML
    const sidebarHTML = `
        <aside class="sidenav">
            <div class="sidenav-section">
                <div class="sidenav-section-title">Getting Started</div>
                <a href="index.html" class="sidenav-item">Overview</a>
            </div>

            <div class="sidenav-section">
                <div class="sidenav-section-title">Foundation</div>
                <a href="colors.html" class="sidenav-item">Colors</a>
                <a href="typography.html" class="sidenav-item">Typography</a>
            </div>

            <div class="sidenav-section">
                <div class="sidenav-section-title">Components</div>
                <a href="buttons.html" class="sidenav-item">Buttons</a>
                <a href="badges.html" class="sidenav-item">Badges</a>
                <a href="forms.html" class="sidenav-item">Input Fields</a>
                <a href="accordion.html" class="sidenav-item">Accordion</a>
                <a href="stepper.html" class="sidenav-item">Stepper</a>
                <a href="snackbar.html" class="sidenav-item">Snackbar</a>
                <a href="chips.html" class="sidenav-item">Chips</a>
            </div>

            <div class="sidenav-section">
                <div class="sidenav-section-title">Patterns</div>
                <a href="components.html" class="sidenav-item">Product Cards</a>
            </div>
        </aside>
    `;

    // Insert sidebar before main content
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.insertAdjacentHTML('beforebegin', sidebarHTML);
        
        // Set active states based on current page
        highlightActivePage();
    }
});

// Highlight active page
function highlightActivePage() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Find and activate matching links
    document.querySelectorAll('.sidenav-item').forEach(link => {
        const linkHref = link.getAttribute('href');
        if (!linkHref) return;
        
        // Check if this is the active page
        if (linkHref === currentPage || linkHref === `./${currentPage}`) {
            link.classList.add('active');
        }
    });
}
