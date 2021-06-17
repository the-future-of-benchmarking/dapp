import { Card } from "primereact/card";
import React, { Component } from "react";
import { Knob } from 'primereact/knob';

export class ParticipateScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            smartContract: { address: null, unit: null, min: 5, max: 50 }
        }
    }
    render() {
        return (<div className="p-grid">
            <div className="p-col-5">

                <Card title="Aktuelle Adresse" className="p-mb-4 p-mt-4">
                    {this.props.currentAccount}
                </Card>

                <Card title="Gespeicherte Smart Contracts" className="p-mb-4 p-mt-4">
                    <ul>
                        <li>A</li>
                        <li>B</li>
                    </ul>
                </Card>


                <Card title="Benchmark Informationen" className="p-mb-4 p-mt-4">
                    <div className="p-grid">

                        <div className="p-col-4">
                            <p>Smart Contract Adresse</p>
                        </div>

                        <div className="p-col-8">
                            <p>{!this.state.smartContract.address ? "Nicht gesetzt" : this.state.smartContract.address}</p>
                        </div>
                        <div className="p-col-4">
                            <p>
                                Einheit
                            </p>
                        </div>

                        <div className="p-col-8">
                            <p>
                                {!this.state.smartContract.unit ? "Keine Einheit gesetzt" : this.state.smartContract.unit}
                            </p>
                        </div>

                        <div className="p-col-4">
                            <p>
                                Grenzen
                            </p>
                        </div>

                        {!this.state.smartContract.min || !this.state.smartContract.max ?
                            <div className="p-col-8"><p>Nicht gesetzt</p></div> : <>
                                <div className="p-col-4">
                                    <Knob value={this.state.smartContract.min} min={this.state.smartContract.min >= 0 ? this.state.smartContract.min : 0} max={this.state.smartContract.min < 0 ? 0 : this.state.smartContract.max} readOnly />
                                </div>
                                <div className="p-col-4">
                                    <Knob value={this.state.smartContract.max} min={this.state.smartContract.min >= 0 ? this.state.smartContract.min : 0} max={this.state.smartContract.max} readOnly />
                                </div>
                            </>
                        }

                    </div>
                </Card>

            </div>
            <div className="p-col">Item 1</div>

        </div>)
    }
}