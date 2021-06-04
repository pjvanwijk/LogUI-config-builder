import './popup.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Vue from 'vue';
import Popup from './popup.vue';

new Vue({
  render: h => h(Popup)
}).$mount('#popup');






















// OLD CODE
// // TODO: This needs to be injected somehow. Maybe repository or using localstorage. 
// //       But it must be persistent so it doesn't get lost when the popup closes.
// const loguiConfig = new LogUIConfiguration(1, '', '', false, new BrowserEvents());

// $('#activate-element-picker').click(activateElemPicker);

// $('#eventsWhileScrolling-switch').change(function () {
//     loguiConfig.browserEvents.eventsWhileScrolling = $(this).is(':checked');
//     console.log(loguiConfig.browserEvents);
// })

// $('#URLChanges-switch').change()
// $('#contextMenu-switch').change()
// $('#pageFocus-switch').change()
// $('#trackCursor-switch').change()
// $('#pageResize-switch').change()

