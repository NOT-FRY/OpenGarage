import React from "react";
import Header from "../Header/Header";

export default function LoginPage() {

// Funzione per connettere MetaMask
    async function connectWallet() {
        if (!window.ethereum) {
            alert("MetaMask non è installato!");
            return;
        }

        try {
            const accounts = await window.ethereum.request({method: "eth_requestAccounts"});
            console.log("Account connesso:", accounts[0]);
            return accounts[0];
        } catch (error) {
            console.error("Errore durante la connessione:", error);
        }
    }

    return (
        <div>
            <Header/>
            <div className="button-container">
                <button onClick={connectWallet}>Connetti a MetaMask</button>
            </div>
        </div>
    )
}

