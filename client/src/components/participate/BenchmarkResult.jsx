import React, { Component } from "react"
import { Card } from "primereact/card";
import { Chart } from 'primereact/chart';
import { Chip } from 'primereact/chip';
import { Rating } from 'primereact/rating';
import { BenchmarkClient } from "BenchmarkClient";
import { Synchronization } from "Synchronization";
import { Toast } from "primereact/toast";
import { Message } from 'primereact/message';



export const BenchmarkResultO = ({
    smartContractAddress,
    smartContractResult,
    smartContractUnit,
    smartContractParticipants,
    smartContractEntry,
    bestInClass,
    ratingValue,
    web3
}) => {
    /* const client = new BenchmarkClient(web3, smartContractAddress)
    const sync = new Synchronization()

    client.getResults(sync.getItem(smartContractAddress)).then(({best,average,averageRated}) => {
        console.log({best,average,averageRated})
    }) */
    const numAverage = smartContractResult / smartContractParticipants
    const chartData = {
        labels: ['Eigener Eintrag'].concat(new Array(smartContractParticipants).fill().map((el, i) => `${i + 1} (Schnitt)`)),
        datasets: [
            {
                data: [smartContractEntry].concat(new Array(smartContractParticipants).fill().map(el => (numAverage * smartContractParticipants + 1) / smartContractParticipants)),
                backgroundColor: ["#FF6384"].concat(new Array(smartContractParticipants).fill().map((el, i) => "#36A2EB")),
                hoverBackgroundColor: ["#FF6384"].concat(new Array(smartContractParticipants).fill().map((el, i) => "#36A2EB")),
            }]
    };

    const lightOptions = {
        plugins: {
            legend: {
                labels: {
                    color: '#495057'
                }
            }
        }
    };



    const average = <p>&empty; {smartContractResult / smartContractParticipants} {smartContractUnit}</p>
    const ownEntry = <p>Eigener Eintrag (lokal zwischengespeichert): {smartContractEntry}</p>
    const difference = <p>Differenz: {smartContractEntry > (numAverage) ? "+" : "-"} {Math.abs(numAverage - smartContractEntry)}</p>

    const rating = <><Rating value={ratingValue} readOnly cancel={false} stars={5} />&nbsp;(Gemessen am {bestInClass ? "besten Wert" : "Durchschnitt"})</>


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


export class BenchmarkResult extends Component {
    constructor(props){
        super(props);
        this.state = {best: null,average:null,averageRated:null}
        this.toast = React.createRef()
    }

    componentDidMount(){
        const client = new BenchmarkClient(this.props.web3, this.props.smartContractAddress)
        const sync = new Synchronization()
        client.getResults(sync.getItem(this.props.smartContractAddress).contribution).then(({best,average,averageRated}) => {
            console.log({best,average,averageRated})
            this.setState({best,average,averageRated})
        }).catch(e => {
            let msg = BenchmarkClient.decodeErrorMessage(e)
            console.error(msg)
            this.showError(msg);

            if(msg.includes("Not enough people have participated")){
                this.setState({errorMessage: "Keine Ergebnisse - Nicht genügend Teilnehmer"})
            }else{
                this.setState({errorMessage: msg})
            }
            
        })
    }

    showError = (message) => {
        this.toast.current.show({ severity: 'error', summary: 'Fehler', detail: message, life: 5000 });
    }

    render(){
        if(this.state.errorMessage){
            return <Card title="Ergebnisse"><Message severity="error" text={this.state.errorMessage} /></Card>
        }else{
          if(!this.state.best||!this.state.average||!this.state.averageRated){
            return <><Toast ref={this.toast} /><p>Loading...</p></>
        }else{
            return <><Toast ref={this.toast} /><p>{this.state.best},{this.state.average},{this.state.averageRated}</p></>
        }  
        }


        

    
    }
}