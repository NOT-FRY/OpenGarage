import React, { useState, useEffect } from "react";
import './HomePageUser.css';
import Header from "../Header/Header";
import axios from "axios";
import { BrowserProvider, Contract } from "ethers";
import { contractABI, contractAddress } from "../../utils/ContractUtils";
import { useNavigate } from "react-router-dom";
import {checkRole} from "../../utils/Role";
import {getVehicleDetails, sendDataToIpfs} from "../../utils/VehicleUtils";

function HomePageUser() {
    const [carId, setCarId] = useState("");
    const [carIdForApprove, setCarIdForApprove] = useState("");
    const [newOwner, setNewOwner] = useState("");
    const [pendingTransfers, setPendingTransfers] = useState([]);
    const [contract, setContract] = useState(null);
    const [signer, setSigner] = useState(null);

    const navigate = useNavigate();
/*
    useEffect(() => {
        async function initBlockchain() {
            if (!window.ethereum) {
                alert("MetaMask non è installato!");
                return;
            }
            try {
                const provider = new BrowserProvider(window.ethereum);
                await provider.send("eth_requestAccounts", []);
                const signer = await provider.getSigner();

                const isADMIN = await checkRole(contract.DEFAULT_ADMIN_ROLE, signer );
                const isManufacturer = await checkRole(contract.MANUFACTURER_ROLE, signer );
                const isUpdater = await checkRole(contract.UPDATER_ROLE, signer);

                if (!isADMIN && !isManufacturer && !isUpdater){
                    const contract = new Contract(contractAddress, contractABI, signer);
                    setSigner(signer);
                    setContract(contract);
                    fetchPendingTransfers(contract);
                }else{
                    alert("User is a special User");
                    return;
                }



            } catch (error) {
                console.error("Errore durante la connessione alla blockchain:", error);
            }
        }

    }, []);


    // Funzione per ottenere le richieste di trasferimento in sospeso
    const fetchPendingTransfers = async (contract) => {
        if (!contract) return;
        try {
            const vehicleCount = 10; // Numero massimo di veicoli da controllare
            let pending = [];
            for (let i = 0; i < vehicleCount; i++) {
                const vehicle = await contract.vehicles(i.toString());
                if (vehicle.pendingBuyer !== "0x0000000000000000000000000000000000000000") {
                    pending.push({
                        carId: vehicle.carId,
                        currentOwner: vehicle.owner,
                        pendingBuyer: vehicle.pendingBuyer,
                    });
                }
            }
            setPendingTransfers(pending);
        } catch (error) {
            console.error("Errore nel recupero delle richieste:", error);
        }
    }; */



    function generateCarId() {
        return `car-${crypto.randomUUID()}`;
    }


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
            alert("MetaMask non è installato!");
            return;
        }
        try {
            const provider = new BrowserProvider(window.ethereum);
            await provider.send("eth_requestAccounts", []);

            const signer = await provider.getSigner();
            const contract = new Contract(contractAddress, contractABI, signer);

            const isADMIN = await checkRole(contract.DEFAULT_ADMIN_ROLE, signer );
            const isManufacturer = await checkRole(contract.MANUFACTURER_ROLE, signer );
            const isUpdater = await checkRole(contract.UPDATER_ROLE, signer);


            if (!isADMIN && !isManufacturer && !isUpdater){
                setSigner(signer);
                setContract(contract);
                const tx = await contract.requestVehicle(carId, newOwner);
                await tx.wait();
                alert("Richiesta di trasferimento approvata!");
            }else{
                alert("User is a special User");
            }

        } catch (error) {
            console.error("Errore nell'approvazione del trasferimento:", error);
            alert("Errore nell'approvazione. Controlla la console.");
        }
    }

    // Funzione per approvare il trasferimento
    const handleApproveTransfer = async (carId) => {
        if (!window.ethereum) {
            alert("MetaMask non è installato!");
            return;
        }

        try {
            const provider = new BrowserProvider(window.ethereum);
            await provider.send("eth_requestAccounts", []);

            const signer = await provider.getSigner();
            const contract = new Contract(contractAddress, contractABI, signer);

            const isADMIN = await checkRole(contract.DEFAULT_ADMIN_ROLE, signer );
            const isManufacturer = await checkRole(contract.MANUFACTURER_ROLE, signer );
            const isUpdater = await checkRole(contract.UPDATER_ROLE, signer);

            if (!isADMIN && !isManufacturer && !isUpdater){
                setSigner(signer);
                setContract(contract);

                const vehicle = await getVehicleDetails(contract,carIdForApprove);
                if(vehicle){
                    vehicle.formData.numeroProprietari += 1; // Incrementa il numero di proprietari
                    const newCID = await sendDataToIpfs(vehicle.formData);
                    if(newCID){
                        const tx = await contract.approveTransfer(carIdForApprove, newCID);
                        await tx.wait();
                        alert("Trasferimento approvato!");
                    }
                }

            }else{
                alert("User is a special User");
            }

        } catch (error) {
            console.error("Errore nell'approvazione del trasferimento:", error);
            alert("Errore nell'approvazione. Controlla la console.");
        }
    };

    return (
        <div>
            <Header/>
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
                    <button type="submit">Invia Richiesta</button>
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

                    <button type="submit">Verifica e Firma</button>
                </form>
            </div>
        </div>
</div>
)
    ;
}

export default HomePageUser;
