import React, { useState } from "react"
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { InputText } from 'primereact/inputtext';
import { Chip } from 'primereact/chip';
import { useContracts } from "./contracts-hook";






export const SavedContracts = ({ loadBenchmark, smartContractAddress, web3, showError }) => {
    const { contracts, addContract } = useContracts([])
    const [contractInput, setContractInput] = useState("");

    let addAContract =(input) => {
        if(!web3.utils.isAddress(input)){
            showError("Konnte nicht hinzugefügt werden - Addresse nicht valide")
            addContract(input)
            setContractInput("");
        }else{
            setContractInput("")
        }
    }


    return (
        <Card title="Gespeicherte Smart Contracts" className="p-mb-4 p-mt-4">
            <div className="p-grid p-dir-col">
                {contracts && contracts.filter(contract => web3.utils.isAddress(contract.address)).map(contract => (<div className="p-col" style={{ cursor: "pointer"}} key={contract.address} onClick={() => loadBenchmark(contract.address)}>
                <Chip template={<>{contract.name} - {contract.address}</>} style={{backgroundColor: (smartContractAddress === contract.address ? "#00BCD4" : ""), color: (smartContractAddress === contract.address ? "white" : "")}}  />
                </div>))}
            </div>


            <div className="p-inputgroup p-mt-5">
                <Button label="Add" onClick={() => addAContract(contractInput)} />
                <span className="p-float-label">
                    <InputText id="contract" value={contractInput} onChange={(e) => setContractInput(e.target.value)} />
                    <label htmlFor="contract">Contract</label>
                </span>

            </div>
        </Card>
    )
}