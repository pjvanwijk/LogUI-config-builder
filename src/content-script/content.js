import TrackingConfiguration from "../model/tracking-configuration/tracking-configuration";
import Picker from "./picker";

/**
 * This is a content script (https://developer.chrome.com/docs/extensions/mv3/content_scripts/) 
 * that runs on the current page as soon as the user interacts with the element picker. 
 * It can access the loaded DOM by `document` just like a regular javascript on a webpage. 
 * A Content script can listen for incoming messages from the popup.
 */

console.log('Content script loaded!');

new Picker();

let trackingConfig = new TrackingConfiguration();

// Activate element picker
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.command && message.command === 'activatePicker') {
    console.log(`Received command ${message.command}`);
    trackingConfig = message.trackingConfig;
    console.log(trackingConfig);
    decorateBody();
  }
});

// GUI generation: add event listener to the whole DOM
function decorateBody() {
  document.body.addEventListener('click', (event) => {
      const output = getSelector(event.target);
      event.preventDefault();
      alert(output);
      trackingConfig.trackingConfigurationValues.push(output);
      console.log(trackingConfig);
  });
}

function getSelector(context) {
  console.log(context);

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