<template>
    <div class="container fixed-top bg-light" id="logui-selector-editor-ui">
            <h1>LogUI Element Tracking Options</h1>
            <hr>
            <h4>Name: <input v-model="name"/></h4>
            <h4>Selector:</h4><textarea id="logui-selector-editor-textarea" v-model="selector"/>
            <h4>Specificity:</h4>
            <vue-slider 
                v-model="selector"
                :tooltip="'none'"
                :data="selectors"
                :adsorb="true"
                :height="20"
            />
            <h4>Event:</h4>
            <button 
                v-for="event in availableEvents" 
                :key="event" 
                :class="selectedEvent === event ? 'btn btn-success' : 'btn btn-light' "
                @click="selectedEvent = event">
                    {{event}}
            </button>
            
            <hr>

            <button class="btn btn-primary" @click="done">Add to tracking config</button>
            <button class="btn btn-danger" @click="cancel">Cancel</button>
        </div>
</template>

<style scoped>
    #logui-selector-editor-ui {
        padding: 10px;
        margin-top: 10px;
        opacity: 0.95;
    }

    #logui-selector-editor-ui * {
        font-family: Arial, Helvetica, sans-serif;
    }

    #logui-selector-editor-textarea {
        min-width: 100%;
        height: 100px;
        resize: vertical;
    }

    #logui-selector-editor-ui > .btn {
        margin-top: 10px;
        margin-right: 10px;
    }
</style>

<style scoped lang="css" src="bootstrap/dist/css/bootstrap.css"></style>

<script>
// import 'bootstrap';
// import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';
import TrackingConfigurationValue from '../model/tracking-configuration/tracking-configuration-value';
import VueSlider from 'vue-slider-component';
import 'vue-slider-component/theme/antd.css';
import { calculate } from 'specificity';

export default {
    data() {
        return {
            selector: this.availableSelectors[this.availableSelectors.length - 1],
            selectors: this.availableSelectors,
            name: 'tracker',
            selectedEvent: 'click',
            availableEvents: ['click', 'focus']
        };
    },
    computed: {
        specificity() {
            return calculate(this.selector);
        }
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
            this.$emit('dismiss', true);
        }
    },
    watch: {
        selector: {
            handler(value) {
                this.$emit('selectorChanged', value);
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
