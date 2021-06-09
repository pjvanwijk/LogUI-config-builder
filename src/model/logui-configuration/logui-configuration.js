export default class LogUIConfiguration {
    constructor(id, websocket, authToken, verboseMode, browserEvents) {
        this.id = id;
        this.websocket = websocket;
        this.authToken = authToken;
        this.verboseMode = verboseMode;
        this.browserEvents = browserEvents;
    }
    get getValue() {
        return {
            endpoint: this.websocket,
            authorisationToken: this.authToken,
            verbose: this.verboseMode,
            browserEvents: this.browserEvents.getValue
        };
    }
}