/**
 * GenAI in Additive Manufacturing - Main JavaScript
 * This file contains the core JavaScript functionality for the website
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all components
  initializeComponents();
  
  // Set up scroll behavior
  setupSmoothScrolling();
  
  // Set up content depth indicators
  setupContentDepthIndicators();
  
  // Initialize code blocks (copy functionality)
  initializeCodeBlocks();
});

/**
 * Initialize all UI components
 */
function initializeComponents() {
  // This function will be called when the DOM is fully loaded
  console.log('GenAI in AM - All components initialized');
}

/**
 * Set up smooth scrolling for anchor links
 */
function setupSmoothScrolling() {
  // Select all links with hashes
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    // Add event listener to each anchor
    anchor.addEventListener('click', function(e) {
      // Prevent default anchor click behavior
      e.preventDefault();
      
      // Get the target element
      const targetId = this.getAttribute('href');
      
      // If the target is just "#", scroll to top
      if (targetId === "#") {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
        return;
      }
      
      // Otherwise find the target element and scroll to it
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        // Get the height of the navbar
        const navbar = document.querySelector('.navbar');
        const navbarHeight = navbar ? navbar.offsetHeight : 0;
        
        // Calculate the target position with offset for navbar
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
        
        // Scroll to target
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // Update URL with hash (without scrolling)
        history.pushState(null, null, targetId);
      }
    });
  });
}

/**
 * Set up content depth indicators to show reading progress
 */
function setupContentDepthIndicators() {
  // Get all section elements that should be tracked
  const sections = document.querySelectorAll('.content-section');
  const depthIndicator = document.querySelector('.content-depth-indicator');
  
  // If either sections or the indicator doesn't exist, return
  if (!sections.length || !depthIndicator) return;
  
  // Create markers for each section
  sections.forEach((section, index) => {
    const level = section.dataset.level || 'basic';
    const marker = document.createElement('div');
    marker.classList.add('depth-marker');
    marker.dataset.level = level;
    marker.dataset.index = index;
    
    // Add click event to scroll to section
    marker.addEventListener('click', () => {
      section.scrollIntoView({ behavior: 'smooth' });
    });
    
    depthIndicator.appendChild(marker);
  });
  
  // Update active marker on scroll
  window.addEventListener('scroll', () => {
    updateActiveDepthMarker(sections);
  });
  
  // Initial update
  updateActiveDepthMarker(sections);
}

/**
 * Update which depth marker is active based on scroll position
 */
function updateActiveDepthMarker(sections) {
  // Get current scroll position
  const scrollPosition = window.scrollY;
  
  // Get navbar height for offset calculation
  const navbar = document.querySelector('.navbar');
  const navbarHeight = navbar ? navbar.offsetHeight : 0;
  
  // Find the current section
  let currentSectionIndex = 0;
  
  sections.forEach((section, index) => {
    const sectionTop = section.offsetTop - navbarHeight - 20; // 20px buffer
    if (scrollPosition >= sectionTop) {
      currentSectionIndex = index;
    }
  });
  
  // Update the active marker
  const markers = document.querySelectorAll('.depth-marker');
  
  markers.forEach((marker, index) => {
    if (index === currentSectionIndex) {
      marker.classList.add('active');
    } else {
      marker.classList.remove('active');
    }
  });
}

/**
 * Initialize code blocks with copy functionality
 */
function initializeCodeBlocks() {
  // Find all code blocks
  const codeBlocks = document.querySelectorAll('.code-block');
  
  codeBlocks.forEach(block => {
    // Get the code element and copy button
    const codeElement = block.querySelector('pre code');
    const copyButton = block.querySelector('.copy-button');
    
    if (codeElement && copyButton) {
      // Add click event to copy button
      copyButton.addEventListener('click', () => {
        // Get text content from the code element
        const codeText = codeElement.textContent;
        
        // Copy to clipboard
        navigator.clipboard.writeText(codeText)
          .then(() => {
            // Update button text temporarily
            const originalText = copyButton.textContent;
            copyButton.textContent = 'Copied!';
            
            // Reset button text after a delay
            setTimeout(() => {
              copyButton.textContent = originalText;
            }, 2000);
          })
          .catch(err => {
            console.error('Failed to copy code:', err);
          });
      });
    }
  });
}

/**
 * Utility function to check if an element is in viewport
 */
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}