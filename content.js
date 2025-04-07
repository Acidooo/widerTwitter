// Default width percentage and base width in pixels
let widthPercentage = 100;
const baseWidth = 600; // Base width at 100%

// Load saved width percentage
chrome.storage.sync.get('twitterWidth', function(data) {
  if (data.twitterWidth) {
    widthPercentage = data.twitterWidth;
    updateTwitterWidth(widthPercentage);
  }
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === 'updateWidth') {
    widthPercentage = message.percentage;
    updateTwitterWidth(widthPercentage);
    // Send a response to complete the message transaction
    sendResponse({success: true});
  }
  // Don't return true here - we've already responded synchronously
});

// Function to update Twitter width
function updateTwitterWidth(percentage) {
  // Calculate actual width in pixels based on percentage of base width
  const actualWidth = Math.round((baseWidth * percentage) / 100);
  
  // Apply CSS changes to the Twitter default class
  const cssCode = `
    /* Modify Twitter's default width class */
    .r-1ye8kvj {
      max-width: ${actualWidth}px !important;
    }
  `;
  
  // Remove existing style if any
  const existingStyle = document.getElementById('wider-twitter-style');
  if (existingStyle) {
    existingStyle.remove();
  }
  
  // Add new style
  const styleElement = document.createElement('style');
  styleElement.id = 'wider-twitter-style';
  styleElement.textContent = cssCode;
  document.head.appendChild(styleElement);
  
  console.log(`Twitter width updated to ${actualWidth}px (${percentage}%)`);
}

// Function to apply styles
function applyStyles() {
  updateTwitterWidth(widthPercentage);
}

// Apply styles when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', applyStyles);
} else {
  applyStyles();
}

// Set up an observer for Twitter's SPA behavior
const observer = new MutationObserver(() => {
  updateTwitterWidth(widthPercentage);
});

// Start observing
setTimeout(() => {
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: false,
    characterData: false
  });
}, 1000);
