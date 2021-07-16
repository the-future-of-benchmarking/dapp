import React from "react";
import architecture from "./Architektur.png"

export default function ArchitectureScreen(props) {
    return (
        <div className="p-grid">
            <div className="p-col-8 p-offset-2">
                <div className="p-grid p-dir-col">
                    <div className="p-col">
                        <h1>Architektur</h1>
                    </div>
                    <div className="p-col">
                        <img src={architecture} style={{ height: "200px" }} alt="Architektur" />
                    </div>
                    <div className="p-col">
                        <p>Im vorhergehenden Bild wird die Architektur dieser DApp dargestellt.</p>
                        <p>Die vorliegende React Webapplikation synchronisiert sich mit der Browsereigenen IndexedDB, welche Daten persistent abspeichert.</p>
                        <p>Synchronisiert wird diese Datenbank bei Nutzerinteraktion via der Metamask Erweiterung mit dem Smart Contract.</p>
                        <p>Ausführlichere Beschreibung siehe <a href="https://github.com/the-future-of-benchmarking/proof-of-concept/wiki">Wiki</a></p>
                    </div>
                
                </div>
            </div>
        </div>
    )
}