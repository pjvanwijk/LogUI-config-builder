import Picker from "./picker";
import Vue from 'vue';
import SelectorEditor from './selector-editor.vue';
import { compare } from 'specificity';
// This makes it possible to dynamically create selector editor components
const SelectorEditorVueComponent = Vue.extend(SelectorEditor);

/**
 * This is a content script (https://developer.chrome.com/docs/extensions/mv3/content_scripts/) 
 * that runs on the current page as soon as the user interacts with the element picker. 
 * It can access the loaded DOM by `document` just like a regular javascript on a webpage. 
 * A Content script can listen for incoming messages from the popup.
 */

console.log('LogUI extension content script loaded!');

let trackingConfig = null;
let selectorEditorVue = null;
let picker = null;
let inEditMode = false;

// Mountpoint for the selector editor UI
const selectorEditMountId = 'logui-selector-edit-wrapper';

// Element picker callback to get into selector edit mode when an element gets selected
const onPickListener = (element) => {
  // Pause the picker because we are going into selector edit mode
  picker.pause();
  editSelector(element);
};

// Listen for the message to activate element picker
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.command && message.command === 'activatePicker') {
    console.log(`Received ${message.command} command`);
    trackingConfig = message.trackingConfig;
    console.log(trackingConfig);
    activatePicker(trackingConfig);
  }

  if (message.command && message.command === 'showLogUIConfigurationObject') {
    document.querySelector('body').innerText = JSON.stringify(message.configObject, null, '\t');
  }

  if (message.command && message.command === 'dismissPicker') {
    dismissPicker();
  }
});

// Go into selector edit mode
function editSelector(selectedElement) {
  console.log(`mounting vue component on ${selectorEditMountId}`);
  const availableSelectors = getAvailableSelectors(selectedElement);
  // Initialize the selector editor
  selectorEditorVue = new SelectorEditorVueComponent({
    propsData: {
      // All the selectors that a user can choose from
      availableSelectors: availableSelectors
    }
  });

  // FIXME: Couldn't figure out how to emit the selectorChanged event from the vue instance when it's mounted
  picker.highlightBySelector(availableSelectors[availableSelectors.length - 1]);
  
  // Highlight selected elements when interacting with the specificity slider
  selectorEditorVue.$on('selectorChanged', (selector) => {
    picker.highlightBySelector(selector);
  });

  selectorEditorVue.$on('dismiss', dismissPicker);
  selectorEditorVue.$mount(`#${selectorEditMountId}`);

  // console.log(`Edit mode for ${getSelector(selectedElement)}`);
}

function activatePicker() {
  if (!inEditMode) {
    // Add event listener to the whole DOM 
    picker = new Picker();
    picker.onPickListener = onPickListener;

    // Add the selector editor UI placeholder
    const selectorEditMount = document.createElement('div');
    selectorEditMount.id = selectorEditMountId;
    document.body.appendChild(selectorEditMount);

    picker.start();
    inEditMode = true;
  } else {
    alert('Already in editing mode');
  }
}

// Reset the page's content
function dismissPicker() {
  picker.stop();
  document.getElementById('logui-selector-editor-ui').remove();
  inEditMode = false;
}


function getAvailableSelectors(context) {
  let selectors = [];

  if (context == "null") throw "not an DOM reference";

  // Highest specificity (id)
  if (context.id) 
    selectors.push(getElementId(context));
  else {
    // High specificity (element path selector)
    selectors.push(getElementPathSelector(context));
  }

  // Medium specificity (class selector)
  if (context.className) 
    selectors.push(getElementClassSelector(context));

  // Low specificity (sibling elements)
  selectors.push(getElementSiblingSelector(context));

  // Very low specificity (name of the html element)
  selectors.push(context.localName);

  // Lowest specificity: universal selector, matches all elements
  selectors.push('*');

  // Sort the selectors by specificity
  return selectors.sort((selectorA, selectorB) => compare(selectorA, selectorB));
}

// Get the id of an element
function getElementId(context) {
  return `#${context.id}`;
}

// Element DOM tree location selector, a specific path of elements
function getElementPathSelector(context) {
  let pathSelector;
  let ctx = context;
  while (ctx.tagName) {
    let index = getIndex(ctx);
    if (ctx.id) {
      // If we reached a parent element with an id, the specificity is high enough
      pathSelector = `${ctx.localName}#${ctx.id}${(pathSelector ? ' > ' + pathSelector : '')}`;
      break;
    }
    else if (ctx.className)
      pathSelector = `${ctx.localName}${getElementClassSelector(ctx)}:nth-of-type(${index})${(pathSelector ? ' > ' + pathSelector : '')}`;
    else
      pathSelector = `${ctx.localName}:nth-of-type(${index})${(pathSelector ? ' > ' + pathSelector : '')}`;
    ctx = ctx.parentNode;
  }
  return `${pathSelector}`;
}

// Classname selector
function getElementClassSelector(context) {
  return context.className.split(' ')
    .reduce((total, currentValue) => total.concat('.', currentValue), '');
}

// Sibling elements selector
function getElementSiblingSelector(context) {
  let pathSelector;
  let ctx = context;
  let index = getIndex(context);
  while (ctx.tagName) {
    pathSelector = ctx.localName + (pathSelector ? " > " + pathSelector : "");
    ctx = ctx.parentNode;
  }
  return pathSelector + `:nth-of-type(${index})`;
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
