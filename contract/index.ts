import {MAX_UD60x18} from "../client/prb-math/helpers/constants"
import {mbn} from "../client/prb-math/helpers/math"
import {fromPrecision, toPrecision} from "./numberUtil"

async function main() {
    const Web3 = require('web3');
    let {networks} = require('./truffle-config.js')
    const provider = new Web3.providers.HttpProvider("http://"+networks.development.host+":"+networks.development.port)
    const web3 = new Web3(provider);

    


    const benchmarkContract = require('./build/contracts/BenchMark.json');
    

    let sum = [];


    let accounts = await web3.eth.getAccounts();


    
    let executewithGas = async (method:any, from:any, call= true) => {
        let gasestimate = await method.estimateGas({from})
        let gasprice = await web3.eth.getGasPrice();
        let round = (a: any) => a.toFixed(0)
        if(!call){
            return await method.send({from, gas: round(gasestimate*1.5), gasPrice: round(gasprice*1.105)})
        }
        return await method.call({from, gas: round(gasestimate*1.5), gasPrice: round(gasprice*1.1)})
    }
   

    let getDetails = async (BenchMarkInstance: any) => {
        const result = await executewithGas(BenchMarkInstance.methods.benchmark(), accounts[0]);
        let response = {name: null, entries: null, sum: null, upper_bound: null, lower_bound: null, unit: null}
        response.name = web3.utils.hexToUtf8(result.name)

            //@ts-ignore
            response.entries = +result.entries.toString() 
                        //@ts-ignore

            response.sum = fromPrecision(result.sum)
                        //@ts-ignore

            response.upper_bound = fromPrecision(result.upper_bound.toString()) 
                        //@ts-ignore

            response.lower_bound = fromPrecision(result.lower_bound.toString())
            response.unit = web3.utils.hexToUtf8(result.unit)
        
        return response;
    }
    

    let provision= async (benchmarkName: any, lowerBound:any, upperBound:any, benchmarkUnit:any) => {

        //console.log(toWeirdString(benchmarkName), toWeirdString(toPrecision(lowerBound)), toWeirdString(toPrecision(upperBound)), toWeirdString(benchmarkUnit))

        // const BenchMark = contract(benchmarkContract);
        // BenchMark.setProvider(provider);
        const BenchMark = new web3.eth.Contract(benchmarkContract.abi)
        let data = await BenchMark.deploy({
            data: benchmarkContract.bytecode,
            arguments:[web3.utils.toHex(benchmarkName), web3.utils.toHex(toPrecision(lowerBound)), web3.utils.toHex(toPrecision(upperBound)), web3.utils.toHex(benchmarkUnit)],
          })
          .send({
            from: accounts[0],
            gas: 4712388,
            gasPrice: 100000000000
          })

        return data;
    }

    let toWeirdString = (str: any) => {
        return web3.utils.padLeft(web3.utils.toHex(str) , 64)
    }

    

    // const BenchMarkInstance = await provision("testBenchmark", 1, 50, "Mio. €");
    const BenchMarkInstance = new web3.eth.Contract(benchmarkContract.abi,"0x86D815b0100D65F31dF66A69B3bb0C73f4eD6487")
    // contribution: 
    let nuAccounts = accounts.map((acc:any) => ({account: acc, contribution: Math.floor(Math.random() * 48)+1}))
    for(let {account,contribution} of nuAccounts){
        
        //let random = Math.floor(Math.random() * 48)+1;
        let random = contribution;
        sum.push(random)
        
        try{
       
            let value =  web3.utils.toHex(random)
            //console.log(toPrecision(random), value, fromPrecision(web3.utils.hexToNumberString(value)))
            let participation = await executewithGas(BenchMarkInstance.methods.participate(value), account, false)


        }catch(e){
            console.error(e)
            let localSum = sum.reduce((accumulator, currentValue) => accumulator + currentValue)/sum.length
            console.error("ERROR", "Account", account, "Local Sum", localSum);
        }
        
    }

    let localSum = sum.reduce((accumulator, currentValue) => accumulator + currentValue)/sum.length
    console.log("Local Average", localSum)

    for(let {account,contribution} of nuAccounts){
        
        //let random = Math.floor(Math.random() * 48)+1;
        let random = contribution;
        sum.push(random)
        
        try{
       
            let best = await executewithGas(BenchMarkInstance.methods.bestRating(contribution), account);
            let average = await executewithGas(BenchMarkInstance.methods.average(), account);
            let average_rated = await executewithGas(BenchMarkInstance.methods.averageRating(contribution), account);
            

            

            console.log("Result", account, contribution, fromPrecision(average), average_rated, best)


        }catch(e){
            console.error(e)
            let localSum = sum.reduce((accumulator, currentValue) => accumulator + currentValue)/sum.length
            console.error("ERROR", "Account", account, "Local Sum", localSum);
        }
        
    }

    

}

main();