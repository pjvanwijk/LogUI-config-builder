import LogUIConfiguration from '../model/logui-configuration/logui-configuration';
import TrackingConfiguration from '../model/tracking-configuration/tracking-configuration';
import TrackingConfigurationValue from '../model/tracking-configuration/tracking-configuration-value';

// Background script listening to browser events
console.log("Running on " + navigator.userAgent);

// Initialize default domain objects
let logUIConfig = LogUIConfiguration.fromValue({
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

let trackingConfig = new TrackingConfiguration(0);

// Initialization after installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('Thanks for installing the experimental LogUI configuration builder!');
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

// Load objects from storage when started
function init() {
  chrome.storage.sync.get(['logUIConfig', 'trackingConfig'], (res) => {
    if (res.logUIConfig) {
      console.log('Previous configuration found. Using that one');
      logUIConfig = buildLogUIConfig(res.logUIConfig);
      trackingConfig = buildTrackingConfig(res.trackingConfig);
    }
    else chrome.storage.sync.set({ logUIConfig, trackingConfig }, () => {
      console.log('No previous config found. Using default.');
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

// Reconstitute tracking config model from data
const buildTrackingConfig = (data) => {
  const res = new TrackingConfiguration(data.id);

  res.trackingConfigurationValues = data.trackingConfigurationValues
  .map((value) => new TrackingConfigurationValue(value.name, value.selector, value.eventName));
 
  return res;
}

// Reconstitute logui config model from data
const buildLogUIConfig = (data) => {
  return LogUIConfiguration.fromValue(data);
}

// Reconstitute a trackingconfigvalue model from data
const buildTrackingConfigValue = (data) => {
  return new TrackingConfigurationValue(data.name, data.selector, data.eventName);
}

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
      // console.log('Updating logui config');
      // console.log(message.logUIConfig);
      logUIConfig = buildLogUIConfig(message.logUIConfig);
    }
    if (message.command === 'getLogUIConfig') {
      console.log('Request message for logui config received');
      port.postMessage({ logUIConfig });
    }
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
  else defaultMessageHandler(message, port);
}

// Handles messages from the selector editor
const selectorEditorMessageHandler = (message, port) => {
  if (message.command && message.command === 'addTrackingConfigValue') {
    console.log('Adding new tracking configuration value to collection');
    trackingConfig.addTrackingConfigValue(
      buildTrackingConfigValue(message.trackingConfigValue));
    console.log(trackingConfig);
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
  console.log('Saving state to Chrome storage');
  chrome.storage.sync.set({
    logUIConfig,
    trackingConfig
  }, () => {});
}