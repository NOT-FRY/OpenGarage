import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Header/Header";
import "./manutenzione.css";
import { BrowserProvider, Contract } from "ethers";
import {contractABI, contractAddress} from "../../utils/ContractUtils";
import {checkRole} from "../../utils/Role";
import {getVehicleDetails, sendDataToIpfs} from "../../utils/VehicleUtils";

const MaintenanceForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        carId: "",
        data: "",
        tipoServizio: "",
        costo: "",
        note: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await handleMaintenance();

    };

    const handleMaintenance = async () => {
        if (!window.ethereum) {
            alert("MetaMask non è installato!");
            return;
        }

        try {
            const provider = new BrowserProvider(window.ethereum);
            await provider.send("eth_requestAccounts", []);

            const signer = await provider.getSigner();
            const contract = new Contract(contractAddress, contractABI, signer);

            const isMechanic = await checkRole(contract.MECHANIC_ROLE(), signer);

            if (!isMechanic){
                alert("L'utente non è un meccanico");
                return;
            }

            const vehicle = await getVehicleDetails(contract,formData.carId);
            if(vehicle){
                const updatedVehicle = {
                    ...vehicle.formData,
                    manutenzioni: [
                        ...(vehicle.formData.manutenzioni || []),
                        {
                            data: formData.data,
                            tipoServizio: formData.tipoServizio,
                            costo: formData.costo,
                            note: formData.note,
                        }
                    ]
                };
                const newCID = await sendDataToIpfs(updatedVehicle);
                if(newCID){
                    const tx = await contract.updateVehicle(formData.carId, newCID);
                    await tx.wait();
                    alert("Manutenzione inserita con successo");
                }
            }

        } catch (error) {
            console.error("Errore nella modifica della manutenzione", error);
            alert("Errore nella modifica della manutenzione.");
        }
    };

    return (
        <div className="maintenance-form-container">
            <Header/>
            <h1>Registra Manutenzione Veicolo</h1>
            <form onSubmit={handleSubmit} className="maintenance-form">
                <div className="form-group">
                    <label>ID Veicolo:</label>
                    <input type="text" name="carId" value={formData.carId} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Data Manutenzione:</label>
                    <input type="date" name="data" value={formData.data} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Tipo di Intervento:</label>
                    <input type="text" name="tipoServizio" value={formData.tipoServizio} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Costo (€):</label>
                    <input type="number" name="costo" value={formData.costo} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Note Aggiuntive:</label>
                    <textarea name="notes" value={formData.note} onChange={handleChange}></textarea>
                </div>

                <button type="submit">Registra Manutenzione</button>
            </form>
        </div>
    );
};

export default MaintenanceForm;
