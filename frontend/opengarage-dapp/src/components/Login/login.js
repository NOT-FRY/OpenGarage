import React from "react";
import Header from "../Header/Header";
import {BrowserProvider, Contract} from "ethers";
import {assignRole, checkRole, Roles} from "../../utils/Role";
import {useNavigate} from "react-router-dom";
import {contractABI, contractAddress} from "../../utils/ContractUtils";

export default function LoginPage() {
    const navigate = useNavigate();

// Funzione per connettere MetaMask
    async function connectWallet() {
        if (!window.ethereum) {
            alert("MetaMask non è installato!");
            return;
        }

        try {
            const accounts = await window.ethereum.request({method: "eth_requestAccounts"});
            console.log("Account connesso:", accounts[0]);

            const provider = new BrowserProvider(window.ethereum);
            await provider.send("eth_requestAccounts", []);

            const signer = await provider.getSigner();
            const contract = new Contract(contractAddress, contractABI, signer);

            const address = signer.getAddress()

            const isAdmin = await checkRole(contract.DEFAULT_ADMIN_ROLE(), address);

            if(isAdmin){
                const address = prompt("Inserisci l'indirizzo dell'utente:");
                await assignRole(Roles.MANUFACTURER_ROLE, address);

            }else{
                const isManufacturer = await checkRole(contract.MANUFACTURER_ROLE(), address);
                if(isManufacturer){
                    navigate('/fileUploader');
                }
            }



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

