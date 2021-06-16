export default class TrackingConfigurationValue {
    constructor(name, selector, eventName) {
        if (!name || !selector || !eventName) {
            throw new Error('Invalid tracking configuration value. Make sure to enter all values');
        }
        this.name = name;
        this.selector = selector;
        this.eventName = eventName;
    }
    get getValue() {
        return {
            selector: this.selector,
            event: this.eventName,
            name: this.name
        }
    }
    // Static factory method
    static fromValue(value) {
        return new TrackingConfigurationValue(value.name, value.selector, value.eventName);
    }
}
