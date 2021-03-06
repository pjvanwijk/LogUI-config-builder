<template>
    <div class="container">
        <div class="row">
            <div class="col-3"><img src="../icons/logui.svg" /></div>
            <div class="col"><h4 class="text-muted">Configuration Builder</h4></div>
        </div>
        <hr>
        <div class="row">
            <form>
                <h2>Server Configuration</h2>
                <div class="form-group">
                    <label for="endpoint">Websocket endpoint:</label><br>
                    <input v-model="logUIConfig.websocket" class="form-control" required type="text" id="endpoint" name="endpoint" placeholder="Websocket endpoint"><br>
                </div>
                <div class="form-group">
                    <label for="auth-token">Authorzation Token:</label><br>
                    <input v-model="logUIConfig.authToken" class="form-control" required type="text" id="auth-token" name="auth-token"><br>
                </div>
                <div class="form-check form-switch">
                    <input v-model="logUIConfig.verboseMode" class="form-check-input" type="checkbox" id="verbosity-switch">
                    <label class="form-check-label" for="verbosity-switch">Verbose mode</label>
                </div>
                
                <hr>

                <h2>Browser-wide Events</h2>
                <div class="form-check form-switch">
                    <input v-model="logUIConfig.browserEvents.eventsWhileScrolling" class="form-check-input" type="checkbox" id="eventsWhileScrolling-switch">
                    <label class="form-check-label" for="eventsWhileScrolling-switch">Block Events while Scrolling</label>
                </div>
                <div class="form-check form-switch">
                    <input v-model="logUIConfig.browserEvents.URLChanges" class="form-check-input" type="checkbox" id="URLChanges-switch">
                    <label class="form-check-label" for="URLChanges-switch">URL Changes</label>
                </div>
                <div class="form-check form-switch">
                    <input v-model="logUIConfig.browserEvents.contextMenu" class="form-check-input" type="checkbox" id="contextMenu-switch">
                    <label class="form-check-label" for="contextMenu-switch">Context Menu</label>
                </div>
                <div class="form-check form-switch">
                    <input v-model="logUIConfig.browserEvents.pageFocus" class="form-check-input" type="checkbox" id="pageFocus-switch">
                    <label class="form-check-label" for="pageFocus-switch">Page Focus</label>
                </div>
                <div class="form-check form-switch">
                    <input v-model="logUIConfig.browserEvents.trackCursor" class="form-check-input" type="checkbox" id="trackCursor-switch">
                    <label class="form-check-label" for="trackCursor-switch">Cursor Movements</label>
                </div>
                <div class="form-check form-switch">
                    <input v-model="logUIConfig.browserEvents.pageResize" class="form-check-input" type="checkbox" id="pageResize-switch">
                    <label class="form-check-label" for="pageResize-switch">Viewport Resizing</label>
                </div>

                <hr>

                <h2>Element Tracking Configuration</h2>
                <div>
                    <button @click.prevent="activatePicker" class="btn btn-primary">Choose Element Listeners</button>
                    <a class="btn btn-primary" :href="jsonDownloadUri" role="button" download="config.json">Download JSON</a>
                </div>
                <hr>
                <h2>Trackers</h2>
                <table class="table">
                <thead>
                    <tr>
                    <th scope="col"></th>
                    <th scope="col">Name</th>
                    <th scope="col">Selector</th>
                    <th scope="col">Event</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="config in trackingConfig.trackingConfigurationValues" :key="config.name">
                    <td>
                        <button 
                            @click.prevent="() => deleteTracker(config)"
                            class="btn btn-outline-danger">
                            <img src="../icons/x.svg">
                        </button>
                    </td>
                    <td class="small">{{config.name}}</td>
                    <td class="small">{{config.selector}}</td>
                    <td class="small">{{config.eventName}}</td>
                    </tr>
                </tbody>
                </table>
                <!-- <button @click.prevent="getConfig" id="get-config-btn" class="btn btn-primary">Preview (experimental)</button> -->
            </form> 
        </div>
    </div>
</template>

<script>
import BrowserEvents from '../model/logui-configuration/browser-events.js';
import LogUIConfiguration from '../model/logui-configuration/logui-configuration.js';
import TrackingConfiguration from '../model/tracking-configuration/tracking-configuration.js';

export default {
    name: 'popupApp',
    data() {
      return {
        logUIConfig: new LogUIConfiguration(0, '', '', true, 
            new BrowserEvents(false, false, false, false, false, false)),
        trackingConfig: new TrackingConfiguration(0),
        loaded: false
      };
    },
    methods: {
        activatePicker() {
            chrome.runtime.sendMessage({
                component: 'loguipopup',
                command: 'activatePicker',
            }, (response) => {
                // I'm not sure if this is a good way to close the extension popup
                if (response === 'OK') {
                    console.log('CLOSE POPUP');
                    window.close();
                }
            });
        },
        getConfig() {
            chrome.runtime.sendMessage({
                component: 'loguipopup',
                command: 'exportLogUIConfigObject',
            });
        },
        deleteTracker(tracker) {
            this.trackingConfig.deleteTrackingConfigValue(tracker);
            chrome.runtime.sendMessage({
                component: 'loguipopup',
                command: 'deleteTrackingConfigValue',
                trackingConfigValue: tracker
            });
        }
    },
    computed: {
        jsonDownloadUri() {
            const res = {
                logUIConfiguration: this.logUIConfig.getValue,
                // applicationSpecificData: {},
                trackingConfiguration: this.trackingConfig.getValue
            }
            const data = encodeURIComponent(JSON.stringify(res));
            return `data:text/json;charset=utf-8,${data}`;
        }
    },
    watch: {
        logUIConfig: {
            handler(val) {
                // Send a config update message on every change
                if (this.loaded) {
                    chrome.runtime.sendMessage({
                        component: 'loguipopup',
                        command: 'updateLogUIConfig',
                        logUIConfig: val
                    });
                }
            },
            deep: true
        }
    },
    created() {
        chrome.runtime.sendMessage({
            component: 'loguipopup',
            message: 'LogUI popup is now live!'
        });

        // Populate model
        chrome.storage.sync.get(['logUIConfig', 'trackingConfig'], (res) => {
            if (res.logUIConfig) {
                this.logUIConfig = LogUIConfiguration.fromValue(res.logUIConfig);
                this.trackingConfig = TrackingConfiguration.fromValue(res.trackingConfig);
                console.log('Fetched model:');
                console.log(this.logUIConfig);
                console.log(this.trackingConfig);
            }
            this.loaded = true;
        });
    }
}
</script>
