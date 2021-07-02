import { fromPrecision, toPrecision } from "./numberUtil";
// @ts-ignore
import benchmarkContract from "./contracts/BenchMark.json";
import Web3 from "web3";

class BlockChainInteractor {
    web3;
    constructor(web3){
        this.web3 = web3;
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
	
	toWeirdString(str) {
        return Web3.utils.padLeft(Web3.utils.toHex(str), 64)
    }
}

export class BenchmarkFactory extends BlockChainInteractor {
	account;
	constructor(account, provider) {
        super(provider);
        this.account = account;
    }
	async provision(benchmarkName, lowerBound, upperBound, benchmarkUnit, desc) {
        console.log(benchmarkName, lowerBound, upperBound, benchmarkUnit, desc)
        const BenchMark = new this.web3.eth.Contract(benchmarkContract.abi);
        let deployerFn = await BenchMark.deploy({
            data: benchmarkContract.bytecode,
            arguments: [this.toWeirdString(benchmarkName), this.web3.utils.toHex(lowerBound), this.web3.utils.toHex(upperBound), this.toWeirdString(benchmarkUnit), this.toWeirdString(desc)],
        });
        let returnValue = await this.executewithGas(deployerFn, this.account, false);
		return new BenchmarkClient(this.account, this.web3, returnValue._address);
    }
}

export class BenchmarkClient extends BlockChainInteractor {
	BenchMarkInstance = null;
	account;
    constructor(account, provider, address) {
        super(provider);
        this.account = account;
		this.BenchMarkInstance = new this.web3.eth.Contract(benchmarkContract.abi, address);
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
    
    async participate(value) {
        return await this.executewithGas(this.BenchMarkInstance.methods.participate(this.web3.utils.toHex(toPrecision(value))), this.account, false);
    }
    async getResults(contribution) {
        let best = await this.executewithGas(this.BenchMarkInstance.methods.bestRating(contribution), this.account);
        let average = await this.executewithGas(this.BenchMarkInstance.methods.average(), this.account);
        let averageRated = await this.executewithGas(this.BenchMarkInstance.methods.averageRating(contribution), this.account);
        return { best, average: fromPrecision(average), averageRated };
    }
}