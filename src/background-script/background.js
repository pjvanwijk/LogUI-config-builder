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
      "id": "elementpicker",
      "title": "Element picker"
    });
});

// Add listeners to contextmenus
chrome.contextMenus.onClicked.addListener(function(info, tab) {
    console.log(info.menuItemId + ' clicked!');
    chrome.tabs.sendMessage(tab.id, {
      command: 'activatePicker'
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

// Handles messages from the popup
const popupMessageHandler = (message, sender, sendResponse) => {
  if (message.command && message.command === 'activatePicker') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
          command: 'activatePicker',
          trackingConfig
      });
    });
  }
  else defaultMessageHandler(message, sender, sendResponse);
}

// Handles messages from the selector editor
const selectorEditorMessageHandler = (message, sender, sendResponse) => {
  if (message.command && message.command === 'addSelector') {
    console.log('Will add selector to my collection!');
  }
  else defaultMessageHandler(message, sender, sendResponse);
}

// Prints out the message
const defaultMessageHandler = (message, sender, sendResponse) => {
  console.log(`Received message: ${message}`);
}

// Listen for connections
chrome.runtime.onConnect.addListener(function(port) {
  if (port.name == 'loguipopup') {
    console.log('New connection from logui popup');
    port.onMessage.addListener(popupMessageHandler);
    port.onDisconnect.addListener(saveModel);
  }
  if (port.name == 'loguiselectoreditor') {
    console.log('New connection from logui selector editor');
    port.onMessage.addListener(selectorEditorMessageHandler);
    port.onDisconnect.addListener(saveModel);
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