import { fromPrecision, maxSafeValue } from "numberUtil";
import BenchmarkContract from "./contracts/BenchMark.json";
export class BenchmarkClient {
    instance;
    web3;
    constructor(address = "0x26912E00C4698e3F1E391B0806473e6F83033507", web3) {
        this.instance = new web3.eth.Contract(
            BenchmarkContract.abi,
            address,
        );
        this.web3 = web3;
    }

    async participate(value) {
        return await this.instance.participate(value);
    }

    async getBenchmarkDetails() {
        const result = await this.instance.benchmark.call();
        let response = { name: null, entries: null, sum: null, upper_bound: null, lower_bound: null, unit: null }
        response.name = this.web3.utils.hexToUtf8(result.name)

        if (fromPrecision(result.sum.toString()) < maxSafeValue) {
            response.entries = +result.entries.toString()
            response.sum = fromPrecision(result.sum.toString())
            response.max = fromPrecision(result.upper_bound.toString()) < maxSafeValue ? fromPrecision(result.upper_bound.toString()) : maxSafeValue
            response.min = fromPrecision(result.lower_bound.toString()) < maxSafeValue ? fromPrecision(result.lower_bound.toString()) : maxSafeValue
            response.unit = this.web3.utils.hexToUtf8(result.unit)
        } else {
            throw new Error("Could not parse sum of contract " + result.name)
        }
        return response;
    }

    async getBenchmarkAverage() {
        let average = await this.instance.average()
        // let arr = (average.words[0].toString()).split("");
        // arr.splice(2, 0, '.')
        // return Number(arr.join(""))
        return fromPrecision(average.words[0].toString())
    }

    async getBestInClass() {

    }


}