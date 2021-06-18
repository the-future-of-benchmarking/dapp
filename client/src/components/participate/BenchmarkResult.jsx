import React from "react"
import { Card } from "primereact/card";
import { Chart } from 'primereact/chart';
import { Chip } from 'primereact/chip';

export const BenchmarkResult = ({
    smartContractAddress,
    smartContractResult,
    smartContractUnit,
    smartContractParticipants,
    smartContractEntry
}) => {
    
    let chartData = {
        labels: ['Eigener Eintrag'].concat(new Array(smartContractParticipants).map((el,i) => `${i} (Schnitt)`)),
        datasets: [
            {
                data: [smartContractEntry].concat(new Array(smartContractParticipants).fill().map(el => smartContractResult/smartContractParticipants)),
                backgroundColor: ["#FF6384"].concat(new Array(smartContractParticipants).fill().map((el,i) => "#36A2EB")),
                hoverBackgroundColor: ["#FF6384"].concat(new Array(smartContractParticipants).fill().map((el,i) => "#36A2EB")),
            }]
    };


    console.log(chartData,(Array(smartContractParticipants).fill().map(el => smartContractResult/smartContractParticipants)))

    let lightOptions = {
        plugins: {
            legend: {
                labels: {
                    color: '#495057'
                }
            }
        }
    };

    let average = <p>&empty; {smartContractResult/smartContractParticipants} {smartContractUnit}</p>
    let ownEntry = <p>Eigener Eintrag (lokal zwischengespeichert): {smartContractEntry}</p>
    let difference = <p>Differenz: {smartContractEntry > (smartContractResult/smartContractParticipants) ? "+" : "-"} {(smartContractResult/smartContractParticipants)- smartContractEntry}</p>

    return(
    <Card title="Benchmark Ergebnisse" className="p-mb-4 p-mt-4">
                    <div className="p-grid">
                {!smartContractAddress ? <div className="p-col-12">SmartContract nicht geladen, bitte oben selektieren</div>: <>

                        <div className="p-col-5">
                        <Chart type="doughnut" data={chartData} options={lightOptions}  />
                        </div>
                        <div className="p-col-7">
                        <div className="p-grid p-dir-col">
                            <div className="p-col"><Chip template={average}></Chip> </div>
                            <div className="p-col"><Chip template={ownEntry}></Chip> </div>
                            <div className="p-col"><Chip style={{backgroundColor: smartContractEntry > (smartContractResult/smartContractParticipants) ? "#4caf50" : "F57C00"}} template={difference}></Chip> </div>
                            
                            
                            
                            </div>
                        </div>
                    </>}
                    </div>
                </Card>)
}