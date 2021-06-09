<template>
    <div class="container fixed-top bg-light" id="logui-selector-editor-ui">
            <h1>LogUI Tracking Options</h1>
            <h3>Selector: {{selector}}</h3>
            <h3>Specificity: {{specificity}}</h3>
            <h2>Events</h2>
            <div class="dropdown">
                <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown">
                    Add listener
                </button>
                <div class="dropdown-menu">
                    <a v-for="event in events" :key="event" class="dropdown-item" href="#">{{event}}</a>
                </div>
            </div>
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

export default {
    data() {
        return {
            selector: 'none',
            specificity: 42,
            port: null,
            events: ['click', 'mouseover', 'mouseexit']
        };
    },
    methods: {
        done() {
            this.port.postMessage({
                command: 'activatePicker'
            });
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
    
    mounted() {
        // trackingConfig.trackingConfigurationValues.push(output);
        // console.log(trackingConfig); 
        console.log('Mounted!');
    }
}
</script>
