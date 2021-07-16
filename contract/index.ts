import { BenchmarkClient, BenchmarkFactory } from './BenchmarkInteractions';
import { fromPrecision, toPrecision } from "./numberUtil"
const Web3 = require('web3');

async function main() {
    let { networks } = require('./truffle-config.js')
    const provider = new Web3.providers.HttpProvider("http://" + networks.development.host + ":" + networks.development.port);

    const web3 = new Web3(provider);
    let accounts = await web3.eth.getAccounts();
    console.log(accounts)

    const factory = new BenchmarkFactory(web3)
    //const client = await factory.provision("TEST", 0, 50, "Mio. €", "TEST", accounts[0])

    let sum: any[] = [];


    let nuAccounts = accounts.map((acc: any) => ({ account: acc, contribution: ((Math.random() * 48) + 1) }))
    let i = 0;

    for (let { account, contribution } of nuAccounts) {

        sum.push(contribution)

        try {
            const instance = new BenchmarkClient(web3, "0xf6c3e74f772D02C749A5b05E647a046D1cb8e461", account)
            let p = await instance.participate(contribution)
            i++;
            // console.log(account)

        } catch (e) {

            if (!BenchmarkClient.decodeErrorMessage(e).includes("Already participated")) {
                console.error(e)
                let localSum = +sum.reduce((accumulator, currentValue) => accumulator + currentValue) / sum.length
                console.error("ERROR", "Account", account, "Local Sum", localSum);
            }
        }
        if (i > 2 || i == 0) {
            try {
                const instance = new BenchmarkClient(web3, "0xf6c3e74f772D02C749A5b05E647a046D1cb8e461", account)
                let r = await instance.getResults(contribution)
                console.log("Result", account, r)

            } catch (e) {

            }
        }


    }

    if (i != 0) {
        //@ts-ignore
        let localSum = +(sum.reduce((accumulator, currentValue) => accumulator + currentValue)) / sum.length
        console.log("Local Average", localSum)
    }


}

main();