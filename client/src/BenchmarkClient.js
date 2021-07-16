/* global BigInt */
import { fromPrecision, toPrecision } from "./numberUtil";
// @ts-ignore
import benchmarkContract from "./contracts/BenchMark.json";
import Web3 from "web3";
import { Synchronization } from "./Synchronization";
import * as paillierBigint from "paillier-bigint";
import * as bigintConversion from "bigint-conversion";
class BlockChainInteractor {
    constructor(web3) {
        this.web3 = web3;
    }
    async executewithGas(method, from, call = true) {
        let gasestimate = await method.estimateGas({ from });
        let gasprice = await this.web3.eth.getGasPrice();
        let round = (a) => a.toFixed(0);
        if (!call) {
            let send = await method.send({ from, gas: round(gasestimate * 1.5), gasPrice: round(+gasprice * 1.105) });
            return send;
        }
        return await method.call({ from, gas: round(gasestimate * 1.5), gasPrice: round(+gasprice * 1.1) });
    }
    toWeirdString(str) {
        return Web3.utils.padLeft(Web3.utils.toHex(str), 64);
    }
    async getAccounts() {
        let [account] = await this.web3.eth.getAccounts();
        return account;
    }
}
export class BenchmarkFactory extends BlockChainInteractor {
    async provision(benchmarkName, lowerBound, upperBound, benchmarkUnit, desc, account) {
        if (!benchmarkName || typeof lowerBound == "undefined" || typeof upperBound == "undefined" || !benchmarkUnit || !desc) {
            throw new Error("Required parameters missing");
        }
        const { publicKey, privateKey } = await paillierBigint.generateRandomKeys(128);
        let pub = { n: "", g: "", nSquared: "", zero: "" };
        let priv = { lambda: "", mu: "" };
        pub.n = '0x' + bigintConversion.bigintToHex(publicKey.n);
        pub.g = '0x' + bigintConversion.bigintToHex(publicKey.g);
        pub.nSquared = '0x' + bigintConversion.bigintToHex(publicKey.n ** 2n);
        pub.zero = '0x' + bigintConversion.bigintToHex(publicKey.encrypt(0n));
        priv.lambda = '0x' + bigintConversion.bigintToHex(privateKey.lambda);
        priv.mu = '0x' + bigintConversion.bigintToHex(privateKey.mu);
        const BenchMark = new this.web3.eth.Contract(benchmarkContract.abi);
        let deployerFn = await BenchMark.deploy({
            data: benchmarkContract.bytecode,
            arguments: [this.toWeirdString(benchmarkName), this.web3.utils.toHex(toPrecision(lowerBound)), this.web3.utils.toHex(toPrecision(upperBound)), this.toWeirdString(benchmarkUnit), this.toWeirdString(desc),
            pub.n, pub.g, pub.nSquared, priv.lambda, priv.mu, pub.zero],
        });
        if (!account) {
            account = await this.getAccounts();
            let returnValue = await this.executewithGas(deployerFn, account, false);
            return new BenchmarkClient(this.web3, returnValue._address, account);
        }
        else {
            let returnValue = await this.executewithGas(deployerFn, account, false);
            return new BenchmarkClient(this.web3, returnValue._address, account);
        }
    }
}
export class BenchmarkClient extends BlockChainInteractor {
    constructor(provider, address, account) {
        super(provider);
        this.BenchMarkInstance = new this.web3.eth.Contract(benchmarkContract.abi, address);
        this.address = address;
        this.account = account;
    }
    async getAccount() {
        if(!this.account){
            const [account] = await this.web3.eth.getAccounts();
            this.account = account;
        }
    }
    async getDetails(force = false, contribution) {
        await this.getAccount()
        const storageItem = await Synchronization.getItem(this.address);
        if (!storageItem || storageItem.refresh || force) {
            const result = await this.executewithGas(this.BenchMarkInstance.methods.benchmark(), this.account);
            let response = { name: null, description: null, entries: null, average: null, averageRated: null, upper_bound: null, lower_bound: null, unit: null, address: null, n: null, g: null };
            response.name = this.web3.utils.hexToUtf8(result.name);
            response.description = this.web3.utils.hexToUtf8(result.description);
            //@ts-ignore
            response.entries = +result.entries.toString();
            // @ts-ignore
            response.n = BigInt(result.n);
            // @ts-ignore
            response.g = BigInt(result.g);
            const lambda = BigInt(result.lambda);
            const mu = BigInt(result.mu);
            const n = BigInt(result.n);
            const g = BigInt(result.g);
            const k = new paillierBigint.PrivateKey(lambda, mu, new paillierBigint.PublicKey(n, g));
            // @ts-ignore
            response.average = +fromPrecision(k.decrypt(BigInt(result.sum))) / response.entries;
            if (contribution) {
                // @ts-ignore
                response.averageRated = BenchmarkClient.getAverageRating(contribution, response.average);
            }
            //@ts-ignore
            response.upper_bound = fromPrecision(result.upper_bound.toString());
            //@ts-ignore
            response.lower_bound = fromPrecision(result.lower_bound.toString());
            response.unit = this.web3.utils.hexToUtf8(result.unit);
            response.address = this.BenchMarkInstance._address;
            if ((storageItem && storageItem.refresh === true) || force) {
                await Synchronization.updateItem(response);
            }
            else {
                await Synchronization.addItem(response);
            }
            return response;
        }
        else {
            return storageItem;
        }
    }
    getEmitter() {
        return this.BenchMarkInstance.events.AggregateReady();
    }
    async getEnc(value) {
        await this.getAccount()
        let { n, g } = await Synchronization.getItem(this.address);
        if (!n || !g) {
            let details = await this.getDetails(true);
            n = details.n;
            g = details.g;
        }
        const precisionValue = toPrecision(value);
        const pubKey = new paillierBigint.PublicKey(BigInt(n), BigInt(g));
        let returnValue = '0x' + bigintConversion.bigintToHex(pubKey.encrypt(BigInt(precisionValue)));
        return returnValue;
    }
    async participate(value) {
        await this.getAccount()
        const encryptedValue = await this.getEnc(value);
        // console.log(encryptedValue)
        const response = await this.executewithGas(this.BenchMarkInstance.methods.participate(encryptedValue), this.account, false);
        await Synchronization.updateItem({ contribution: value, address: this.address });
        return response;
    }
    async getResults(contribution) {
        await this.getAccount()
        /*const internalContribution = toPrecision(contribution)
        const encryptedValue = await this.getEnc(internalContribution)

        let best = await this.executewithGas(this.BenchMarkInstance.methods.bestRating(encryptedValue), this.account);
        let average = await this.executewithGas(this.BenchMarkInstance.methods.average(), this.account);
        let averageRated = await this.executewithGas(this.BenchMarkInstance.methods.averageRating(encryptedValue), this.account);
        return { best: parseInt(best), average: fromPrecision(average), averageRated: parseInt(averageRated) };*/
        const { average, averageRated,entries } = await this.getDetails(true, contribution);
        if(entries < 3){
            throw new Error("Keine Ergebnisse - Nicht genügend Teilnehmer")
        }
        return { average, averageRated };
    }


    static decodeErrorMessage(e) {
        if (e.message.includes("Internal JSON-RPC")) {
            if (e.message.includes("VM Exception while processing transaction: revert")) {
                let a = e.message.replace("VM Exception while processing transaction: revert", "Smart Contract Fehler:");
                let msg = JSON.parse(a.substring(25)).message;
                return msg;
            }
            else {
                let msg = JSON.parse(e.message.substring(25)).message;
                return msg;
            }
        }
        else {
            return e.message;
        }
    }
    static percentage(percent, total) {
        return ((percent / 100) * total);
    }
    static getAverageRating(value, referenceValue) {
        const halb = BenchmarkClient.percentage(50, referenceValue);
        const viertel = BenchmarkClient.percentage(25, referenceValue);
        const dreiviertel = BenchmarkClient.percentage(75, referenceValue);
        const minushalb = BenchmarkClient.percentage(1, referenceValue);
        const plusviertel = BenchmarkClient.percentage(125, referenceValue);
        const plushalb = BenchmarkClient.percentage(150, referenceValue);
        const plusdreiviertel = BenchmarkClient.percentage(175, referenceValue);
        const plushundert = BenchmarkClient.percentage(200, referenceValue);
        if (value === referenceValue) {
            return 5;
        }
        else if (value < referenceValue && value > dreiviertel) {
            return 5;
        }
        else if (value < dreiviertel && value > halb) {
            return 4;
        }
        else if (value < halb && value > viertel) {
            return 3;
        }
        else if (value < viertel && value > minushalb) {
            return 2;
        }
        else if (value < minushalb) {
            return 1;
        }
        else if (value > referenceValue && value < plusviertel) {
            return 5;
        }
        else if (value > plusviertel && value < plushalb) {
            return 4;
        }
        else if (value > plushalb && value < plusdreiviertel) {
            return 3;
        }
        else if (value > plusdreiviertel && value < plushundert) {
            return 2;
        }
        else {
            return 1;
        }
    }
}