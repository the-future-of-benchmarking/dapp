import { Card } from "primereact/card";
import React, { Component, useState } from "react";
import {maxSafeValue} from "../../numberUtil.js"
import { InputNumber } from 'primereact/inputnumber';
import { BenchmarkResult } from "./BenchmarkResult";
import { useContracts } from "./contracts-hook";
import { Button } from "primereact/button";



export const BenchmarkParticipation = ({
    smartContractAddress,
}) => {
    const { contracts, setEntry, getContract } = useContracts([])
    const [entryInput, setEntryInput] = useState(0);

    const currentContract = getContract(smartContractAddress);

    
    console.log(currentContract)

    return (<Card title="Benchmark Teilnahme" className="p-mb-2">
        <div className="p-fluid p-grid, p-formgrid">
            <Card title="Benchmark Ergebnisse" className="p-mb-2 p-mt-2">
                <div className="p-field p-col-12">
                    <div className="p-inputgroup">

                    <Button label="Contribute" onClick={() => typeof currentContract.entry === "number" ? "" : setEntry(smartContractAddress, entryInput)} disabled={typeof currentContract.entry === "number"} />
                    <span className="p-float-label">
                        <InputNumber id="input" value={typeof currentContract.entry === "number" ? currentContract.entry : entryInput} onChange={(e) => setEntryInput(e.value)} mode="decimal" locale="de-DE" minFractionDigits={0} maxFractionDigits={5} required={true} min={currentContract.min} max={currentContract.max} suffix={currentContract.unit ? " " + currentContract.unit : ""} disabled={typeof currentContract.entry === "number"} />
                        <label htmlFor="input">Benchmark Input</label>
                    </span>
                    </div>
                </div>
            </Card>
            <div className="p-col-12">
                <BenchmarkResult smartContractAddress={smartContractAddress} smartContractParticipants={currentContract.participants} smartContractResult={currentContract.result} smartContractUnit={currentContract.unit} smartContractEntry={currentContract.entry}/>
            </div>
        </div>
    </Card>)
}