import { Card } from "primereact/card";
import React, { Component } from "react";
import { Chip } from 'primereact/chip';

import { InputNumber } from 'primereact/inputnumber';
import { SavedContracts } from "./participate/SavedContracts";
import { BenchmarkInformations } from "./participate/BenchmarkInformations";
import { BenchmarkResult } from "./participate/BenchmarkResult";
import { BenchmarkParticipation } from "./participate/BenchmarkParticipation";
import { BenchmarkClient } from "BenchmarkClient";


export class ParticipateScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            smartContractAddress: null,    
            smartContractInterface: null,     
        }

        this.loadBenchmark = this.loadBenchmark.bind(this)
    }

    loadBenchmark(address){
        if(!this.props.web3.utils.isAddress(address)){
            alert("Not a valid adress!")
        }else{
            this.setState({
                smartContractAddress: address,
                smartContractInterface: new BenchmarkClient(address, this.props.web3)
            })
        }
        
    }
    render() {
        return (<div className="p-grid">
            <div className="p-col-5">

                <Card title="Aktuelle Adresse" className="p-mb-4">
                    <Chip template={this.props.currentAccount} />
                </Card>

                <SavedContracts loadBenchmark={this.loadBenchmark} smartContractAddress={this.state.smartContractAddress} />


                {this.state.smartContractAddress ? <BenchmarkInformations smartContractAddress={this.state.smartContractAddress} /> :"" }

            </div>
            <div className="p-col-7">
            {this.state.smartContractAddress ? <BenchmarkParticipation smartContractAddress={this.state.smartContractAddress} /> : <></> }
            </div>

        </div>)
    }
}