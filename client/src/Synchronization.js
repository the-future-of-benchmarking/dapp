import { DateTime } from "luxon";
export class Synchronization {
    timeOutMinutes = 10;
    data = [];

    constructor(){
        this.deserialize();
    }

    getLastActualization(item) {
        if (item.actualized) {
            let actualized = DateTime.fromISO(item.actualized)
            let current = new DateTime();
            let refresh = current.diff(actualized, "seconds")["seconds"] > this.timeOutMinutes;
            return { refresh, ...item }
        } else {
            return { refresh: true, ...item }
        }
    }

    deserialize() {
        const lData = localStorage.getItem("contracts")
        this.data = JSON.parse(lData)
    }

    getItem(address){
        let foundData = this.data.find(element => address === element.address)
        if (foundData) {
            return this.getLastActualization(foundData)
        } else {
            return null;
        }
    }

    addItem({ name, description, entries, sum, upper_bound, lower_bound, unit, address}){
        this.data.push({ name, description, entries, sum, upper_bound, lower_bound, unit, address, refresh: false, actualized: new DateTime().toISO()});
        this.serialize();
    }

    removeItem(address){
        this.data = this.data.filter(e => e.address === address);
        this.serialize();
    }

    updateItem(item){
        let index = this.data.findIndex(e => e.address === item.address)
        this.data[index] = this.getLastActualization({ actualized: new DateTime().toISO(), ...item })
        this.serialize();
    }

    serialize() {
        localStorage.setItem("contracts", JSON.stringify(this.data))
    }
}