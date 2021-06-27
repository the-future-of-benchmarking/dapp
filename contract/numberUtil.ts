import { BigNumber, formatFixed } from "@ethersproject/bignumber";
import fp from "evm-fp";

// @ts-ignore
export const toPrecision = (num) => {
    if(typeof num === 'number'){
        num = num+ ""
    }
    return BigNumber.from(fp(num, 18)).toString();
}

// @ts-ignore
export const fromPrecision = (numalike, number = true) => {
    let formatted = formatFixed(numalike, 18);
    if(number){
        return +formatted
    }else{
        return formatted
    }
    
}


