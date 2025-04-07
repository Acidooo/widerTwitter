document.addEventListener('DOMContentLoaded', function() {
  const slider = document.getElementById('widthPercentage');
  const percentageValue = document.getElementById('percentageValue');
  
  // Load saved width percentage
  chrome.storage.sync.get('twitterWidth', function(data) {
    if (data.twitterWidth) {
      slider.value = data.twitterWidth;
      percentageValue.textContent = data.twitterWidth;
    }
  });
  
  // Update the value display and save to storage when slider changes
  slider.addEventListener('input', function() {
    const value = slider.value;
    percentageValue.textContent = value;
    
    // Save the width percentage to Chrome storage
    chrome.storage.sync.set({ 'twitterWidth': value });
    
    // Send message to content script to update the width
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (tabs[0].url && (tabs[0].url.includes('twitter.com') || tabs[0].url.includes('x.com'))) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'updateWidth',
          percentage: value
        });
      }
    });
  });
});
