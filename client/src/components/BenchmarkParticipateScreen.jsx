import { Card } from "primereact/card";
import React, { Component } from "react";
import { Chip } from 'primereact/chip';
import { Toast } from 'primereact/toast';

import { SavedContracts } from "./participate/SavedContracts";
import { BenchmarkInformations } from "./participate/BenchmarkInformations";
import { BenchmarkParticipation } from "./participate/BenchmarkParticipation";
import { BenchmarkClient } from "BenchmarkClient";


export class ParticipateScreenComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            smartContractAddress: null,
            smartContractInterface: null
        }

        this.loadBenchmark = this.loadBenchmark.bind(this)
        this.toast = React.createRef();
        this.validateAddress = this.validateAddress.bind(this)
    }

    validateAddress(address, raiseError = true) {
        if (!this.props.web3.utils.isAddress(address)) {
            if (raiseError) {
                this.showError("Adresse ist nicht valid!")
            }
            return false;
        } else {
            return true;
        }
    }

    async loadBenchmark(address) {
        if (this.validateAddress(address)) {

            try {
                const client = new BenchmarkClient(this.props.web3, address)

                const element = await client.getDetails()
                if(element){
                    this.setState({
                        smartContractAddress: address,
                        smartContractDetails: element
                    })
                }
                // this.props.addContract({ entry: null, participants: 3, result: 20, bestInClass: true, rating: 5, })

            } catch (e) {
                console.error(e)
                this.showError(e.message)
            }




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
            <div className="p-col-5">
                <Toast ref={this.toast} />

                {/* <Card title="Aktuelle Adresse" className="p-mb-4">
                    <Chip template={this.props.currentAccount} />
                </Card> */}

                <SavedContracts loadBenchmark={this.loadBenchmark} smartContractAddress={this.state.smartContractAddress} showError={this.showError} web3={this.props.web3} />


                {this.state.smartContractAddress ? <BenchmarkInformations smartContractAddress={this.state.smartContractAddress} details={this.state.smartContractDetails} showError={this.showError} /> : ""}

            </div>
            <div className="p-col-7">
                {this.state.smartContractAddress ? <BenchmarkParticipation smartContractAddress={this.state.smartContractAddress} showError={this.showError} web3={this.props.web3} /> : <></>}
            </div>

        </div>)
    }
}

export const ParticipateScreen = ParticipateScreenComponent