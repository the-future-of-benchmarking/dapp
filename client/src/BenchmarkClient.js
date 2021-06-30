import { fromPrecision, toPrecision } from "./numberUtil";
// @ts-ignore
import benchmarkContract from "./contracts/BenchMark.json";
import Web3 from "web3";
export class BenchmarkClient {
    constructor(account, provider) {
        this.web3 = provider;
        this.account = account;
    }
    async executewithGas(method, from, call = true) {
        let gasestimate = await method.estimateGas({ from });
        let gasprice = await this.web3.eth.getGasPrice();
        let round = (a) => a.toFixed(0);
        if (!call) {
            let send= await method.send({ from, gas: round(gasestimate * 1.5), gasPrice: round(+gasprice * 1.105) });
            return send;
        }
        return await method.call({ from, gas: round(gasestimate * 1.5), gasPrice: round(+gasprice * 1.1) });
    }
    async getDetails() {
        const result = await this.executewithGas(this.BenchMarkInstance.methods.benchmark(), this.account);
        let response = { name: null, description: null, entries: null, sum: null, upper_bound: null, lower_bound: null, unit: null, address: null };
        response.name = this.web3.utils.hexToUtf8(result.name);
        response.description = this.web3.utils.hexToUtf8(result.description)
        //@ts-ignore
        response.entries = +result.entries.toString();
        //@ts-ignore
        response.sum = fromPrecision(result.sum);
        //@ts-ignore
        response.upper_bound = fromPrecision(result.upper_bound.toString());
        //@ts-ignore
        response.lower_bound = fromPrecision(result.lower_bound.toString());
        response.unit = this.web3.utils.hexToUtf8(result.unit);
        response.address = this.BenchMarkInstance._address;
        return response;
    }
    async provision(benchmarkName, lowerBound, upperBound, benchmarkUnit, desc) {
        const BenchMark = new this.web3.eth.Contract(benchmarkContract.abi);
        let deployerFn = await BenchMark.deploy({
            data: benchmarkContract.bytecode,
            arguments: [this.web3.utils.toHex(benchmarkName), this.web3.utils.toHex(lowerBound), this.web3.utils.toHex(upperBound), this.web3.utils.toHex(benchmarkUnit)],
        });
        return await this.executewithGas(deployerFn, this.account, false);
    }
    async participate(value) {
        return await this.executewithGas(this.BenchMarkInstance.methods.participate(this.web3.utils.toHex(toPrecision(value))), this.account, false);
    }
    async start(name, lowerBound, upperBound, unit, desc) {
        this.BenchMarkInstance = await this.provision(name, lowerBound, upperBound, unit,desc, this.account);
        console.log(this.BenchMarkInstance._address);
    }
    async startFromAddress(address) {
        this.BenchMarkInstance = new this.web3.eth.Contract(benchmarkContract.abi, address);
    }
    async getResults(contribution) {
        let best = await this.executewithGas(this.BenchMarkInstance.methods.bestRating(contribution), this.account);
        let average = await this.executewithGas(this.BenchMarkInstance.methods.average(), this.account);
        let averageRated = await this.executewithGas(this.BenchMarkInstance.methods.averageRating(contribution), this.account);
        return { best, average: fromPrecision(average), averageRated };
    }
}