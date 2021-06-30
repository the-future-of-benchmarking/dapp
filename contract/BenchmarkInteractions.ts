import { fromPrecision, toPrecision } from "./numberUtil"
const Web3 = require('web3');
const benchmarkContract = require('./build/contracts/BenchMark.json');
export class BenchmarkInteractions {
    web3;
    account;
    BenchMarkInstance: any;
    constructor(account: string, provider: any) {
        this.web3 = new Web3(provider);
        this.account = account;
    }

    private async executewithGas(method: any, from: any, call = true) {
        let gasestimate = await method.estimateGas({ from })
        let gasprice = await this.web3.eth.getGasPrice();
        let round = (a: any) => a.toFixed(0)
        if (!call) {
            return await method.send({ from, gas: round(gasestimate * 1.5), gasPrice: round(gasprice * 1.105) })
        }
        return await method.call({ from, gas: round(gasestimate * 1.5), gasPrice: round(gasprice * 1.1) })
    }

    async getDetails(account: any) {
        const result = await this.executewithGas(this.BenchMarkInstance.methods.benchmark(), account);
        let response = { name: null, entries: null, sum: null, upper_bound: null, lower_bound: null, unit: null }
        response.name = this.web3.utils.hexToUtf8(result.name)
        //@ts-ignore
        response.entries = +result.entries.toString()
        //@ts-ignore
        response.sum = fromPrecision(result.sum)
        //@ts-ignore
        response.upper_bound = fromPrecision(result.upper_bound.toString())
        //@ts-ignore
        response.lower_bound = fromPrecision(result.lower_bound.toString())
        response.unit = this.web3.utils.hexToUtf8(result.unit)

        return response;
    }

    private async provision(benchmarkName: any, lowerBound: any, upperBound: any, benchmarkUnit: any, account: any) {
        const BenchMark = new this.web3.eth.Contract(benchmarkContract.abi)
        let deployerFn = await BenchMark.deploy({
            data: benchmarkContract.bytecode,
            arguments: [this.web3.utils.toHex(benchmarkName), this.web3.utils.toHex(lowerBound), this.web3.utils.toHex(upperBound), this.web3.utils.toHex(benchmarkUnit)],
        })

        return await this.executewithGas(deployerFn, account, false)
    }

    async participate(value: any) {
        return await this.executewithGas(this.BenchMarkInstance.methods.participate(this.web3.utils.toHex(value)), this.account, false)
    }

    async start(name?: string, lowerBound?: number, upperBound?: number, unit?: string) {

        this.BenchMarkInstance = await this.provision(name, lowerBound, upperBound, unit, this.account);
        console.log(this.BenchMarkInstance._address)

    }

    async startFromAddress(address: string) {

        this.BenchMarkInstance = new this.web3.eth.Contract(benchmarkContract.abi, address)

    }

    async getResults(contribution: number) {
        let best = await this.executewithGas(this.BenchMarkInstance.methods.bestRating(contribution), this.account);
        let average = await this.executewithGas(this.BenchMarkInstance.methods.average(), this.account);
        let averageRated = await this.executewithGas(this.BenchMarkInstance.methods.averageRating(contribution), this.account);

        return { best, average: fromPrecision(average), averageRated }
    }

}