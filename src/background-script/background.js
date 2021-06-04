import BrowserEvents from '../model/logui-configuration/browser-events';
import LogUIConfiguration from '../model/logui-configuration/logui-configuration';
import TrackingConfiguration from '../model/tracking-configuration/tracking-configuration';

// Background script listening to browser events
console.log("Running on " + navigator.userAgent);

// Initialization after installation
chrome.runtime.onInstalled.addListener(function() {
    
    chrome.storage.sync.set({
      logUIConfig: new LogUIConfiguration(0, '', '', new BrowserEvents()),
      trackingConfig: new TrackingConfiguration(0)
    }, () => {});

  // Add rightclick context menu
    chrome.contextMenus.create({
      "id": "registerLogui",
      "title": "Add LogUI event listener"
    });
});

// Add listeners to contextmenus
chrome.contextMenus.onClicked.addListener(function(info, tab) {
    console.log(info.menuItemId + ' clicked!');
    chrome.tabs.sendMessage(tab.id, {
      command: 'activate-element-picker'
  });
});

// Initialize objects
let logUIConfig = new LogUIConfiguration(0, '', true, new BrowserEvents());
let trackingConfig = new TrackingConfiguration(0);

// Load objects from storage
chrome.storage.sync.get(['logUIConfig', 'trackingConfig'], (res) => {
  logUIConfig = res.logUIConfig;
  trackingConfig = res.trackingConfig;
});

// Listen for connections
chrome.runtime.onConnect.addListener(function(port) {
  if (port.name == "loguipopup") {
    port.onMessage.addListener(function(message) {
      if (message.command && message.command === 'activatePicker') {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          chrome.tabs.sendMessage(tabs[0].id, {
              command: 'activatePicker',
              trackingConfig
          });
        });
      }
      else console.log(`Received message: ${message}`);
    });
    port.onDisconnect.addListener(function() {
      console.log('Disconnected, saving model');
      saveModel();
    });
  }
});

function saveModel() {
  console.log('Unmounting... Saving state to Chrome storage');
  // this.logUIConfig.browserEvents = this.browserEvents;
  // chrome.storage.sync.set({
  //   logUIConfig: this.logUIConfig,
  //   trackingConfig: this.trackingConfig
  // }, () => {});
}