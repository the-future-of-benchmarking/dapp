import { DateTime } from "luxon";
export class Synchronization {
    timeOutMinutes = 10;
    data = [];

    constructor(){
        this.deserialize();
    }

    getLastActualization(item) {
        this.deserialize();
        if (item.actualized) {
            let actualized = DateTime.fromISO(item.actualized)
            let current = DateTime.now();
            let refresh = current.diff(actualized, "minutes")["minutes"] > this.timeOutMinutes;
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
        this.deserialize();
        let foundData = this.data.find(element => address === element.address)
        if (foundData) {
            return this.getLastActualization(foundData)
        } else {
            return null;
        }
    }

    addItem({ name, description, entries, sum, upper_bound, lower_bound, unit, address}, contribution){
        console.log({ name, description, entries, sum, upper_bound, lower_bound, unit, address}, contribution)
        this.deserialize();
        if(this.data.filter((el) => el.address === address).length < 1){
            this.data.push({ name, description, entries, sum, upper_bound, lower_bound, unit, address, contribution, refresh: false, actualized: DateTime.now().toISO()});
            this.serialize();
        }
        
    }

    removeItem(address){
        this.deserialize();
        this.data = this.data.filter(e => e.address === address);
        this.serialize();
    }

    updateItem(item, contribution){
        this.deserialize();
        let index = this.data.findIndex(e => e.address === item.address)
        console.log(index, this.data[index], item.address)
        if(!this.data[index].hasOwnProperty("contribution")){
            this.data[index] = this.getLastActualization({ actualized: DateTime.now().toISO(), contribution, ...item, ...this.data[index] })
        }else{
            this.data[index] = this.getLastActualization({ actualized: DateTime.now().toISO(), ...item, ...this.data[index] })
        }
        
        this.serialize();
    }

    serialize() {
        localStorage.setItem("contracts", JSON.stringify(this.data))
    }

    purge(){
        this.data = [];
        this.serialize();
    }
}