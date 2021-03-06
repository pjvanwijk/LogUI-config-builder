import LogUIConfiguration from '../model/logui-configuration/logui-configuration';
import TrackingConfiguration from '../model/tracking-configuration/tracking-configuration';
import TrackingConfigurationValue from '../model/tracking-configuration/tracking-configuration-value';

// Background script listening to browser events
console.log("Running on " + navigator.userAgent);

// Initialize default domain objects
let logUIConfig;
let trackingConfig;
init();

// Initialization after installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('%cThanks for installing the experimental LogUI configuration builder!', 'color: purple;font-weight:bold;');
  init();
  // Add rightclick context menu
  chrome.contextMenus.create({
    "id": "elementpicker",
    "title": "Element picker"
  });
});

// Browser startup hook
chrome.runtime.onStartup.addListener(() => {
  init();
});

// Listen for messages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.component == 'loguiselectoreditor') {
    handleSelectorEditorMessage(message, sender, sendResponse);
  }
  if (message.component == 'loguipopup') {
    handleLogUIPopupMessage(message, sender, sendResponse);
  }
});

// Load objects from storage when started
function init() {
  chrome.storage.sync.get(['logUIConfig', 'trackingConfig'], (res) => {
    if (res.logUIConfig) {
      console.log('Previous configuration found. Using that one');
      logUIConfig = LogUIConfiguration.fromValue(res.logUIConfig);
      trackingConfig = TrackingConfiguration.fromValue(res.trackingConfig);
      console.log(logUIConfig);
      console.log(trackingConfig);
    }
    else chrome.storage.sync.set({ logUIConfig, trackingConfig }, () => {
      console.log('No previous config found. Using default.');
      logUIConfig = LogUIConfiguration.fromValue({
        id: 0, 
        websocket: '', 
        authToken: '', 
        verboseMode: true,
        browserEvents: {
          eventsWhileScrolling: true,
          URLChanges: true,
          contextMenu: true,
          pageFocus: true,
          trackCursor: true,
          pageResize: true
        }
      });
      trackingConfig = new TrackingConfiguration(0);
    });
  });
}

// Add listeners to contextmenus
chrome.contextMenus.onClicked.addListener((info, tab) => {
    console.log(info.menuItemId + ' clicked!');
    chrome.tabs.sendMessage(tab.id, {
      command: 'activatePicker'
    });
});

// Handles messages from the popup
const handleLogUIPopupMessage = (message, sender, sendResponse) => {
  console.log(`Received message:`);
  console.log(message);
  if (message.command) {
    if (message.command === 'activatePicker') {
      sendResponse('OK');
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {
            command: 'activatePicker',
            trackingConfig
        });
      });
    }
    if (message.command === 'updateLogUIConfig' && message.logUIConfig) {
      // console.log('Updating logui config');
      // console.log(message.logUIConfig);
      logUIConfig = LogUIConfiguration.fromValue(message.logUIConfig);
      saveModel();
      sendResponse('OK');
    }
    if (message.command === 'deleteTrackingConfigValue' && message.trackingConfigValue) {
      trackingConfig.deleteTrackingConfigValue(message.trackingConfigValue);
      saveModel();
    }
    /* No longer needed because popup can get this directly from storage API*/
    // if (message.command === 'getLogUIConfig') {
    //   console.log('Request message for logui config received');
    //   sendResponse({ logUIConfig });
    // }
    if (message.command === 'exportLogUIConfigObject') {
      console.log('Request to export config object');
      const configObject = getLogUIConfigObject();
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {
            command: 'showLogUIConfigurationObject',
            configObject
        });
      });
      
      //  TODO: Show final config object in a new tab or window, or download
      // chrome.tabs.create({ active: true }, tab => {
      //   chrome.tabs.sendMessage(tab.id, {
      //     command: 'showLogUIConfigurationObject',
      //     configObject
      //   });
      // });

    }
  }
  else handleDefaultMessage(message, sender);
}

// Handles messages from the selector editor
const handleSelectorEditorMessage = (message, sender, _sendResponse) => {
  console.log(`Received message:`);
  console.log(message);
  if (message.command && message.command === 'addTrackingConfigValue') {
    console.log('Adding new tracking configuration value to collection');
    trackingConfig.addTrackingConfigValue(TrackingConfigurationValue.fromValue(message.trackingConfigValue));
    console.log(trackingConfig);
    saveModel();
  }
  if (message.command && message.command === 'dismissPicker') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { command: 'dismissPicker' });
    });
  }
  else handleDefaultMessage(message, sender);
}

// Prints out the message
const handleDefaultMessage = (message, sender) => {
  console.log('Received message:');
  console.log(message);
}

// Get the configuration object as required by LogUI
function getLogUIConfigObject() {
  const res = {
    logUIConfiguration: logUIConfig.getValue,
    // applicationSpecificData: {},
    trackingConfiguration: trackingConfig.getValue
  }
  console.log(res);
  return res;
}

// Save the models
function saveModel() {
  console.log('%cSaving state to Chrome storage', 'color: green;font-weight:bold;');
  chrome.storage.sync.set({
    logUIConfig,
    trackingConfig
  }, () => {
    console.log('%cModel saved!', 'color: green;font-weight:bold;');
  });
}
