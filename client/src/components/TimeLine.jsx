import React from "react";
import { Timeline } from 'primereact/timeline';
import { Card } from 'primereact/card';
export const events = [
    { status: 'Benchmark wird erstellt', date: '15/10/2020 10:30', icon: 'pi pi-cog', color: "#2196F3", content: "Der Benchmark wird als Smart Contract von einer initiierende Partei auf einer Etherum-basierten Blockchain online gestellt." },
    { status: 'Benchmark wird an Nutzende verteilt', date: '15/10/2020 14:00', icon: 'pi pi-cog', color: '#607D8B', content: "Die Nutzenden erhalten die Adresse des Smart Contracts, die sie in ihre Webanwendung eintragen können." },
    { status: 'Nutzende tragen eigene Daten ein', date: '15/10/2020 16:15', icon: 'pi pi-pencil', color: '#607D8B', content: "Die Nutzenden tragen eigene Werte innerhalb der vorgegebenen Wertegrenzen ein." },
    { status: 'Warten auf andere Nutzende', icon: "pi pi-spin pi-spinner", color: '#607D8B', content: "Die Nutzenden warten auf die Eintragungen anderer Nutzenden"},
    { status: 'Ab > 3 Ergebnissen ist das Resultat zugänglich', date: '16/10/2020 10:00', icon: 'pi pi-check', color: '#4caf50', content: "Sobald die Marke von drei eingetragenen Werten überschritten wird, können die Nutzenden das aktuelle Resultat einsehen." }
];

const customizedContent = (item) => {
    return (
        <Card title={item.status}>
            {item.content}
        </Card>
    );
};

const customizedMarker = (item) => {


        

        return (
        <span className="custom-marker p-shadow-2" style={{ backgroundColor: item.color }}>
            <i className={item.icon}></i>
        </span>
    );


    
};
export function TimeLine(){
  return(<Timeline value={events} align="alternate" content={customizedContent} marker={customizedMarker}/>)
}