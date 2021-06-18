import React, { useState } from "react"
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { InputText } from 'primereact/inputtext';
import { Chip } from 'primereact/chip';
import { useContracts } from "./contracts-hook";






export const SavedContracts = ({ loadBenchmark, smartContractAddress }) => {
    const { contracts, addContract } = useContracts([])
    const [contractInput, setContractInput] = useState("");
    return (
        <Card title="Gespeicherte Smart Contracts" className="p-mb-4 p-mt-4">
            <ul>
                {contracts && contracts.map(contract => (<li style={{ cursor: "pointer"}} key={contract.address} onClick={() => loadBenchmark(contract.address)}><Chip template={contract.address} style={{backgroundColor: (smartContractAddress === contract.address ? "#00BCD4" : ""), color: (smartContractAddress === contract.address ? "white" : "")}}  /></li>))}
            </ul>


            <div className="p-inputgroup p-mt-5">
                <Button label="Add" onClick={() => addContract(contractInput)} />
                <span className="p-float-label">
                    <InputText id="contract" value={contractInput} onChange={(e) => setContractInput(e.target.value)} />
                    <label htmlFor="contract">Contract</label>
                </span>

            </div>
        </Card>
    )
}