/**
 * https://github.com/logui-framework/client/wiki/Browser-Events#available-browser-events 
 */ 
export default class BrowserEvents {
    constructor() {
        this.eventsWhileScrolling = true;
        this.URLChanges = true;
        this.contextMenu = true;
        this.pageFocus = true;
        this.trackCursor = true;
        this.pageResize = true;
    }
}