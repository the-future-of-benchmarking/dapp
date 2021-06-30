import React from "react"
import { Card } from "primereact/card";
import { Chart } from 'primereact/chart';
import { Chip } from 'primereact/chip';
import { Rating } from 'primereact/rating';


export const BenchmarkResult = ({
    smartContractAddress,
    smartContractResult,
    smartContractUnit,
    smartContractParticipants,
    smartContractEntry,
    bestInClass,
    ratingValue
}) => {
    let numAverage = smartContractResult / smartContractParticipants
    let chartData = {
        labels: ['Eigener Eintrag'].concat(new Array(smartContractParticipants).fill().map((el, i) => `${i + 1} (Schnitt)`)),
        datasets: [
            {
                data: [smartContractEntry].concat(new Array(smartContractParticipants).fill().map(el => (numAverage * smartContractParticipants + 1) / smartContractParticipants)),
                backgroundColor: ["#FF6384"].concat(new Array(smartContractParticipants).fill().map((el, i) => "#36A2EB")),
                hoverBackgroundColor: ["#FF6384"].concat(new Array(smartContractParticipants).fill().map((el, i) => "#36A2EB")),
            }]
    };

    let lightOptions = {
        plugins: {
            legend: {
                labels: {
                    color: '#495057'
                }
            }
        }
    };



    let average = <p>&empty; {smartContractResult / smartContractParticipants} {smartContractUnit}</p>
    let ownEntry = <p>Eigener Eintrag (lokal zwischengespeichert): {smartContractEntry}</p>
    let difference = <p>Differenz: {smartContractEntry > (numAverage) ? "+" : "-"} {Math.abs(numAverage - smartContractEntry)}</p>

    let rating = <><Rating value={ratingValue} readOnly cancel={false} stars={5} />&nbsp;(Gemessen am {bestInClass ? "besten Wert" : "Durchschnitt"})</>


    return (
        <Card title="Benchmark Resultate" className="p-mt-2">
            <div className="p-grid">
                {!smartContractAddress ? <div className="p-col-12">SmartContract nicht geladen, bitte oben selektieren</div> : <>

                    <div className="p-col-5">
                        <Chart type="doughnut" data={chartData} options={lightOptions} />
                    </div>
                    <div className="p-col-7">
                        <div className="p-grid p-dir-col">
                            <div className="p-col">
                                <Chip template={rating} />
                            </div>
                            <div className="p-col"><Chip template={average}></Chip> </div>
                            <div className="p-col"><Chip template={ownEntry}></Chip> </div>
                            <div className="p-col"><Chip style={{ backgroundColor: smartContractEntry > (smartContractResult / smartContractParticipants) ? "#4caf50" : "#F57C00", color: "#ffffff" }} template={difference}></Chip> </div>

                        </div>
                    </div>
                </>}
            </div>
        </Card>)
}