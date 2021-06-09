<template>
    <div class="container fixed-top bg-light" id="logui-selector-editor-ui">
            <h1>LogUI Tracking Options</h1>
            <h3>Name: <textarea v-model="name"></textarea></h3>
            <h3>Selector: {{selector}}</h3>
            <h3>Specificity: {{specificity}}</h3>
            <h3>Event: {{selectedEvent}}</h3>
            <!-- <div class="dropdown"> -->
                <!-- <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown"> -->
                    <!-- Add listener -->
                <!-- </button> -->
                <!-- <div class="dropdown-menu"> -->
                    <!-- <a v-for="event in events" :key="event" class="dropdown-item" href="#">{{event}}</a> -->
                <!-- </div> -->
            <!-- </div> -->
            <button v-for="event in availableEvents" :key="event" class="btn" @click="selectedEvent = event">{{event}}</button>

            <button class="btn btn-primary" @click="done">Add to tracking config</button>
            <button class="btn btn-danger" @click="cancel">Cancel</button>
    </div>
</template>

<style scoped lang="css" src="bootstrap/dist/css/bootstrap.css"></style>
<style scoped>
    #logui-selector-editor-ui {
        padding: 10px;
        margin-top: 10px;
        opacity: 0.95;
    }
    .btn {
        margin-top: 10px;
    }
</style>

<script>
// import 'bootstrap';
// import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';
import TrackingConfigurationValue from '../model/tracking-configuration/tracking-configuration-value';

export default {
    data() {
        return {
            selector: 'none',
            specificity: 0,
            port: null,
            name: 'tracker',
            selectedEvent: 'click',
            availableEvents: ['click', 'focus']
        };
    },
    methods: {
        done() {
            this.port.postMessage({
                command: 'addTrackingConfigValue',
                trackingConfigValue: new TrackingConfigurationValue(this.name, this.selector, this.selectedEvent)
            });
            this.port.postMessage({ command: 'dismissPicker' });
        },
        cancel() {
            this.port.postMessage({
                command: 'dismissPicker'
            });
        }
    },
    created() {
        this.port = chrome.runtime.connect({
            name: 'loguiselectoreditor'
        });

        this.port.postMessage('LogUI selector editor is now live!');
    },
}
</script>
