




async function main() {
    const contract = require('@truffle/contract')
    const Web3 = require('web3');
    const provider = new Web3.providers.HttpProvider("http://localhost:8545")
    const web3 = new Web3(provider);


    const metacoin_artifact = require('./build/contracts/BenchMark.json');
    const BenchMark = contract(metacoin_artifact);
    BenchMark.setProvider(provider);

    let sum = [];


    let accounts = await web3.eth.getAccounts();

    let BenchMarkInstance = await BenchMark.deployed();

    for(let account of accounts){
        let random = Math.floor(Math.random() * 48)+1;
        sum.push(random)
        
        try{
            await BenchMarkInstance.participate(random, {from: account})
            let average = await BenchMarkInstance.average({from: account});
            let arr = (average.words[0].toString()).split("");
            arr.splice(2, 0, '.')
            let num = Number(arr.join(""))
            let localSum = sum.reduce((accumulator, currentValue) => accumulator + currentValue)/sum.length
            console.log("Account", account, "Smart Contract Sum:", num, "Local Sum", localSum, "Values don't match", localSum != num);

        }catch(e){
            let localSum = sum.reduce((accumulator, currentValue) => accumulator + currentValue)/sum.length
            console.error("ERROR", "Account", account, "Local Sum", localSum);
        }
        
    }

    

    

}

main();