import { Card } from "primereact/card"
import React, { Component } from "react"
export class BenchmarkCreation extends Component{
    render(){
        return(<div className="p-grid">
        <div className="p-col-4">
            <Card title="Aktuelle Adresse" subTitle="SubTitle">
                Content
            </Card>
            <Card title="Title" subTitle="SubTitle">
                Content
            </Card>
            <Card title="Title" subTitle="SubTitle">
                Content
            </Card>
        </div>
        <div className="p-col">Item 1</div>
        <div className="p-col">Item 2</div>

    </div>)
    }
    
}