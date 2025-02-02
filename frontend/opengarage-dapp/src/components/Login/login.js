import React, {useState} from "react";
import Header from "../Header/Header";
import {BrowserProvider, Contract} from "ethers";
import {assignRole, checkRole, Roles} from "../../utils/Role";
import {useNavigate} from "react-router-dom";
import {contractABI, contractAddress} from "../../utils/ContractUtils";
import {JsonRpcSigner} from "ethers";




export default function LoginPage(contract, signer) {
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


            const address = signer.getAddress()

            const isAdmin = await checkRole(contract.DEFAULT_ADMIN_ROLE(), address);

            if(isAdmin){
                const address = prompt("Inserisci l'indirizzo dell'utente:");
                await assignRole(Roles.INSURER_ROLE, address);

            }else{
                console.log("verifico ruolo...");
                const isManufacturer = await checkRole(contract.MANUFACTURER_ROLE(), address);
                if(isManufacturer){
                    navigate('/registerVehicle');
                }else{
                    const isMechanic = await checkRole(contract.MECHANIC_ROLE(), address);
                    if(isMechanic){
                        navigate('/maintenance');
                    }else{
                        navigate('/homePageUser');
                    }
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

