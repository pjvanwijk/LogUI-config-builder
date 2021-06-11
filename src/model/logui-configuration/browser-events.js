/**
 * https://github.com/logui-framework/client/wiki/Browser-Events#available-browser-events 
 * Every browser event is assumed to be enabled when not specified
 * Construction could probably be neater using a builder pattern.
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

    // Static factory method
    static fromValue(value) {
        return new BrowserEvents(
            value.eventsWhileScrolling,
            value.URLChanges,
            value.contextMenu,
            value.pageFocus,
            value.trackCursor,
            value.pageResize
        )
    }

}
