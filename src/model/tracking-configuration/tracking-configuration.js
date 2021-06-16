import TrackingConfigurationValue from "./tracking-configuration-value";

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

    // Static factory method
    static fromValue(value) {
        const res = new TrackingConfiguration(value.id);
        res.trackingConfigurationValues = value.trackingConfigurationValues
            .map((tvalue) => TrackingConfigurationValue.fromValue(tvalue));
        return res;
    }
}
