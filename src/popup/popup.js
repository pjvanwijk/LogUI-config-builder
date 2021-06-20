import './popup.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Vue from 'vue';
import Popup from './popup.vue';

new Vue({
  render: h => h(Popup)
}).$mount('#popup');
