import React, { useState, useEffect } from "react";
import './HomePageUser.css';
import Header from "../Header/Header";
import axios from "axios";
import { BrowserProvider, Contract } from "ethers";
import { contractABI, contractAddress } from "../../utils/ContractUtils";
import { useNavigate } from "react-router-dom";
import {checkRole} from "../../utils/Role";
import {getVehicleDetails, sendDataToIpfs} from "../../utils/VehicleUtils";
import {toast, ToastContainer} from "react-toastify";
import {toastError, toastSuccess, toastWarn} from "../../utils/Toast";

function HomePageUser() {
    const [carId, setCarId] = useState("");
    const [carIdForApprove, setCarIdForApprove] = useState("");
    const [newOwner, setNewOwner] = useState("");
    const [pendingTransfers, setPendingTransfers] = useState([]);
    const [contract, setContract] = useState(null);
    const [signer, setSigner] = useState(null);

    const navigate = useNavigate();

    const onSubmitRequest = (e) =>{
        e.preventDefault();
        handleTransferRequest().then(r=>{
            console.log("richiesta ok");
        })
    }

    const onSubmitApprove =  (e) =>{
        e.preventDefault();
       handleApproveTransfer().then(r=>{
            console.log("richiesta ok");
        })
    }

    const handleTransferRequest = async () => {
        if (!window.ethereum) {
            toastError('Attenzione, Metamask non è installato!');
            return;
        }
        try {
            const provider = new BrowserProvider(window.ethereum);
            await provider.send("eth_requestAccounts", []);

            const signer = await provider.getSigner();
            const contract = new Contract(contractAddress, contractABI, signer);

            const isADMIN = await checkRole(contract.DEFAULT_ADMIN_ROLE(), signer );
            const isManufacturer = await checkRole(contract.MANUFACTURER_ROLE(), signer );
            const isInsurer = await checkRole(contract.INSURER_ROLE(), signer);
            const isMechanic = await checkRole(contract.MECHANIC_ROLE(), signer);

            //Utente normale
            if (!isADMIN && !isManufacturer && !isInsurer && !isMechanic){
                setSigner(signer);
                setContract(contract);
                const tx = await contract.requestVehicle(carId, newOwner);
                await tx.wait();
                toastSuccess('Richiesta di trasferimento eseguita!');
            }else{
                toastWarn('User is a special User!');
            }

        } catch (error) {
            console.error("Errore nella richiesta del trasferimento:", error);
            toastError('Errore nella richiesta di trasferimento.');
        }
    }

    // Funzione per approvare il trasferimento
    const handleApproveTransfer = async (carId) => {
        if (!window.ethereum) {
            toastError('Attenzione, Metamask non è installato!');
            return;
        }

        try {
            const provider = new BrowserProvider(window.ethereum);
            await provider.send("eth_requestAccounts", []);

            const signer = await provider.getSigner();
            const contract = new Contract(contractAddress, contractABI, signer);

            const isADMIN = await checkRole(contract.DEFAULT_ADMIN_ROLE(), signer );
            const isManufacturer = await checkRole(contract.MANUFACTURER_ROLE(), signer );
            const isInsurer = await checkRole(contract.INSURER_ROLE(), signer);
            const isMechanic = await checkRole(contract.MECHANIC_ROLE(), signer);

            //Utente normale
            if (!isADMIN && !isManufacturer && !isInsurer && !isMechanic){
                setSigner(signer);
                setContract(contract);

                const vehicle = await getVehicleDetails(contract,carIdForApprove);
                if(vehicle){
                    vehicle.formData.numeroProprietari += 1; // Incrementa il numero di proprietari
                    const newCID = await sendDataToIpfs(vehicle.formData);
                    if(newCID){
                        const tx = await contract.approveTransfer(carIdForApprove, newCID);
                        await tx.wait();
                        toastSuccess('Trasferimento approvato!');
                    }
                }else{
                    toastWarn('Veicolo non trovato!');
                }

            }else{
                toastWarn('User is a special user!');
            }

        } catch (error) {
            console.error("Errore nell'approvazione del trasferimento:", error);
            toastError('Errore nell\'approvazione del trasferimento.');
        }
    };

    return (
        <div>
            <Header/>
            <ToastContainer/>
            <div className="container" style={{
                width: "50%",  // Imposta una larghezza per il div
                margin: "auto", // Lo centra orizzontalmente
                textAlign: "center", // Centra il testo all'interno
                padding: "20px",
                backgroundColor: 'transparent'
            }}>

            <div className="container">
                <h2>Avvia il Passaggio di Proprietà</h2>
                <form onSubmit={onSubmitRequest} className="transfer-form">
                    <label>
                        Car ID:
                        <input
                            type="text"
                            value={carId}
                            onChange={(e) => setCarId(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Indirizzo Nuovo Proprietario:
                        <input
                            type="text"
                            value={newOwner}
                            onChange={(e) => setNewOwner(e.target.value)}
                            required
                        />
                    </label>
                    <button className={"main-button"}  type="submit">Invia Richiesta</button>
                </form>
            </div>

            <div className="container">
                <h2>Inserisci il carId per approvare il trasferimento</h2>
                <form onSubmit={onSubmitApprove} className="transfer-form">
                    <label>
                        Car ID:
                        <input
                            type="text"
                            value={carIdForApprove}
                            onChange={(e) => setCarIdForApprove(e.target.value)}
                            required
                        />
                    </label>

                    <button className={"main-button"} type="submit">Verifica e Firma</button>
                </form>
            </div>
        </div>
</div>
)
    ;
}

export default HomePageUser;
