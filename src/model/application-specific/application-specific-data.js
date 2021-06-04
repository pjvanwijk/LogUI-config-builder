export default class ApplicationSpecificData {
    constructor(data) {
        this.data = data ? data : {};
    }
    get data() {
        return this.data;
    }
}