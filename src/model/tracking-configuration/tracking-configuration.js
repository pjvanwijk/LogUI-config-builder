export default class TrackingConfiguration {
    constructor(id) {
        this.id = id;
        this.trackingConfigurationValues = [];
    }
    
    get getValue() {
        const res = {};
        this.trackingConfigurationValues.forEach((tc) => {
            res[tc.name] = tc.getValue;
        });
        return res;
    }

    addTrackingConfigValue(trackingConfigValue) {
        this.trackingConfigurationValues.push(trackingConfigValue);
    }
}
