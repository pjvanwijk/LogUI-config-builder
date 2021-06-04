import BrowserEvents from './browser-events.js';

export default class LogUIConfiguration {
    constructor(id, websocket, authToken, verboseMode, browserEvents) {
        this.id = id;
        this.websocket = websocket;
        this.authToken = authToken;
        this.verboseMode = verboseMode;
        this.browserEvents = browserEvents ? browserEvents : new BrowserEvents();
    }
}