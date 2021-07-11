import { BenchmarkInteractions } from './BenchmarkInteractions';
import { fromPrecision, toPrecision } from "./numberUtil"
const Web3 = require('web3');

async function main() {
    let { networks } = require('./truffle-config.js')
    const provider = new Web3.providers.HttpProvider("http://" + networks.development.host + ":" + networks.development.port);

    const web3 = new Web3(provider);
    let accounts = await web3.eth.getAccounts();

    let instance = new BenchmarkInteractions(accounts[0], provider)


    let sum = [];

    // await instance.start("test", 1, 50, "Mio. EUR");
    await instance.startFromAddress("0x8543B7fA7eCee6C44bF766c6B3687bAe82f9917f")

    let nuAccounts = accounts.map((acc: any) => ({ account: acc, contribution: toPrecision((Math.random() * 48) + 1) }))
    for (let { account, contribution } of nuAccounts) {

        sum.push(contribution)

        try {
            instance.account= account;
            let p = await instance.participate(contribution)
            console.log(p)
            let r = await instance.getResults(contribution)
            console.log("Result", account, r)
            return;

        } catch (e) {
            console.error(e)
            let localSum = sum.reduce((accumulator, currentValue) => accumulator + currentValue) / sum.length
            console.error("ERROR", "Account", account, "Local Sum", localSum);
        }

    }

    //@ts-ignore
    let localSum = fromPrecision(sum.reduce((accumulator, currentValue) => accumulator + currentValue)) / sum.length
    console.log("Local Average", localSum)

}

main();