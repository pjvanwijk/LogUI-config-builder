<template>
    <!-- <iframe> -->
    <div class="container fixed-top bg-light" id="logui-selector-editor-ui">
            <h1>LogUI Tracking Options</h1>
            <h3>Name: <input v-model="name"/></h3>
            <h3>Selector: {{selector}}</h3>
            <!-- <h3>Specificity: {{specificity}}</h3> -->
            <vue-slider 
                v-model="selector"
                :data="selectors"
                :adsorb="true"
                :width="150"
            />
            <h3>Event: {{selectedEvent}}</h3>
            <!-- <div class="dropdown"> -->
                <!-- <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown"> -->
                    <!-- Add listener -->
                <!-- </button> -->
                <!-- <div class="dropdown-menu"> -->
                    <!-- <a v-for="event in availableEvents" :key="event" class="dropdown-item" href="#">{{event}}</a> -->
                <!-- </div> -->
            <!-- </div> -->
            <button v-for="event in availableEvents" :key="event" class="btn" @click="selectedEvent = event">{{event}}</button>

            <button class="btn btn-primary" @click="done">Add to tracking config</button>
            <button class="btn btn-danger" @click="cancel">Cancel</button>
    </div>
    <!-- </iframe> -->
</template>

<style scoped lang="css" src="bootstrap/dist/css/bootstrap.css"></style>
<style scoped>
    #logui-selector-editor-ui {
        padding: 10px;
        margin-top: 10px;
        opacity: 0.95;
    }
    #logui-selector-editor-ui > .btn {
        margin-top: 10px;
    }
</style>

<script>
// import 'bootstrap';
// import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';
import TrackingConfigurationValue from '../model/tracking-configuration/tracking-configuration-value';
import VueSlider from 'vue-slider-component';
import 'vue-slider-component/theme/antd.css';

export default {
    data() {
        return {
            selector: this.availableSelectors[this.availableSelectors.length - 1],
            selectors: this.availableSelectors,
            specificity: 0,
            name: 'tracker',
            selectedEvent: 'click',
            availableEvents: ['click', 'focus']
        };
    },
    methods: {
        done() {
            chrome.runtime.sendMessage({
                component: 'loguiselectoreditor',
                command: 'addTrackingConfigValue',
                trackingConfigValue: new TrackingConfigurationValue(this.name, this.selector, this.selectedEvent)
            });
            this.dismiss();
        },
        cancel() {
            this.dismiss();
        },
        dismiss() {
            chrome.runtime.sendMessage({
                component: 'loguiselectoreditor',
                command: 'dismissPicker',
            });
        }
    },
    watch: {
        selector: {
            handler(value) {
                this.$emit("selectorChanged", value);
            }
        }
    },
    created() {    
        chrome.runtime.sendMessage({ 
            component: 'loguiselectoreditor', 
            message: 'LogUI selector editor is now live!'
        });
    },
    
    props: {
        availableSelectors: Array
    },

    components: {
        VueSlider
    }
}
</script>
