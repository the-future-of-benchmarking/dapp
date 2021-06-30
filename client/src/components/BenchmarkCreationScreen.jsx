import { Card } from "primereact/card"
import React, { Component } from "react"
import { Fieldset } from 'primereact/fieldset';
import GitInfo from 'react-git-info/macro';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Chip } from 'primereact/chip';
import { Button } from 'primereact/button';

import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from "primereact/toast";
import { withContracts } from "./withContracts";
class BenchmarkCreationScreenComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            networkGuess: null,
            contractName: null,
            contractDescription: null,
            isContractNameToLong: false,
            isDescriptionTooLong: false,
            lowerBound: 0,
            upperBound: 1,
            contractAddress: null,
            contractUnit: null, 
            isUnitTooLong: false
        }
        this.toast = React.createRef();
    }

    gitInfo = GitInfo();

    async componentDidMount() {
        let networkGuess = await this.props.web3.eth.net.getNetworkType();
        console.log(networkGuess)
        this.setState({ networkGuess })
    }

    inputName(input) {
        if (input.length > 32) {
            this.setState({ isContractNameToLong: true })
        } else {
            this.setState({ contractName: input, isContractNameToLong: false })
        }

    }

    inputDesc(input) {
        if (input.length > 32) {
            this.setState({ isDescriptionTooLong: true })
        } else {
            this.setState({ contractDescription: input, isDescriptionTooLong: false })
        }
    }

    inputUnit(input) {
        if (input.length > 32) {
            this.setState({ isUnitTooLong: true })
        } else {
            this.setState({ contractUnit: input, isUnitTooLong: false })
        }
    }

    async submit(e){
        e.preventDefault();
        try{
            let {_address} = await this.props.client.start(this.state.contractName, this.state.lowerBound, this.state.upperBound, this.state.contractUnit);
            
            
            this.props.addContract({ address: _address, unit: this.state.contractUnit, min: this.state.lowerBound, max: this.state.upperBound, name: this.state.contractName, description: this.state.contractDescription })
            this.showInfo("Erstellt");
        }catch(e){
            console.error(e)
            this.showError(e.message);
        }   
    }

    showError = (message) => {
        this.toast.current.show({ severity: 'error', summary: 'Fehler', detail: message, life: 5000 });
    }

    showInfo = (message) => {
        this.toast.current.show({ severity: 'info', summary: 'Info', detail: message, life: 5000 })
      }

    render() {
        return (<div className="p-grid">
            <Toast ref={this.toast} />
            <div className="p-col-6 p-offset-3">
                <Card title="Benchmark erstellen">
                    <div className="p-grid">
                        <div className="p-col-6">
                            <Fieldset legend="Account">
                                {this.props.currentAccount}
                            </Fieldset>
                        </div>
                        <div className="p-col-3">
                            <Fieldset legend="Network Guess">
                                {this.state.networkGuess}
                            </Fieldset>
                        </div>
                        <div className="p-col-3">
                            <Fieldset legend="Frontend Version">
                                {this.gitInfo.commit.shortHash}
                            </Fieldset>
                        </div>
                        <div className="p-col-10 p-offset-1">
                            <div className="p-field">
                                <div className="p-grid">
                                    <div className="p-col-4">
                                        <label htmlFor="name">Name des Benchmarks</label>
                                    </div>
                                    <div className="p-col-4">
                                        <InputText id="name" value={this.state.contractName} onChange={(e) => this.inputName(e.target.value)} className={`${this.state.isContractNameToLong ? "p-invalid" : ""}`} />
                                    </div>
                                </div>
                                <div className="p-grid">
                                    <div className="p-col-4 p-offset-4">
                                        {!this.state.isContractNameToLong ? <small id="name-help" className="p-d-block">Bitte Name eingeben</small> :
                                            <small id="name-help" className="p-d-block" style={{ color: "red" }}>Name ist zu lang</small>}
                                    </div>
                                </div>
                            </div>

                            <div className="p-field">
                                <div className="p-grid">
                                    <div className="p-col-4">
                                        <label htmlFor="desc">Beschreibung des Benchmarks</label>
                                    </div>
                                    <div className="p-col-4">
                                        <InputTextarea id="desc" value={this.state.contractDescription} onChange={(e) => this.inputDesc(e.target.value)} rows={5} cols={30} autoResize className={`${this.state.isDescriptionTooLong ? "p-invalid" : ""}`} />
                                    </div>
                                </div>
                                <div className="p-grid">
                                    <div className="p-col-4 p-offset-4">
                                        {!this.state.isDescriptionTooLong ? <small id="desc-help" className="p-d-block">Bitte Beschreibung eingeben</small> :
                                            <small id="desc-help" className="p-d-block" style={{ color: "red" }}>Beschreibung ist zu lang</small>}
                                    </div>
                                </div>
                            </div>

                            <div className="p-field">
                                <div className="p-grid">
                                    <div className="p-col-4">
                                        <label htmlFor="unit">Einheit des Benchmarks</label>
                                    </div>
                                    <div className="p-col-4">
                                        <InputText id="unit" value={this.state.contractUnit} onChange={(e) => this.inputUnit(e.target.value)} className={`${this.state.isContractUnitToLong ? "p-invalid" : ""}`} />

                                    </div>
                                </div>
                                <div className="p-grid">
                                    <div className="p-col-4 p-offset-4">
                                        {!this.state.isContractUnitToLong ? <small id="unit-help" className="p-d-block">Bitte Einheit (z.B. Mio. €) eingeben</small> :
                                            <small id="unit-help" className="p-d-block" style={{ color: "red" }}>Einheit ist zu lang</small>}
                                    </div>
                                </div>
                            </div>

                            <div className="p-field">
                                <div className="p-grid">
                                    <div className="p-col-4">
                                        <label htmlFor="lowerBound">Untere Wertegrenze</label>
                                    </div>
                                    <div className="p-col-4">
                                        <InputNumber inputId="lowerBound" value={this.state.lowerBound} onValueChange={(e) => this.setState({ lowerBound: e.value })} showButtons buttonLayout="horizontal" step={0.001}
                                            decrementButtonClassName="p-button-danger" incrementButtonClassName="p-button-success" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" />
                                    </div>
                                </div>
                                <div className="p-grid">
                                    <div className="p-col-4 p-offset-4">
                                        <small id="lower-help" className="p-d-block">Untere Wertegrenze angeben</small>
                                    </div>
                                </div>
                            </div>

                            <div className="p-field">
                                <div className="p-grid">
                                    <div className="p-col-4">
                                        <label htmlFor="upperBound">Obere Wertegrenze</label>
                                    </div>
                                    <div className="p-col-4">
                                        <InputNumber inputId="upperBound" value={this.state.upperBound} onValueChange={(e) => this.setState({ upperBound: e.value })} showButtons buttonLayout="horizontal" step={0.001}
                                            decrementButtonClassName="p-button-danger" incrementButtonClassName="p-button-success" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" />
                                    </div>
                                </div>
                                <div className="p-grid">
                                    <div className="p-col-4 p-offset-4">
                                        <small id="upper-help" className="p-d-block">Obere Wertegrenze angeben</small>
                                    </div>
                                </div>
                            </div>

                            <div className="p-field">
                                <Button label="Erstellen" icon="pi pi-check" onClick={this.submit} disabled={!this.state.isContractNameToLong && !this.state.isDescriptionTooLong && !this.state.isUnitTooLong && !!this.state.contractName && !!this.state.contractDescription && !!this.state.contractUnit && !!this.state.upperBound && !!this.state.lowerBound} />
                            </div>

                            {this.state.contractAddress ? <div className="p-field">
                                <div className="p-grid">
                                    <div className="p-col-12">
                                        <Fieldset legend="Contract Adresse">
                                            <Chip style={{backgroundColor: "#4caf50", color: "#ffffff"}} template={this.state.contractAddress}></Chip>
                                        </Fieldset>
                                    </div>
                                </div>
                            </div> : ""}

                        </div>
                    </div>
                </Card>
            </div>

        </div>)
    }

}

export const BenchmarkCreationScreen = withContracts(BenchmarkCreationScreenComponent)