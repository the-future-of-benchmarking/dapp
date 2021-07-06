import React, { useState, Component } from "react"
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { InputText } from 'primereact/inputtext';
import { Chip } from 'primereact/chip';
import Web3 from 'web3';
import { BenchmarkClient, BenchmarkFactory } from "BenchmarkClient";
import { Synchronization } from "Synchronization";
import { useContracts } from "./contracts-hook";


class AddContractComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            contractInput: ""
        }
        this.factory = new BenchmarkFactory(props.web3)
        this.addContract = this.addContract.bind(this)
    }

    addContract = async (inputAddress) => {
        if (!Web3.utils.isAddress(inputAddress)) {
            this.props.showError("Konnte nicht hinzugefügt werden - Addresse nicht valide")
            this.setState({ contractInput: "" })
        } else {

            try {
                const storage = new Synchronization()
                const client = new BenchmarkClient(this.props.web3, inputAddress)
                if(!storage.getItem(inputAddress)){
                    const { name, description, entries, sum, upper_bound, lower_bound, unit } = await client.getDetails()
                    storage.addItem({ name, description, entries, sum, upper_bound, lower_bound, unit, address: inputAddress })
                    this.setState({ contractInput: "" })
                }else{
                    this.setState({ contractInput: "" })
                }
                
            } catch (e) {
                this.props.showError("Adresse konnte nicht gefunden werden")
                this.setState({ contractInput: "" })
            }
        }
    }

    render() {
        return (
            <div className="p-inputgroup p-mt-5">
                <Button label="Add" onClick={() => this.addContract(this.state.contractInput)} />
                <span className="p-float-label">
                    <InputText id="contract" value={this.state.contractInput} onChange={(e) => this.setState({ contractInput: e.target.value })} />
                    <label htmlFor="contract">Contract</label>
                </span>

            </div>
        )
    }
}



export const SavedContracts = ({ loadBenchmark, smartContractAddress, web3, showError }) => {
    const { contracts, purgeContracts } = useContracts([])

    const emptyStorage = () => {
        const sync = new Synchronization();
        sync.purge()
        purgeContracts();
    }

    let filteredContracts = Array.from(new Set(contracts.filter(contract => web3.utils.isAddress(contract.address))))

    return (
        <Card title="Gespeicherte Smart Contracts" className="p-mb-4 p-mt-4">
            <div className="p-grid p-dir-col">
                {filteredContracts && filteredContracts.map(contract => (<div className="p-col" style={{ cursor: "pointer" }} key={contract.address} onClick={() => loadBenchmark(contract.address)}>
                    <Chip template={<>{contract.name} - {contract.address}</>} style={{ backgroundColor: (smartContractAddress === contract.address ? "#00BCD4" : ""), color: (smartContractAddress === contract.address ? "white" : "") }} />
                </div>))}
            </div>


            <AddContractComponent loadBenchmark={loadBenchmark} smartContractAddress={smartContractAddress} web3={web3} showError={showError} />
            <Button label="Delete" icon="pi pi-trash" className="p-button-danger p-mt-3" onClick={() => emptyStorage()}/>
        </Card>
    )
}