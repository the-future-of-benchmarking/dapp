import { Card } from "primereact/card";
import React, { useEffect, useState } from "react";
import { InputNumber } from 'primereact/inputnumber';
import { BenchmarkResult } from "./BenchmarkResult";
import { Button } from "primereact/button";
import { BenchmarkClient } from "BenchmarkClient";
import { Synchronization } from "Synchronization";



export const BenchmarkParticipation = ({
    smartContractAddress,
    showError,
    web3
}) => {
    const [entryInput, setEntryInput] = useState(0);
    const [contract, setContract] = useState(null);

    useEffect(() => {
        Synchronization.getItem(smartContractAddress).then(el => setContract(el))
    }, [smartContractAddress]);

    

    let submit = async (address, input) => {
        try {
            const client = new BenchmarkClient(web3, address);
            await client.participate(input)
            const details = await client.getDetails()
            await Synchronization.updateItem({...details, contribution: input}) 
            const contract = await Synchronization.getItem(smartContractAddress)
            setContract(contract)
        } catch (e) {

            showError(BenchmarkClient.decodeErrorMessage(e))
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
                            {/* <InputNumber value={entryInput} onValueChange={(e) => setEntryInput(e.value)} mode="decimal" locale="de-DE" minFractionDigits={2}/> */}
                            {typeof contract.contribution !== "number" ? 
                                <InputNumber id="input" value={entryInput} onChange={(e) => setEntryInput(e.value)} mode="decimal" locale="de-DE" minFractionDigits={2} 
                                 min={+contract.lower_bound} max={+contract.upper_bound} /> :
                                <InputNumber value={contract.contribution} mode="decimal" locale="de-DE" disabled={true}/>}
                                <label htmlFor="input">Benchmark Input {contract.unit ? `(in ${contract.unit} )` : ''}</label>
                            </span>
                        </div>
                    </div>
                </Card>
                <div className="p-col-12">
                    {typeof contract.contribution === "number" ?
                        <BenchmarkResult 
                        smartContractAddress={smartContractAddress} 
                        smartContractParticipants={contract.participants} 
                        smartContractResult={contract.result} 
                        smartContractUnit={contract.unit} 
                        smartContractEntry={contract.contribution} 
                        bestInClass={contract.bestInClass} 
                        ratingValue={contract.rating} 
                        web3={web3} /> :
                        ""
                    }
                </div>
            </div>)
    }


}