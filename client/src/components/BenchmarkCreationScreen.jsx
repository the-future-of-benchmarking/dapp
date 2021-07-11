import { Card } from "primereact/card"
import React, { Component } from "react"
import { Fieldset } from 'primereact/fieldset';
import GitInfo from 'react-git-info/macro';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Chip } from 'primereact/chip';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from "primereact/toast";
import { Field, Form } from "react-final-form";
import "./BenchmarkCreation.css"
import { Synchronization } from "Synchronization";
import { BenchmarkFactory } from "BenchmarkClient";

class BenchmarkCreationScreenComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            networkGuess: "",
        }
        this.toast = React.createRef();

        this.onSubmit = this.onSubmit.bind(this)
        this.isFormFieldValid = this.isFormFieldValid.bind(this)
        this.getFormErrorMessage = this.getFormErrorMessage.bind(this)
        this.validate = this.validate.bind(this)
    }

    gitInfo = GitInfo();

    async componentDidMount() {
        let networkGuess = await this.props.web3.eth.net.getNetworkType();
        this.setState({ networkGuess })
    }

    validate = (data) => {

        let errors = {};

        if (!data.name) {
            errors.name = "Bitte Name eingeben"
        }

        if (!data.description) {
            errors.description = "Bitte Beschreibung eingeben"
        }

        if (!data.unit) {
            errors.unit = "Bitte Einheit eingeben"
        }

        if (!data.lowerBound) {
            errors.lowerBound = "Bitte untere Grenze eingeben"
        }

        if (!data.upperBound) {
            errors.upperBound = "Bitte obere Grenze eingeben"
        }

        // 

        if (data.name.length > 32) {
            errors.name = "Name ist zu lang, maximal 32 Zeichen"
        }

        if (data.description.length > 32) {
            errors.description = "Beschreibung ist zu lang, maximal 32 Zeichen"
        }

        if (data.unit.length > 32) {
            errors.unit = "Einheit ist zu lang, maximal 32 Zeichen"
        }


        return errors;
    };



    async onSubmit(data, form) {
        console.log(data)
        try {
            const factory = new BenchmarkFactory(this.props.web3)
            const client = await factory.provision(data.name, data.lowerBound, data.upperBound, data.unit, data.description)

            const returnedDetails = await client.getDetails()

            await Synchronization.addItem({best: null, average: null, averageRated: null, ...returnedDetails})

            this.setState({ submitted: true })
            this.showSuccess("Angelegt")
            form.restart();
        } catch (e) {
            console.error(e)
            this.showError(e.message);
        }

    };

    isFormFieldValid = (meta) => !!(meta.touched && meta.error);
    getFormErrorMessage(meta) {
        return this.isFormFieldValid(meta) && <small className="p-error p-mb-2">{meta.error}</small>;
    };

    showError = (message) => {
        this.toast.current.show({ severity: 'error', summary: 'Fehler', detail: message, life: 5000 });
    }

    showInfo = (message) => {
        this.toast.current.show({ severity: 'info', summary: 'Info', detail: message, life: 5000 })
    }

    showSuccess = (message) => {
        this.toast.current.show({ severity: 'success', summary: 'Erfolg', detail: message, life: 5000 })
    }

    render() {
        return (<>
            <Toast ref={this.toast} />
            <div className="p-grid">

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
                                <div className="creation">
                                    <Form onSubmit={this.onSubmit} initialValues={{ name: '', description: '', unit: '', lowerBound: 1, upperBound: 2 }} validate={this.validate} render={({ handleSubmit }) => (
                                        <form onSubmit={handleSubmit} className="p-fluid">
                                            <Field name="name" render={({ input, meta }) => (
                                                <div className="p-field p-mt-2">
                                                    <span className="p-float-label">
                                                        <InputText id="name" {...input} autoFocus className={classNames({ 'p-invalid': this.isFormFieldValid(meta) })} />
                                                        <label htmlFor="name" className={classNames({ 'p-error': this.isFormFieldValid(meta) })}>Name*</label>
                                                    </span>
                                                    {this.getFormErrorMessage(meta)}

                                                </div>
                                            )} />

                                            <Field name="description" render={({ input, meta }) => (
                                                <div className="p-field p-mt-2">
                                                    <span className="p-float-label">
                                                        <InputTextarea id="desc" {...input} className={classNames({ 'p-invalid': this.isFormFieldValid(meta) })} />
                                                        <label htmlFor="desc" className={classNames({ 'p-error': this.isFormFieldValid(meta) })}>Beschreibung*</label>
                                                    </span>
                                                    {this.getFormErrorMessage(meta)}

                                                </div>
                                            )} />

                                            <Field name="unit" render={({ input, meta }) => (
                                                <div className="p-field p-mt-2">
                                                    <span className="p-float-label">
                                                        <InputText id="unit" {...input} className={classNames({ 'p-invalid': this.isFormFieldValid(meta) })} />
                                                        <label htmlFor="unit" className={classNames({ 'p-error': this.isFormFieldValid(meta) })}>Einheit*</label>
                                                    </span>
                                                    {this.getFormErrorMessage(meta)}

                                                </div>
                                            )} />

                                             <Field name="lowerBound" parse={(value, name) => parseFloat(value.value)} render={({ input, meta }) => (
                                                <div className="p-field p-mt-2">
                                                    <span className="p-float-label">
                                                        <InputNumber inputId="lowerBound" {...input} showButtons buttonLayout="horizontal" step={0.001} className={classNames({ 'p-invalid': this.isFormFieldValid(meta) })}
                                                            decrementButtonClassName="p-button-danger" incrementButtonClassName="p-button-success" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" />
                                                        <label htmlFor="lowerBound" className={classNames({ 'p-error': this.isFormFieldValid(meta) })}>Untergrenze*</label>
                                                    </span>
                                                    {this.getFormErrorMessage(meta)}

                                                </div>
                                            )} /> 

                                            <Field name="upperBound" parse={(value, name) => parseFloat(value.value)} render={({ input, meta }) => (
                                                <div className="p-field p-mt-2">
                                                    <span className="p-float-label">
                                                        <InputNumber inputId="upperBound" {...input} showButtons buttonLayout="horizontal" step={0.001} className={classNames({ 'p-invalid': this.isFormFieldValid(meta) })}
                                                            decrementButtonClassName="p-button-danger" incrementButtonClassName="p-button-success" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" />
                                                        <label htmlFor="upperBound" className={classNames({ 'p-error': this.isFormFieldValid(meta) })}>Obergrenze*</label>
                                                    </span>
                                                    {this.getFormErrorMessage(meta)}

                                                </div>
                                            )} />

                                            <Button type="submit" label="Submit" className="p-mt-2" />
                                        </form>
                                    )} />

                                    {this.state.contractAddress ? <div className="p-field">
                                        <div className="p-grid">
                                            <div className="p-col-12">
                                                <Fieldset legend="Contract Adresse">
                                                    <Chip style={{ backgroundColor: "#4caf50", color: "#ffffff" }} template={this.state.contractAddress}></Chip>
                                                </Fieldset>
                                            </div>
                                        </div>
                                    </div> : ""}

                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

            </div></>)
    }

}

export const BenchmarkCreationScreen = BenchmarkCreationScreenComponent