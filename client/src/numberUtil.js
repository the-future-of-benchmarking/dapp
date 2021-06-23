import {MAX_UD60x18} from "./dist/helpers/constants"
import {mbn} from "./dist/helpers/math"

export const toPrecision = (num) => {
    return mbn(num).toString();
}

export const fromPrecision = (numalike, number = true) => {
    if(number){
        return mbn(numalike).toNumber();
    }else{
        return mbn(numalike).toString();
    }
    
}



export const isInBounds = (num) => {
    const maxvalue = MAX_UD60x18
    return mbn(0).lte(mbn(num)) && mbn(maxvalue).gte(mbn(num));
}

export const maxSafeValueLength = MAX_UD60x18.length;
 

export const maxSafeValue = mbn(MAX_UD60x18).toNumber();

