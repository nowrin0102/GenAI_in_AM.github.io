/**
 * GenAI in Additive Manufacturing - Search Functionality
 * This file contains the client-side search implementation
 */

// Search index to store content from all pages
let searchIndex = [];
let isSearchIndexLoaded = false;

document.addEventListener('DOMContentLoaded', function() {
  initializeSearch();
});

/**
 * Initialize the search functionality
 */
function initializeSearch() {
  const searchInput = document.querySelector('.search-input');
  const searchResults = document.querySelector('.search-results');
  
  // If search elements don't exist, return
  if (!searchInput) return;
  
  // Create search results container if it doesn't exist
  if (!searchResults) {
    const searchContainer = document.querySelector('.search-container');
    
    if (searchContainer) {
      const resultsDiv = document.createElement('div');
      resultsDiv.className = 'search-results';
      searchContainer.appendChild(resultsDiv);
      searchResults = resultsDiv;
    }
  }
  
  // Load search index if not already loaded
  if (!isSearchIndexLoaded) {
    loadSearchIndex();
  }
  
  // Add event listener for search input
  searchInput.addEventListener('input', debounce(function() {
    const query = this.value.trim();
    
    if (query.length < 2) {
      hideSearchResults();
      return;
    }
    
    performSearch(query);
  }, 300)); // Debounce with 300ms delay
  
  // Close search results when clicking outside
  document.addEventListener('click', function(event) {
    if (!event.target.closest('.search-container')) {
      hideSearchResults();
    }
  });
  
  // Add keyboard navigation for search results
  addSearchKeyboardNavigation(searchInput, searchResults);
}

/**
 * Load the search index from available pages
 * In a production environment, this would be a pre-built index file
 */
function loadSearchIndex() {
  // For demonstration, we'll build the index from visible content
  // In a real implementation, we'd use a pre-built index file
  
  // For now, mark as loaded but build it asynchronously
  isSearchIndexLoaded = true;
  
  // Fetch the sitemap or known page list to build the index
  console.log('Building search index...');
  
  // This is a simplified approach to build a search index
  // In production, we would have a build step that creates this index
  
  // Sample approach: Get all indexable elements from current page
  const indexableElements = document.querySelectorAll('main h1, main h2, main h3, main p, main li');
  
  indexableElements.forEach(element => {
    const text = element.textContent.trim();
    const type = element.tagName.toLowerCase();
    
    // Get URL of current page
    const url = window.location.pathname;
    
    // Get parent section for context
    const section = getParentSection(element);
    
    // Add to index if there's actual content
    if (text.length > 0) {
      searchIndex.push({
        type: type,
        text: text,
        url: url,
        section: section
      });
    }
  });
  
  // In a real implementation, we would fetch and index all pages
  console.log(`Built search index with ${searchIndex.length} entries`);
}

/**
 * Get the parent section (heading) of an element for context
 */
function getParentSection(element) {
  // Find the closest preceding heading
  let currentElement = element.previousElementSibling;
  while (currentElement) {
    if (['H1', 'H2', 'H3'].includes(currentElement.tagName)) {
      return currentElement.textContent.trim();
    }
    currentElement = currentElement.previousElementSibling;
  }
  
  // If no heading found, look for parent container's heading
  const parentSection = element.closest('section');
  if (parentSection) {
    const sectionHeading = parentSection.querySelector('h1, h2, h3');
    if (sectionHeading) {
      return sectionHeading.textContent.trim();
    }
  }
  
  return '';
}

/**
 * Perform search based on the query
 */
function performSearch(query) {
  // If search index is empty, return
  if (searchIndex.length === 0) {
    console.log('Search index is empty. Nothing to search.');
    return;
  }
  
  // Simple search algorithm: Find entries that include the query
  const results = searchIndex.filter(entry => {
    // Case insensitive search in the text content
    return entry.text.toLowerCase().includes(query.toLowerCase());
  });
  
  // Sort results by relevance (heading types first, then content)
  results.sort((a, b) => {
    // Sort by type (headings first)
    const typeOrder = {
      'h1': 1,
      'h2': 2,
      'h3': 3,
      'p': 4,
      'li': 5
    };
    
    const typeScoreA = typeOrder[a.type] || 99;
    const typeScoreB = typeOrder[b.type] || 99;
    
    // If same type, check if exact match
    if (typeScoreA === typeScoreB) {
      const aExact = a.text.toLowerCase() === query.toLowerCase() ? 0 : 1;
      const bExact = b.text.toLowerCase() === query.toLowerCase() ? 0 : 1;
      
      if (aExact !== bExact) return aExact - bExact;
      
      // If still tied, check if starts with query
      const aStarts = a.text.toLowerCase().startsWith(query.toLowerCase()) ? 0 : 1;
      const bStarts = b.text.toLowerCase().startsWith(query.toLowerCase()) ? 0 : 1;
      
      return aStarts - bStarts;
    }
    
    return typeScoreA - typeScoreB;
  });
  
  // Limit to top results
  const limitedResults = results.slice(0, 10);
  
  // Display results
  displaySearchResults(limitedResults, query);
}

/**
 * Display search results in the UI
 */
function displaySearchResults(results, query) {
  const searchResults = document.querySelector('.search-results');
  if (!searchResults) return;
  
  // Clear previous results
  searchResults.innerHTML = '';
  
  // If no results, show a message
  if (results.length === 0) {
    searchResults.innerHTML = `
      <div class="search-no-results">
        <p>No results found for "${query}"</p>
      </div>
    `;
    searchResults.classList.add('active');
    return;
  }
  
  // Create results list
  const resultsList = document.createElement('ul');
  resultsList.className = 'search-results-list';
  
  // Add each result to the list
  results.forEach((result, index) => {
    const listItem = document.createElement('li');
    
    // Create result item with highlighting
    const highlightedText = highlightQuery(result.text, query);
    
    listItem.innerHTML = `
      <a href="${result.url}" class="search-result-item" data-index="${index}">
        <div class="result-title">${highlightedText}</div>
        ${result.section ? `<div class="result-section">${result.section}</div>` : ''}
        <div class="result-type">${getTypeLabel(result.type)}</div>
      </a>
    `;
    
    resultsList.appendChild(listItem);
  });
  
  // Add results to container
  searchResults.appendChild(resultsList);
  
  // Show results container
  searchResults.classList.add('active');
}

/**
 * Highlight the query within the text
 */
function highlightQuery(text, query) {
  const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

/**
 * Escape special characters for use in regex
 */
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Get a human-readable label for the content type
 */
function getTypeLabel(type) {
  const labels = {
    'h1': 'Heading 1',
    'h2': 'Heading 2',
    'h3': 'Heading 3',
    'p': 'Paragraph',
    'li': 'List Item'
  };
  
  return labels[type] || 'Content';
}

/**
 * Hide the search results container
 */
function hideSearchResults() {
  const searchResults = document.querySelector('.search-results');
  if (searchResults) {
    searchResults.classList.remove('active');
  }
}

/**
 * Add keyboard navigation for search results
 */
function addSearchKeyboardNavigation(searchInput, searchResults) {
  if (!searchInput || !searchResults) return;
  
  let selectedIndex = -1;
  
  searchInput.addEventListener('keydown', function(e) {
    const resultItems = searchResults.querySelectorAll('.search-result-item');
    
    // If no results or results not visible, return
    if (!resultItems.length || !searchResults.classList.contains('active')) {
      return;
    }
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        selectedIndex = Math.min(selectedIndex + 1, resultItems.length - 1);
        updateSelectedResult(resultItems, selectedIndex);
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        selectedIndex = Math.max(selectedIndex - 1, -1);
        updateSelectedResult(resultItems, selectedIndex);
        break;
        
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < resultItems.length) {
          // Navigate to the selected result
          window.location.href = resultItems[selectedIndex].getAttribute('href');
        }
        break;
        
      case 'Escape':
        e.preventDefault();
        hideSearchResults();
        searchInput.blur();
        break;
    }
  });
}

/**
 * Update the selected result item
 */
function updateSelectedResult(resultItems, selectedIndex) {
  // Remove selected class from all items
  resultItems.forEach(item => {
    item.classList.remove('selected');
  });
  
  // Add selected class to current item
  if (selectedIndex >= 0) {
    resultItems[selectedIndex].classList.add('selected');
    resultItems[selectedIndex].scrollIntoView({ block: 'nearest' });
  }
}

/**
 * Debounce function to limit how often a function is called
 */
function debounce(func, wait) {
  let timeout;
  
  return function(...args) {
    const context = this;
    clearTimeout(timeout);
    
    timeout = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
}