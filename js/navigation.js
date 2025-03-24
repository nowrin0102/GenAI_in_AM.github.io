/**
 * GenAI in Additive Manufacturing - Navigation JavaScript
 * This file contains the functionality for the responsive navigation menu
 */

document.addEventListener('DOMContentLoaded', function() {
  setupMobileNavigation();
  setupDropdownMenus();
  setupActiveNavLinks();
  setupStickyHeader();
});

/**
 * Set up the mobile navigation toggle functionality
 */
function setupMobileNavigation() {
  const hamburgerMenu = document.querySelector('.hamburger-menu');
  const navLinks = document.querySelector('.nav-links');
  
  // If either element doesn't exist, return
  if (!hamburgerMenu || !navLinks) return;
  
  // Toggle the menu when hamburger icon is clicked
  hamburgerMenu.addEventListener('click', function() {
    // Toggle open class on hamburger icon
    this.classList.toggle('open');
    
    // Toggle open class on nav links
    navLinks.classList.toggle('open');
    
    // Prevent body scrolling when menu is open
    document.body.classList.toggle('nav-open');
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', function(event) {
    // If click is outside nav and hamburger, and menu is open
    if (
      !event.target.closest('.nav-links') && 
      !event.target.closest('.hamburger-menu') && 
      navLinks.classList.contains('open')
    ) {
      // Close the menu
      hamburgerMenu.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.classList.remove('nav-open');
    }
  });
  
  // Close menu when window is resized to desktop size
  window.addEventListener('resize', function() {
    if (window.innerWidth >= 768 && navLinks.classList.contains('open')) {
      hamburgerMenu.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.classList.remove('nav-open');
    }
  });
}

/**
 * Set up dropdown menus in the navigation
 */
function setupDropdownMenus() {
  const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
  
  dropdownToggles.forEach(toggle => {
    // Toggle dropdown on click
    toggle.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Close any open dropdowns first
      dropdownToggles.forEach(otherToggle => {
        if (otherToggle !== toggle) {
          otherToggle.classList.remove('open');
          
          // Get the dropdown content and hide it
          const otherDropdown = otherToggle.nextElementSibling;
          if (otherDropdown) {
            otherDropdown.classList.remove('open');
          }
        }
      });
      
      // Toggle the clicked dropdown
      this.classList.toggle('open');
      
      // Get the dropdown content and toggle it
      const dropdown = this.nextElementSibling;
      if (dropdown) {
        dropdown.classList.toggle('open');
      }
    });
  });
  
  // Close dropdowns when clicking outside
  document.addEventListener('click', function(event) {
    if (!event.target.closest('.dropdown')) {
      // Close all dropdowns
      dropdownToggles.forEach(toggle => {
        toggle.classList.remove('open');
        
        // Get the dropdown content and hide it
        const dropdown = toggle.nextElementSibling;
        if (dropdown) {
          dropdown.classList.remove('open');
        }
      });
    }
  });
}

/**
 * Highlight active nav link based on current page
 */
function setupActiveNavLinks() {
  // Get current page URL
  const currentPage = window.location.pathname;
  
  // Get all nav links
  const navLinks = document.querySelectorAll('.nav-links a');
  
  // Loop through each link
  navLinks.forEach(link => {
    // Get the link's href attribute
    const linkPath = link.getAttribute('href');
    
    // If the current page includes the link path (and it's not just the homepage)
    if (currentPage === linkPath || 
        (linkPath !== '/' && currentPage.includes(linkPath))) {
      // Add active class
      link.classList.add('active');
      
      // If the link is in a dropdown, highlight the parent too
      const parentDropdown = link.closest('.dropdown');
      if (parentDropdown) {
        const parentToggle = parentDropdown.querySelector('.dropdown-toggle');
        if (parentToggle) {
          parentToggle.classList.add('active');
        }
      }
    }
  });
}

/**
 * Setup sticky header that shows/hides on scroll
 */
function setupStickyHeader() {
  const header = document.querySelector('.navbar');
  if (!header) return;
  
  let lastScrollTop = 0;
  const scrollThreshold = 5; // Minimum scroll amount to trigger hide/show
  
  // Add scroll event listener
  window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // If we've scrolled more than the threshold
    if (Math.abs(scrollTop - lastScrollTop) > scrollThreshold) {
      // If scrolling down and beyond the header
      if (scrollTop > lastScrollTop && scrollTop > header.offsetHeight) {
        // Move the header up
        header.classList.add('navbar-hidden');
      } else {
        // If scrolling up or at the top
        header.classList.remove('navbar-hidden');
      }
      
      lastScrollTop = scrollTop;
    }
  });
}