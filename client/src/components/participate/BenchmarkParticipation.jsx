import { Card } from "primereact/card";
import React, { useState } from "react";
import { InputNumber } from 'primereact/inputnumber';
import { BenchmarkResult } from "./BenchmarkResult";
import { useContracts } from "./contracts-hook";
import { Button } from "primereact/button";



export const BenchmarkParticipation = ({
    smartContractAddress,
    showError,
    client
}) => {
    const { setEntry, getContract } = useContracts([])
    const [entryInput, setEntryInput] = useState(0);
    const [contract, setContract] = useState(null);

    getContract(smartContractAddress).then(el => setContract(el))

    let submit = async (address, input) => {
        try {
            setEntry(address, input)
            await client.startFromAddress(address)
            await client.participate(input)
        } catch (e) {
            if(e.message.includes("Internal JSON-RPC")){
                let msg = JSON.parse(e.message.substring(53).trim().replace(/\n/g, '')).message
                console.log("Nachricht", msg)
                showError(msg);
                return;
            }
            console.error(e.message)
            showError(e.message)
        }

    }

    if (!contract) {
        return (<p>Loading...</p>)
    } else {
        return (
            <div className="p-fluid p-grid, p-formgrid">
                <Card title="Benchmark Teilnahme" className="">
                    <div className="p-field p-col-12">
                        <div className="p-inputgroup">

                            <Button label="Contribute" onClick={() => typeof contract.entry === "number" ? "" : submit(smartContractAddress, entryInput)} disabled={typeof contract.entry === "number"} />
                            <span className="p-float-label">
                                <InputNumber id="input" value={typeof contract.entry === "number" ? contract.entry : entryInput} onChange={(e) => setEntryInput(e.value)} mode="decimal" locale="de-DE" minFractionDigits={0} maxFractionDigits={18} required={true} min={contract.min} max={contract.max} disabled={typeof contract.entry === "number"} />
                                <label htmlFor="input">Benchmark Input {contract.unit ? `(in ${contract.unit} )` : ''}</label>
                            </span>
                        </div>
                    </div>
                </Card>
                <div className="p-col-12">
                    {typeof contract.entry === "number" ?
                        <BenchmarkResult smartContractAddress={smartContractAddress} smartContractParticipants={contract.participants} smartContractResult={contract.result} smartContractUnit={contract.unit} smartContractEntry={contract.entry} bestInClass={contract.bestInClass} ratingValue={contract.rating} /> :
                        ""
                    }
                </div>
            </div>)
    }


}