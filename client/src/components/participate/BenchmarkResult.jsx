import React, { Component } from "react"
import { Card } from "primereact/card";
import { Chip } from 'primereact/chip';
import { Rating } from 'primereact/rating';
import { BenchmarkClient } from "BenchmarkClient";
import { Synchronization } from "Synchronization";
import { Message } from 'primereact/message';
import { Button } from "primereact/button";
import { DateTime } from "luxon";
import scale from './scale.jpeg';
import { Toast } from "primereact/toast";



export const BenchmarkResultO = ({
    average,
    unit,
    participants,
    entry,
    bestInClass,
    ratingValue,
}) => {
    const caverage = <p>&empty; {average} {unit}</p>
    const ownEntry = <p>Eigener Eintrag (lokal zwischengespeichert): {entry}</p>
    const difference = <p>Differenz: {entry > (average) ? "+" : "-"} {Math.abs(average - entry)}</p>

    const bestRating = <><Rating value={ratingValue} readOnly cancel={false} stars={5} />&nbsp;(Gemessen am Durchschnitt)</>
    const averageRating = <><Rating value={bestInClass} readOnly cancel={false} stars={5} />&nbsp;(Gemessen am besten Wert)</>

    const cparticipants = <p>Teilnehmende: {participants}</p>


    return (
        <Card title="Benchmark Resultate" className="p-mt-2">
            <div className="p-grid">
                    <div className="p-col-5">
                        {/* <Chart type="doughnut" data={chartData} options={lightOptions} /> */}
                        <img src={scale} alt="Skala" />
                    </div>
                    <div className="p-col-7">
                        <div className="p-grid p-dir-col">
                        <div className="p-col">
                                <Chip template={cparticipants} />
                            </div>
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
    eventEmitter;
    client;
    constructor(props) {
        super(props);
        this.state = { best: null, average: null, averageRated: null, lastRefresh: null }
        this.client = new BenchmarkClient(this.props.web3, this.props.smartContractAddress)
        this.requestResults = this.requestResults.bind(this)
        this.toast = React.createRef();
        this.showInfo = this.showInfo.bind(this)
    }

    componentDidMount(){
        Synchronization.getItem(this.props.smartContractAddress).then(({actualized}) => this.setState({lastRefresh: actualized}))
        this.eventEmitter = this.client.getEmitter();
        // this.eventEmitter.on("data", console.log)
        this.eventEmitter.on('data', (event) =>{
            this.requestResults()
            this.showInfo("New Results available")
        })
    }

    componentWillUnmount(){
        this.eventEmitter = null;
    }

    showInfo = (message) => {
        this.toast.current.show({ severity: 'info', summary: 'Info', detail: message, life: 5000 })
    }

    requestResults = async () => {

        try {
            const details = await this.client.getDetails(true)
            const item = await Synchronization.getItem(this.props.smartContractAddress)
            console.log("Detz", details, item)

            const { best, average, averageRated } = await this.client.getResults(item.contribution);

            const {actualized, unit, contribution} = await Synchronization.getItem(this.props.smartContractAddress)

            this.setState({ best, average, averageRated, lastRefresh: actualized, errorMessage: "", unit, participants: details.entries, entry:contribution })
            await Synchronization.updateItem({ best, average, averageRated, ...details })
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

        return (<Card title="Ergebnisse" subTitle={"Letzte Aktualisierung: "+DateTime.fromISO(this.state.lastRefresh).toLocaleString(DateTime.DATETIME_MED)}>
            <Toast ref={this.toast} />
            {this.state.errorMessage ? <Message severity="error" text={this.state.errorMessage} /> : ""}
            <Button label="Ergebnisse laden" onClick={() => this.requestResults()} />
            {this.state.best && this.state.average && this.state.averageRated && !this.state.errorMessage && <BenchmarkResultO average={this.state.average} unit={this.state.unit} participants={this.state.participants} entry={this.state.entry} bestInClass={this.state.best} ratingValue={this.state.averageRated} />}
        </Card>)
        /*
        if(this.state.errorMessage){
            return <Card title="Ergebnisse"><Message severity="error" text={this.state.errorMessage} /></Card>
        }else{
          if(!this.state.best||!this.state.average||!this.state.averageRated){
            return 
        }
            return <><Toast ref={this.toast} /><p>{this.state.best},{this.state.average},{this.state.averageRated}</p></>
        
        }*/





    }
}