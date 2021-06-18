import React from "react"
import { Card } from "primereact/card";
import { Knob } from 'primereact/knob';
import { Chip } from 'primereact/chip';
import { useContracts } from "./contracts-hook";


export const BenchmarkInformations = ({
    smartContractAddress,
}) => {

    const { contracts, getContract } = useContracts([])

    const currentContract = getContract(smartContractAddress);
    return(
    <Card title="Benchmark Informationen" className="p-mb-4 p-mt-4">
                    <div className="p-grid">
                    {!smartContractAddress ? <div className="p-col-12">SmartContract nicht geladen, bitte oben selektieren</div>: <>

                        <div className="p-col-4">
                            <p>Smart Contract Adresse</p>
                        </div>

                        <div className="p-col-8">
                            {!smartContractAddress ? <p>"Nicht gesetzt"</p> : <Chip template={smartContractAddress}></Chip>}
                        </div>
                        <div className="p-col-4">
                            <p>
                                Einheit
                            </p>
                        </div>

                        <div className="p-col-8">
                            
                            
                                {!currentContract.unit ? <p>"Keine Einheit gesetzt"</p> : <Chip template={currentContract.unit}></Chip>}
                            
                        </div>

                        <div className="p-col-4">
                            <p>
                                Grenzen
                            </p>
                        </div>

                        {!currentContract.min || !currentContract.max ?
                            <div className="p-col-8"><p>Nicht gesetzt</p></div> : <>
                                <div className="p-col-4">
                                    <Knob value={currentContract.min} min={currentContract.min >= 0 ? currentContract.min : 0} max={currentContract.min < 0 ? 0 : currentContract.max} readOnly />
                                </div>
                                <div className="p-col-4">
                                    <Knob value={currentContract.max} min={currentContract.min >= 0 ? currentContract.min : 0} max={currentContract.max} readOnly />
                                </div>
                            </>
                        }
                        </>}

                    </div>
                </Card>)
}