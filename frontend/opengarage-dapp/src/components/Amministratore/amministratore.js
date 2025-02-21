import React, { useState } from "react";
import "./amministratore.css";
import Header from "../Header/Header";
import {assignRole, Roles} from "../../utils/Role";
import {toast, ToastContainer} from "react-toastify";
import {toastError} from "../../utils/Toast";

function Amministratore() {
    const [selectedOption, setSelectedOption] = useState(Roles.MANUFACTURER_ROLE);
    const [userAddress, setUserAddress] = useState("");

    function onValueChange(event) {
        setSelectedOption(event.target.value);
    }

    function onAddressChange(event) {
        setUserAddress(event.target.value);
    }

    async function formSubmit(event) {
        event.preventDefault();

        if (!userAddress.trim()) {
            toastError('Inserisci un indirizzo valido.');
            return;
        }
        await assignRole(selectedOption, userAddress);
    }

    return (

        <div>
            <Header />
            <ToastContainer />
            <div className="container">
                <form onSubmit={formSubmit}>
                    <h1>Assegna un ruolo</h1>

                    <label>
                        Indirizzo utente:
                        <input
                            type="text"
                            value={userAddress}
                            onChange={onAddressChange}
                            placeholder="Inserisci l'indirizzo"
                            required
                        />
                    </label>

                    <h2>Seleziona il ruolo:</h2>

                    <label>
                        <input
                            type="radio"
                            value="MANUFACTURER_ROLE"
                            checked={selectedOption === Roles.MANUFACTURER_ROLE}
                            onChange={onValueChange}
                        />
                        Casa Produttrice
                    </label>

                    <label>
                        <input
                            type="radio"
                            value="MECHANIC_ROLE"
                            checked={selectedOption === Roles.MECHANIC_ROLE}
                            onChange={onValueChange}
                        />
                        Meccanico
                    </label>

                    <label>
                        <input
                            type="radio"
                            value="INSURER_ROLE"
                            checked={selectedOption === Roles.INSURER_ROLE}
                            onChange={onValueChange}
                        />
                        Assicuratore
                    </label>

                    <button className={"main-button"} type="submit">Assegna ruolo</button>
                </form>
            </div>
        </div>
    );
}

export default Amministratore;
