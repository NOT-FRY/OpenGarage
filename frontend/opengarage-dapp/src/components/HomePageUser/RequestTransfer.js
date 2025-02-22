import {Dialog} from "@mui/material";
import React from "react";





export default function RequestTransfer(props) {

    const { onClose, open, carId, handleCarId, newOwner, handleNewOwner, onSubmit} = props;

    return (
        <Dialog open={open} onClose={onClose}>
            <div className="container">
                <h2>Avvia il Passaggio di Proprietà</h2>
                <form onSubmit={onSubmit} className="transfer-form">
                    <label>
                        Car ID:
                        <input
                            type="text"
                            value={carId}
                            onChange={(e) => handleCarId(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Indirizzo Nuovo Proprietario:
                        <input
                            type="text"
                            value={newOwner}
                            onChange={(e) => handleNewOwner(e.target.value)}
                            required
                        />
                    </label>
                    <button className={"main-button"} type={'submit'}>Invia Richiesta</button>
                </form>
            </div>
        </Dialog>
    );

}

