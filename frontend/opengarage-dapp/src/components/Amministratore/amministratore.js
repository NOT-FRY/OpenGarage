import React, { useState } from "react";
import "./amministratore.css";
import Header from "../Header/Header";

function Amministratore() {
    const [selectedOption, setSelectedOption] = useState("Meccanico");
    const [userAddress, setUserAddress] = useState("");

    function onValueChange(event) {
        setSelectedOption(event.target.value);
    }

    function onAddressChange(event) {
        setUserAddress(event.target.value);
    }

    function formSubmit(event) {
        event.preventDefault();

        if (!userAddress.trim()) {
            alert("Inserisci un indirizzo valido.");
            return;
        }

        console.log(`Ruolo assegnato: ${selectedOption} | Indirizzo: ${userAddress}`);
        alert(`Ruolo "${selectedOption}" assegnato a: ${userAddress}`);

    }

    return (
        <div className="container">
            <Header/>
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
                        value="Manufacturer"
                        checked={selectedOption === "Meccanico"}
                        onChange={onValueChange}
                    />
                    Manufacturer
                </label>

                <label>
                    <input
                        type="radio"
                        value="Updater"
                        checked={selectedOption === "Updater"}
                        onChange={onValueChange}
                    />
                    Updater
                </label>

                <label>
                    <input
                        type="radio"
                        value="Assicuratore"
                        checked={selectedOption === "Assicuratore"}
                        onChange={onValueChange}
                    />
                    Assicuratore
                </label>

                <button type="submit">Assegna ruolo</button>
            </form>
        </div>
    );
}

export default Amministratore;
