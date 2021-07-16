import localforage from "localforage";
import { DateTime } from "luxon";

const attributes = ["name", "description", "entries", "sum", "upper_bound", "lower_bound", "unit", "address", "contribution", "refresh", "actualized"]
const timeOutMinutes = 10;
export class Synchronization {
    

    

    static needsActualization(item) {
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
        await localforage.ready();
        const keys = await localforage.keys()
        const entries = Array.from(new Set(keys.map(e => e.split('|')[0])))
        const returnValues = entries.map(Synchronization.getItem)
        let all =  await Promise.all(returnValues)
        return all;
    }


    static async getItem(address) {
        await localforage.ready();
        let data = await Promise.all(attributes.map(e => localforage.getItem(address + '|' + e)))
        let foundData = {};

        for (let i = 0; i < data.length; i++) {
            const element = data[i];
            foundData[attributes[i]] = element;
        }
        if (Object.keys(foundData).length > 1) {
            return Synchronization.needsActualization(foundData)
        } else {
            return null;
        }
    }

    static async addItem(data, contribution) {
        await localforage.ready();

        if (!await Synchronization.getItem(data.address)) {
            for (let i = 0; i < attributes.length; i++) {
                const key = attributes[i];

                await localforage.setItem(data.address + '|' + key, data[key])
            }
        }

    }

    static async removeItem(address) {
        await localforage.ready();
        try {
            for (let i = 0; i < attributes.length; i++) {
                const key = attributes[i];

                await localforage.removeItem(address + '|' + key)
            }
        } catch (e) {

        }

    }

    static async updateItem(item) {
        await localforage.ready();
        const foundItem = await Synchronization.getItem(item.address)

        let updateItem = Synchronization.needsActualization({ ...foundItem, ...item, actualized: DateTime.now().toISO() })
        
        
        for (let i = 0; i < attributes.length; i++) {
            const key = attributes[i];

            await localforage.setItem(updateItem.address + '|' + key, updateItem[key])
        }
    }


    static async purge() {
        await localforage.ready();
        await localforage.clear();
    }
}

