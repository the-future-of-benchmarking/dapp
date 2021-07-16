import { DateTime } from "luxon";

const attributes = ["name", "description", "entries", "sum", "upper_bound", "lower_bound", "unit", "address", "contribution", "refresh", "actualized"]
const timeOutMinutes = 10;

let storage:any = {};
export class Synchronization {
    

    static needsActualization(item:any) {
        if (item.actualized) {
            let actualized = DateTime.fromISO(item.actualized)
            let current = DateTime.now();
            let refresh = current.diff(actualized, "minutes")["minutes"] > timeOutMinutes;
            return { ...item, refresh }
        } else {
            return { ...item, refresh: true }
        }
    }

    static async getAll() {
        const keys = Object.keys(storage)
        const entries = Array.from(new Set(keys.map(e => e.split('|')[0])))
        const returnValues = entries.map(Synchronization.getItem)
        let all =  await Promise.all(returnValues)
        return all;
    }


    static async getItem(address:any) {
        let data = attributes.map(e => storage[address + '|' + e])
        let foundData = {};

        for (let i = 0; i < data.length; i++) {
            const element = data[i];
            // @ts-ignore
            foundData[attributes[i]] = element;
        }
        if (Object.keys(foundData).length > 1) {
            return Synchronization.needsActualization(foundData)
        } else {
            return null;
        }
    }

    static async addItem(data:any) {


        if (!await Synchronization.getItem(data.address)) {
            for (let i = 0; i < attributes.length; i++) {
                const key = attributes[i];

                storage[data.address + '|' + key] = data[key]
            }
        }

    }

    static async removeItem(address:any) {
        try {
            for (let i = 0; i < attributes.length; i++) {
                const key = attributes[i];

                delete storage[address + '|' + key]
            }
        } catch (e) {

        }

    }

    static async updateItem(item:any) {
        const foundItem = await Synchronization.getItem(item.address)

        let updateItem = Synchronization.needsActualization({ ...foundItem, ...item, actualized: DateTime.now().toISO() })
        
        
        for (let i = 0; i < attributes.length; i++) {
            const key = attributes[i];

            storage[updateItem.address + '|' + key] = updateItem[key]
        }
    }


    static async purge() {
        storage = {}
    }
}

