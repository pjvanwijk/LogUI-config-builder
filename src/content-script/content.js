import TrackingConfiguration from "../model/tracking-configuration/tracking-configuration";
import Picker from "./picker";
import Vue from 'vue';
import SelectorEditor from './selector-editor.vue';

/**
 * This is a content script (https://developer.chrome.com/docs/extensions/mv3/content_scripts/) 
 * that runs on the current page as soon as the user interacts with the element picker. 
 * It can access the loaded DOM by `document` just like a regular javascript on a webpage. 
 * A Content script can listen for incoming messages from the popup.
 */

console.log('LogUI extension content script loaded!');

let trackingConfig = new TrackingConfiguration();
let selectorEditorVue = null;
let picker = null;

// Mountpoint for the selector editor UI
const selectorEditMountId = 'logui-selector-edit-wrapper'

// Element picker callback to get into selector edit mode when an element gets selected
const onPickListener = (element) => {
  // Pause the picker because we are going into selector edit mode
  picker.stop();
  editSelector(element);
};

// Listen for the message to activate element picker
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.command && message.command === 'activatePicker') {
    console.log(`Received ${message.command} command`);
    trackingConfig = message.trackingConfig;
    console.log(trackingConfig);

    // Add event listener to the whole DOM 
    picker = new Picker();
    picker.onPickListener = onPickListener;

    // Initialize the selector editor
    selectorEditorVue = new Vue({ render: h => h(SelectorEditor) });
    // Add the selector editor UI placeholder
    const selectorEditMount = document.createElement('div');
    selectorEditMount.id = selectorEditMountId;
    document.body.appendChild(selectorEditMount);

    picker.start();
  }
});

// Go into selector edit mode
function editSelector(selectedElement) {
  console.log(`mounting vue component on ${selectorEditMountId}`);
  selectorEditorVue.$mount(`#${selectorEditMountId}`);
  console.log(`Edit mode for ${getSelector(selectedElement)}`);
  // trackingConfig.trackingConfigurationValues.push(output);
  // console.log(trackingConfig);
}

function getSelector(context) {
  let index, pathSelector, localName;
  
  if (context == "null") throw "not an DOM reference";
  index = getIndex(context);
  
  // High specificity
  if (context.id) 
    return `#${context.id}`;
  
  // Medium specificity
  if (context.className)
    return `.${context.className}`;
  
  // Low specificity 
  while (context.tagName) {
    pathSelector = context.localName + (pathSelector ? " > " + pathSelector : "");
    context = context.parentNode;
  }
  pathSelector = pathSelector + `:nth-of-type(${index})`;
  return pathSelector;
}
  
// get index for nth of type element
function getIndex(node) {
  let i = 1;
  let tagName = node.tagName;

  while (node.previousSibling) {
    node = node.previousSibling;
    if (
      node.nodeType === 1 &&
      tagName.toLowerCase() == node.tagName.toLowerCase()
    ) {
      i++;
    }
  }
  return i;
}