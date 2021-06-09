export default class TrackingConfiguration {
    constructor(id) {
        this.id = id;
        this.trackingConfigurationValues = [];
    }
    get getValue() {
        const res = {};
        this.trackingConfigurationValues.forEach((tc) => {
            res[tc.name] = {
                selector: tc.selector,
                event: tc.event,
                name: tc.name
            };
        });
        return res;
    }
}
