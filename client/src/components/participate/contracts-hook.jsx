import { BenchmarkClient } from 'BenchmarkClient';
import createPersistedState from 'use-persisted-state';
const useContractState = createPersistedState('contracts');


export const useContracts = initialContracts => {
    const [contracts, setContracts] = useContractState(initialContracts);

    const addContract= (address) => {
        let entry = {address, entry: null, unit: "Mio. €", min:2, max: 35, participants: 3, result: 20}
        setContracts(contracts => contracts && contracts.length > 0 ? [...contracts, entry] : [entry])
    }

         
    const findContract = (searchAddress) => contracts.findIndex(({address}) => searchAddress === address)

    const getContract= (searchAddress) => contracts.find(({address}) => searchAddress === address)

    const setEntry = (address, entry) => {
        let index = findContract(address)
        if(index > -1){
            setContracts(contracts => {
                contracts[index].entry = entry
                return contracts;
            })
        }else{
            setContracts(contracts => {
                contracts.push({address,entry})
                return contracts;
            })
        } 
    }
    const removeContract = (address) => setContracts(contracts => contracts && contracts.length> 0 ? contracts.filter(e => e.address === address) : [])

    return {
        contracts,
        addContract,
        setEntry,
        removeContract,
        findContract,
        getContract
    };
}