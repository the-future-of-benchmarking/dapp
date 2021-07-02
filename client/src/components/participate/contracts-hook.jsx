import createPersistedState from 'use-persisted-state';
import Web3 from 'web3';
const useContractState = createPersistedState('contracts');


export const useContracts = initialContracts => {
    const [contracts, setContracts] = useContractState(initialContracts);

    const addContract = async (entry, client) => {
        if(findContract(entry.address) > -1){
            setContracts(contracts => contracts && contracts.length > 0 ? [...contracts, entry] : [entry])
        }else if(Web3.utils.isAddress(entry)){
            await client.startFromAddress(entry);
            console.log(entry, client)
            await client.provision(entry.name, entry.lowerBound, entry.upperBound, entry.unit, entry.description)
            const details = await client.getDetails();
            setContracts(contracts => contracts && contracts.length > 0 ? [...contracts, details] : [details])
        }else{
            throw new Error("Invalid Address")
        }
        return contracts;
        
    }


    const findContract = (searchAddress) => {
        return contracts.findIndex(({ address }) => searchAddress === address)
    }


    const getContract = async(searchAddress, client) => {
        let contract = contracts.find(({ address }) => searchAddress === address)
        if(!contract){
            	return await addContract(searchAddress, client)

        }
        return contract;
    }

    const setEntry = (address, entry) => {
        let index = findContract(address)
        if (index > -1) {
            setContracts(contracts => {
                contracts[index].entry = entry
                return contracts;
            })
        } else {
            setContracts(contracts => {
                contracts.push({ address, entry })
                return contracts;
            })
        }
    }
    const removeContract = (address) => {
        return setContracts(contracts => contracts && contracts.length > 0 ? contracts.filter(e => e.address === address) : [])
    }

    return {
        contracts,
        addContract,
        setEntry,
        removeContract,
        findContract,
        getContract
    };
}