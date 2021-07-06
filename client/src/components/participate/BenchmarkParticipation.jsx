import { Card } from "primereact/card";
import React, { useEffect, useState } from "react";
import { InputNumber } from 'primereact/inputnumber';
import { BenchmarkResult } from "./BenchmarkResult";
import { useContracts } from "./contracts-hook";
import { Button } from "primereact/button";
import { BenchmarkClient } from "BenchmarkClient";
import { Synchronization } from "Synchronization";



export const BenchmarkParticipation = ({
    smartContractAddress,
    showError,
    web3
}) => {
    const { setEntry, getContract } = useContracts([])
    const [entryInput, setEntryInput] = useState(0);
    const [contract, setContract] = useState(null);

    useEffect(() => {
        getContract(smartContractAddress).then(el => setContract(el))
    });

    

    let submit = async (address, input) => {
        try {
            const sync = new Synchronization();
            const client = new BenchmarkClient(web3, address);
            await client.participate(input)
            const details = await client.getDetails()
            //await client.startFromAddress(address)
            //await client.participate(input)
            //setEntry(address, input)
            sync.addItem(details, input)
        } catch (e) {
            if (e.message.includes("Internal JSON-RPC")) {

                if (e.message.includes("VM Exception while processing transaction: revert")) {
                    let a = e.message.replace("VM Exception while processing transaction: revert", "Smart Contract Fehler:")
                    let msg = JSON.parse(a.substring(25)).message
                    console.log("Nachricht", msg)
                    showError(msg);
                    return;
                } else {
                    let msg = JSON.parse(e.message.substring(25)).message
                    console.log("Nachricht", msg)
                    showError(msg);
                    return;
                }

            }

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

                            <Button label="Contribute" onClick={() => typeof contract.contribution === "number" ? "" : submit(smartContractAddress, entryInput)} disabled={typeof contract.contribution === "number"} />
                            <span className="p-float-label">
                                <InputNumber id="input" value={typeof contract.contribution === "number" ? contract.contribution : entryInput} onChange={(e) => setEntryInput(e.value)} mode="decimal" locale="de-DE" minFractionDigits={0} maxFractionDigits={18} required={true} min={contract.min} max={contract.max} disabled={typeof contract.contribution === "number"} />
                                <label htmlFor="input">Benchmark Input {contract.unit ? `(in ${contract.unit} )` : ''}</label>
                            </span>
                        </div>
                    </div>
                </Card>
                <div className="p-col-12">
                    {typeof contract.contribution === "number" ?
                        <BenchmarkResult smartContractAddress={smartContractAddress} smartContractParticipants={contract.participants} smartContractResult={contract.result} smartContractUnit={contract.unit} smartContractEntry={contract.contribution} bestInClass={contract.bestInClass} ratingValue={contract.rating} web3={web3} /> :
                        ""
                    }
                </div>
            </div>)
    }


}