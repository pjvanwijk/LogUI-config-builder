import BrowserEvents from '../model/logui-configuration/browser-events';
import LogUIConfiguration from '../model/logui-configuration/logui-configuration';
import TrackingConfiguration from '../model/tracking-configuration/tracking-configuration';

// Background script listening to browser events
console.log("Running on " + navigator.userAgent);

// Initialization after installation
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({
    logUIConfig: new LogUIConfiguration(0, '', '', true, new BrowserEvents()),
    trackingConfig: new TrackingConfiguration(0)
  }, () => {});

  // Add rightclick context menu
  chrome.contextMenus.create({
    "id": "elementpicker",
    "title": "Element picker"
  });
});

// Add listeners to contextmenus
chrome.contextMenus.onClicked.addListener((info, tab) => {
    console.log(info.menuItemId + ' clicked!');
    chrome.tabs.sendMessage(tab.id, {
      command: 'activatePicker'
    });
});

// Initialize objects
let logUIConfig = new LogUIConfiguration(0, '', '', true, new BrowserEvents());
let trackingConfig = new TrackingConfiguration(0);

// Load objects from storage
chrome.storage.sync.get(['logUIConfig', 'trackingConfig'], (res) => {
  logUIConfig = res.logUIConfig;
  trackingConfig = res.trackingConfig;
});

// Handles messages from the popup
const popupMessageHandler = (message, port) => {
  if (message.command) {
    if (message.command === 'activatePicker') {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {
            command: 'activatePicker',
            trackingConfig
        });
      });
    }
    if (message.command === 'updateLogUIConfig' && message.logUIConfig) {
      console.log('Updating logui config');
      console.log(message.logUIConfig);
      logUIConfig = message.logUIConfig;
    }
    if (message.command === 'getLogUIConfig') {
      console.log('Request message for logui config received');
      port.postMessage({ logUIConfig });
    }
  }
  else defaultMessageHandler(message, port);
}

// Handles messages from the selector editor
const selectorEditorMessageHandler = (message, port) => {
  if (message.command && message.command === 'addSelector') {
    console.log('Will add selector to my collection!');
  }
  if (message.command && message.command === 'dismissPicker') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { command: 'dismissPicker' });
    });
  }
  else defaultMessageHandler(message, port);
}

// Prints out the message
const defaultMessageHandler = (message, port) => {
  console.log(`Received message: ${message} from ${port.name}`);
}

// Listen for connections
chrome.runtime.onConnect.addListener((port) => {
  if (port.name == 'loguipopup') {
    console.log('New connection from logui popup');
    port.onMessage.addListener((message) => popupMessageHandler(message, port));
    port.onDisconnect.addListener(saveModel);
  }
  if (port.name == 'loguiselectoreditor') {
    console.log('New connection from logui selector editor');
    port.onMessage.addListener((message) => selectorEditorMessageHandler(message, port));
    port.onDisconnect.addListener(saveModel);
  }
});

// Save the models
function saveModel() {
  console.log('Saving state to Chrome storage');
  chrome.storage.sync.set({
    logUIConfig,
    trackingConfig
  }, () => {});
}