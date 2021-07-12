import React from "react"
import lukas from "./lukas.jpg"
import oli from "./oli.jpeg"
import sebi from "./sebi.jpeg"

const ImprintScreen =(props) => {
    return(
        <div className="p-grid">
            <div className="p-col">
                <div className="p-grid p-dir-col">
                    <div className="p-col">
                        <img src={sebi}  style={{height: "200px"}} alt="Sebi Avatar"/>
                    </div>
                    <div className="p-col">
                    <a href="https://www.linkedin.com/in/sebastian-ciornei-98430018a/" target="_blank" rel="noopener noreferrer">Sebastian Ciornei</a>
                    </div>
                    <div className="p-col">
                        Fachliche Koordination
                    </div>
                </div>
            </div>
            <div className="p-col">
            <div className="p-grid p-dir-col">
                    <div className="p-col">
                    <img src={lukas} style={{height: "200px"}} alt="Lukas Avatar"/>
                    </div>
                    <div className="p-col">
                        <a href="https://www.linkedin.com/in/lukas-fruntke/" target="_blank" rel="noopener noreferrer">Lukas Fruntke</a>
                    </div>
                    <div className="p-col">
                        Architektur, Technische Umsetzung
                    </div>
                </div>
            </div>
            <div className="p-col">
            <div className="p-grid p-dir-col">
                    <div className="p-col">
                        <img src={oli} style={{height: "200px"}} alt="Oli Avatar"/>
                    </div>
                    <div className="p-col">
                    <a href="https://www.linkedin.com/in/oliver-groh-a8295b206/" target="_blank" rel="noopener noreferrer">Oliver Groh</a>
                    </div>
                    <div className="p-col">
                        Fachliche Koordination
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ImprintScreen