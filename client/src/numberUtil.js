import {MAX_UD60x18} from "./dist/helpers/constants"
import {mbn} from "./dist/helpers/math"
import { BigNumber, formatFixed } from "@ethersproject/bignumber";
import fp from "evm-fp";

export const toPrecision = (num) => {
    return BigNumber.from(fp(num, 18));
}

export const fromPrecision = (numalike, number = true) => {
    let formatted = formatFixed(numalike, 18);
    if(number){
        return +formatted
    }else{
        return formatted
    }
    
}



export const isInBounds = (num) => {
    const maxvalue = MAX_UD60x18
    return mbn(0).lte(mbn(num)) && mbn(maxvalue).gte(mbn(num));
}

export const maxSafeValueLength = MAX_UD60x18.length;
 

export const maxSafeValue = mbn(MAX_UD60x18).toNumber();



// @ts-ignore
 export const toEtherPrecision =(numberString) => {
    return toPrecision(numberString).toHexString()
 }


