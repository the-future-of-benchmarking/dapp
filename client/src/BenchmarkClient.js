import BenchmarkContract from "./contracts/BenchMark.json";
export class BenchmarkClient {
    instance;
    constructor(address="0x26912E00C4698e3F1E391B0806473e6F83033507", web3){
        this.instance = new web3.eth.Contract(
            BenchmarkContract.abi,
            address,
          );
    }

    async participate(value){
        return await this.instance.participate(value);  
    }

    async getResult(){
        let average = await this.instance.average()
        let arr = (average.words[0].toString()).split("");
        arr.splice(2, 0, '.')
        return  Number(arr.join(""))
    }
}