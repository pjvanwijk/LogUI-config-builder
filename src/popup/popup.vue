<template>
    <div class="container">
        <div class="row">
            <div class="col-3"><img src="../icons/logui.svg" /></div>
            <div class="col"><h4 class="text-muted">Configuration Builder</h4></div>
        </div>
        <hr>
        <div class="row">
            <form>
                <h2>LogUI Configuration</h2>
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
                    <button @click="activatePicker" class="btn btn-primary">Choose Element Listeners</button>                        
                </div>

                <hr>

                <button id="get-config-btn" class="btn btn-primary">Get Config</button>
            </form> 
        </div>
    </div>
</template>

<script>
import LogUIConfiguration from '../model/logui-configuration/logui-configuration.js';
import TrackingConfiguration from '../model/tracking-configuration/tracking-configuration.js';

export default {
    name: 'popupApp',
    data() {
      return {
        logUIConfig: new LogUIConfiguration(),
        trackingConfig: new TrackingConfiguration(),
        port: null
      };
    },
    methods: {
        activatePicker(event) {
            this.port.postMessage({
                command: 'activatePicker'
            });
        }
    },
    watch: {
        logUIConfig: {
            handler(val) {
                // Send a config update message on every change
                this.port.postMessage({
                    command: 'updateLogUIConfig',
                    logUIConfig: val
                });
            },
            deep: true
        }
    },
    created() {
        // Initiate connection with background script
        this.port = chrome.runtime.connect({ name: 'loguipopup' });

        this.port.postMessage('LogUI popup is now live!');
        this.port.postMessage({ command: 'getLogUIConfig' });
        this.port.onMessage.addListener((message) => {
            if (message.logUIConfig) {
                this.logUIConfig = message.logUIConfig;
            }
        });
    }
}
</script>

