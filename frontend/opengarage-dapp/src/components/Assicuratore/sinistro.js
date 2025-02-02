import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./sinistro.css";
import {BrowserProvider, Contract} from "ethers";
import {contractABI, contractAddress} from "../../utils/ContractUtils";
import {checkRole} from "../../utils/Role";
import {getVehicleDetails, sendDataToIpfs} from "../../utils/VehicleUtils";


const InsuranceForm = () => {
    const [formData, setFormData] = useState({
        carId: "",
        data: "",
        descrizione: "",
        luogo: "",
        costoDanno: "",
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await handleInsurance();
    };

    const handleInsurance = async () => {
        if (!window.ethereum) {
            alert("MetaMask non è installato!");
            return;
        }

        try {
            const provider = new BrowserProvider(window.ethereum);
            await provider.send("eth_requestAccounts", []);

            const signer = await provider.getSigner();
            const contract = new Contract(contractAddress, contractABI, signer);

            const isInsurer = await checkRole(contract.INSURER_ROLE(), signer);

            if (!isInsurer){
                alert("L'utente non è un assicuratore");
                return;
            }

            const vehicle = await getVehicleDetails(contract,formData.carId);
            if(vehicle){
                const updatedVehicle = {
                    ...vehicle.formData,
                    sinistri: [
                        ...(vehicle.formData.sinistri || []),
                        {
                            data: formData.data,
                            descrizione: formData.descrizione,
                            luogo: formData.luogo,
                            costoDanno: formData.costoDanno,
                        }
                    ]
                };
                const newCID = await sendDataToIpfs(updatedVehicle);
                if(newCID){
                    const tx = await contract.updateVehicle(formData.carId, newCID);
                    await tx.wait();
                    alert("Sinistro inserito con successo");
                }
            }

        } catch (error) {
            console.error("Errore nella modifica della manutenzione", error);
            alert("Errore nella modifica della manutenzione.");
        }
    };

    return (
        <div className="insurance-form-container">
            <h2>Registra un Sinistro Stradale</h2>
            <form onSubmit={handleSubmit} className="insurance-form">
                <label>CarID del veicolo coinvolto:</label>
                <input type="text" name="carId" value={formData.carId} onChange={handleChange} required/>

                <label>Data dell'incidente:</label>
                <input type="date" name="data" value={formData.data} onChange={handleChange} required/>

                <label>Luogo dell'incidente:</label>
                <input type="text" name="luogo" value={formData.luogo} onChange={handleChange} required/>

                <label>Descrizione dell'incidente:</label>
                <textarea name="descrizione" value={formData.descrizione} onChange={handleChange} required></textarea>

                <label>Costo stimato del danno (€):</label>
                <input type="number" name="costoDanno" value={formData.costoDanno} onChange={handleChange} required/>

                <button type="submit">Registra Sinistro</button>
            </form>
        </div>
    );
};

export default InsuranceForm;
