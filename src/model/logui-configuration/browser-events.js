/**
 * https://github.com/logui-framework/client/wiki/Browser-Events#available-browser-events 
 */ 
export default class BrowserEvents {
    constructor(eventsWhileScrolling,
                URLChanges,
                contextMenu,
                pageFocus,
                trackCursor,
                pageResize) {
        this.eventsWhileScrolling = eventsWhileScrolling;
        this.URLChanges = URLChanges;
        this.contextMenu = contextMenu;
        this.pageFocus = pageFocus;
        this.trackCursor = trackCursor;
        this.pageResize = pageResize;
    }
    get getValue() {
        return {
            eventsWhileScrolling: this.eventsWhileScrolling,
            URLChanges: this.URLChanges,
            contextMenu: this.contextMenu,
            pageFocus: this.pageFocus,
            trackCursor: this.trackCursor,
            pageResize: this.pageResize
        };
    }
}