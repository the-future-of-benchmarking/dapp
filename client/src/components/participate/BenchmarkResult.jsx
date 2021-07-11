import React, { Component } from "react"
import { Card } from "primereact/card";
import { Chart } from 'primereact/chart';
import { Chip } from 'primereact/chip';
import { Rating } from 'primereact/rating';
import { BenchmarkClient } from "BenchmarkClient";
import { Synchronization } from "Synchronization";
import { Toast } from "primereact/toast";
import { Message } from 'primereact/message';
import { Button } from "primereact/button";
import { DateTime } from "luxon";



export const BenchmarkResultO = ({
    average,
    unit,
    participants,
    entry,
    bestInClass,
    ratingValue,
}) => {
    const numAverage = average / participants
    const chartData = {
        labels: ['Eigener Eintrag'].concat(new Array(participants).fill().map((el, i) => `${i + 1} (Schnitt)`)),
        datasets: [
            {
                data: [entry].concat(new Array(participants).fill().map(el => (numAverage * participants + 1) / participants)),
                backgroundColor: ["#FF6384"].concat(new Array(participants).fill().map((el, i) => "#36A2EB")),
                hoverBackgroundColor: ["#FF6384"].concat(new Array(participants).fill().map((el, i) => "#36A2EB")),
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



    const caverage = <p>&empty; {average / participants} {unit}</p>
    const ownEntry = <p>Eigener Eintrag (lokal zwischengespeichert): {entry}</p>
    const difference = <p>Differenz: {entry > (numAverage) ? "+" : "-"} {Math.abs(numAverage - entry)}</p>

    const bestRating = <><Rating value={ratingValue} readOnly cancel={false} stars={5} />&nbsp;(Gemessen am Durchschnitt)</>
    const averageRating = <><Rating value={bestInClass} readOnly cancel={false} stars={5} />&nbsp;(Gemessen am "besten Wert)</>


    return (
        <Card title="Benchmark Resultate" className="p-mt-2">
            <div className="p-grid">
                    <div className="p-col-5">
                        <Chart type="doughnut" data={chartData} options={lightOptions} />
                    </div>
                    <div className="p-col-7">
                        <div className="p-grid p-dir-col">
                            <div className="p-col">
                                <Chip template={bestRating} />
                            </div>
                            <div className="p-col">
                                <Chip template={averageRating} />
                            </div>
                            <div className="p-col"><Chip template={caverage}></Chip> </div>
                            <div className="p-col"><Chip template={ownEntry}></Chip> </div>
                            <div className="p-col"><Chip style={{ backgroundColor: entry > (average / participants) ? "#4caf50" : "#F57C00", color: "#ffffff" }} template={difference}></Chip> </div>

                        </div>
                    </div>
            </div>
        </Card>)
}


export class BenchmarkResult extends Component {
    constructor(props) {
        super(props);
        this.state = { best: null, average: null, averageRated: null, lastRefresh: null }
    }

    componentDidMount(){
        const sync = new Synchronization();
        const {actualized} = sync.getItem(this.props.smartContractAddress)
        this.setState({lastRefresh: actualized})
    }

    requestResults = async () => {

        try {
            const client = new BenchmarkClient(this.props.web3, this.props.smartContractAddress)
            const sync = new Synchronization()
            const details = await client.getDetails()
            console.log("Detz", details)
            const { best, average, averageRated } = await client.getResults(sync.getItem(this.props.smartContractAddress).contribution);

            const {actualized, unit, contribution} = sync.getItem(this.props.smartContractAddress)

            this.setState({ best, average, averageRated, lastRefresh: actualized, errorMessage: "", unit, participants: details.entries, entry:contribution })
            sync.updateItem({ best, average, averageRated, ...details })
        } catch (e) {
            const msg = BenchmarkClient.decodeErrorMessage(e)
            console.error(msg)
            this.setState({ errorMessage: msg });

            if (msg.includes("Not enough people have participated")) {
                this.setState({ errorMessage: "Keine Ergebnisse - Nicht genügend Teilnehmer" })
            } else {
                this.setState({ errorMessage: msg })
            }
        }



    }

    render() {

        return (<Card title="Ergebnisse">
            {this.state.errorMessage ? <Message severity="error" text={this.state.errorMessage} /> : ""}
            <p>Letzte Aktualisierung: {DateTime.fromISO(this.state.lastRefresh).toLocaleString(DateTime.DATETIME_MED)}</p>
            <Button label="Ergebnisse laden" onClick={() => this.requestResults()} />
            <p>{this.state.best},{this.state.average},{this.state.averageRated}</p>
            {this.state.best && this.state.average && this.state.averageRated && !this.state.errorMessage && <BenchmarkResultO average={this.state.average} unit={this.state.unit} participants={this.state.participants} entry={this.state.entry} bestInClass={this.state.best} ratingValue={this.state.averageRated} />}
        </Card>)
        /*
        if(this.state.errorMessage){
            return <Card title="Ergebnisse"><Message severity="error" text={this.state.errorMessage} /></Card>
        }else{
          if(!this.state.best||!this.state.average||!this.state.averageRated){
            return <><Toast ref={this.toast} /><p>Loading...</p></>
        }
            return <><Toast ref={this.toast} /><p>{this.state.best},{this.state.average},{this.state.averageRated}</p></>
        
        }*/





    }
}