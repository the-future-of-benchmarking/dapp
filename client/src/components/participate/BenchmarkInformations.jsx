import React, { useState } from "react"
import { Card } from "primereact/card";
import { Knob } from 'primereact/knob';
import { Chip } from 'primereact/chip';
import { Synchronization } from "Synchronization";



export const BenchmarkInformations = ({
    smartContractAddress,showError, details
}) => {
    const [contract, setContract] = useState(null);
    const [visible, setVisible] = useState(true);

    Synchronization.getItem(smartContractAddress).then(el => setContract(el))
    
    if(!contract){
        return(<p>Loading...</p>)
    }else{

    return(
    <Card title="Benchmark Informationen" className="p-mb-4 p-mt-4" >
            <div className="p-mb-4">
            {visible ? <i className="pi pi-angle-up" onClick={() => setVisible(!visible)} style={{ cursor: "pointer" }} /> : <i className="pi pi-angle-down" onClick={() => setVisible(!visible)} style={{ cursor: "pointer" }} />}
            </div>
            {visible ?
                    <div className="p-grid">
                    {!smartContractAddress ? <div className="p-col-12">SmartContract nicht geladen, bitte oben selektieren</div>: <>

                    <div className="p-col-4">
                            <p>Smart Contract Name</p>
                        </div>

                        <div className="p-col-8">
                            {!contract.name ? <p>Nicht gesetzt</p> : <p>{contract.name}</p>}
                        </div>

            

                        <div className="p-col-4">
                            <p>Smart Contract Beschreibung</p>
                        </div>

                        <div className="p-col-8">
                            {!contract.description ? <p>Nicht gesetzt</p> :<p>{contract.description}</p>}
                        </div>

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
                            
                            
                                {!contract.unit ? <p>"Keine Einheit gesetzt"</p> : <Chip template={contract.unit}></Chip>}
                            
                        </div>

                        <div className="p-col-4">
                            <p>
                                Grenzen
                            </p>
                        </div>

                        {!contract.lower_bound || !contract.upper_bound ?
                            <div className="p-col-8"><p>Nicht gesetzt</p></div> : <>
                                <div className="p-col-4">
                                    <Knob value={contract.lower_bound} min={contract.lower_bound >= 0 ? contract.lower_bound : 0} max={contract.lower_bound < 0 ? 0 : contract.upper_bound} readOnly showValue={contract.upper_bound.toString().length < 5 && contract.lower_bound.toString().length < 5} />
                                    {contract.upper_bound.toString().length > 5 || contract.lower_bound.toString().length > 5 ? contract.lower_bound.toLocaleString('de-DE') : ""}&nbsp;
                                    <p>Mindestwert</p>
                                </div>
                                <div className="p-col-4">
                                    <Knob value={contract.upper_bound} min={contract.lower_bound >= 0 ? contract.lower_bound : 0} max={contract.upper_bound} readOnly showValue={contract.upper_bound.toString().length < 5 && contract.lower_bound.toString().length < 5} />
                                    {contract.upper_bound.toString().length > 5 || contract.lower_bound.toString().length > 5 ? contract.upper_bound.toLocaleString('de-DE') : ""}&nbsp;
                                    <p>Maximalwert</p>
                                </div>
                            </>
                        }
                        </>}

                    </div> : ""}
                </Card>)
    }
}