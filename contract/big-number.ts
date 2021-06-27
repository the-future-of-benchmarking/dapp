import { BigNumber, formatFixed } from "@ethersproject/bignumber";
import fp from "evm-fp";

// @ts-ignore
 export const toEther =(numberString) => {
    return toEtherInternal(numberString).toHexString()
 }
// @ts-ignore
export const toEtherInternal = (numberString) => {
    return BigNumber.from(fp(numberString, 18));
 }
// @ts-ignore
export const fromEtherInternal = (numberString) => {
    return formatFixed(numberString, 18);
 }
