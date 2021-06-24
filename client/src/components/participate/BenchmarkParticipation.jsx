import { Card } from "primereact/card";
import React, { useState } from "react";
import { InputNumber } from 'primereact/inputnumber';
import { BenchmarkResult } from "./BenchmarkResult";
import { useContracts } from "./contracts-hook";
import { Button } from "primereact/button";



export const BenchmarkParticipation = ({
    smartContractAddress,
    showError
}) => {
    const { setEntry, getContract } = useContracts([])
    const [entryInput, setEntryInput] = useState(0);

    const currentContract = getContract(smartContractAddress);

    
    console.log(currentContract)

    return (
        <div className="p-fluid p-grid, p-formgrid">
            <Card title="Benchmark Teilnahme" className="">
                <div className="p-field p-col-12">
                    <div className="p-inputgroup">

                    <Button label="Contribute" onClick={() => typeof currentContract.entry === "number" ? "" : setEntry(smartContractAddress, entryInput)} disabled={typeof currentContract.entry === "number"} />
                    <span className="p-float-label">
                        <InputNumber id="input" value={typeof currentContract.entry === "number" ? currentContract.entry : entryInput} onChange={(e) => setEntryInput(e.value)} mode="decimal" locale="de-DE" minFractionDigits={0} maxFractionDigits={18} required={true} min={currentContract.min} max={currentContract.max} disabled={typeof currentContract.entry === "number"} />
                        <label htmlFor="input">Benchmark Input {currentContract.unit ? `(in ${currentContract.unit} )`: ''}</label>
                    </span>
                    </div>
                </div>
            </Card>
            <div className="p-col-12">
                {typeof currentContract.entry === "number" ? 
                <BenchmarkResult smartContractAddress={smartContractAddress} smartContractParticipants={currentContract.participants} smartContractResult={currentContract.result} smartContractUnit={currentContract.unit} smartContractEntry={currentContract.entry} bestInClass={currentContract.bestInClass} ratingValue={currentContract.rating}/> :
                ""
                }
            </div>
        </div>)
}