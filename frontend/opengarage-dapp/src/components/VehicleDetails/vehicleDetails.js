import React, { useState } from "react";
import axios from "axios";
import CarForm from "../Form/form";
import {BrowserProvider, Contract} from "ethers";
import {contractABI, contractAddress} from "../../utils/ContractUtils";
import {checkRole} from "../../utils/Role";
import {useNavigate} from "react-router-dom";
import Header from "../Header/Header";
import "./vehicleDetails.css";
import {getVehicleDetails} from "../../utils/VehicleUtils";
import {Box} from "@mui/material";
import {toast, ToastContainer} from "react-toastify";
import {toastError, toastWarn} from "../../utils/Toast";

const VehicleDetails = ({ contract }) => {
    const [carId, setCarId] = useState("");
    const [vehicle, setVehicle] = useState(null);
    const [loading, setLoading] = useState(false);

    async function getVehicle() {
        try {
            setLoading(true);
            if (!window.ethereum) {
                toastError('Attenzione, Metamask non è installato!');
                return;
            }

            const provider = new BrowserProvider(window.ethereum);
            await provider.send("eth_requestAccounts", []);

            const signer = await provider.getSigner();
            const contract = new Contract(contractAddress, contractABI, signer);

            const data = await getVehicleDetails(contract, carId);

            if(!data){
                toastWarn('Veicolo non trovato!');
                return;
            }
            setVehicle(data.formData);

        } catch (error) {
            console.error("Errore durante il recupero dei dettagli del veicolo:", error);
        } finally {
            setLoading(false);
        }
    };


     return (
         <Box sx={{
             height: '100vh'
         }}
         alignContent={'center'}
         >
         <div className="container">
             <ToastContainer />
            <h2>Dettagli Veicolo</h2>
            <div className="input-section">
                <input
                    type="text"
                    placeholder="Inserisci carId"
                    value={carId}
                    onChange={(e) => setCarId(e.target.value)}
                />
                <button onClick={getVehicle} disable={loading}>
                    {loading ? "Caricamento..." : "Cerca Veicolo"}
                </button>
            </div>
             {vehicle && (
                 <div className="vehicle-details">
                     <h3>Informazioni Veicolo</h3>
                     <p><strong>ID:</strong> {carId}</p>
                     <p><strong>Numero targa:</strong> {vehicle.numeroTarga || "N/A"}</p>
                     <p><strong>Marca:</strong> {vehicle.marca || "N/A"}</p>
                     <p><strong>Modello:</strong> {vehicle.modello || "N/A"}</p>
                     <p><strong>Anno di produzione :</strong> {vehicle.annoProduzione || "N/A"}</p>
                     <p><strong>Posti:</strong> {vehicle.posti || "N/A"}</p>
                     <p><strong>Numero Porte:</strong> {vehicle.numeroPorte || "N/A"}</p>
                     <p><strong>Tipo carburante:</strong> {vehicle.tipoCarburante || "N/A"}</p>
                     <p><strong>Numero km:</strong> {vehicle.numeroKm || "N/A"}</p>
                     <p><strong>dimensioni:</strong> {vehicle.dimensioni || "N/A"}</p>
                     <p><strong>Numero proprietari:</strong> {vehicle.numeroProprietari || 0 }</p>

                     {vehicle.manutenzioni && vehicle.manutenzioni.length > 0 ? (
                         <div className="maintenance-history">
                             <h3>Storico Manutenzioni</h3>
                             <ul>
                                 {vehicle.manutenzioni.map((manutenzione, index) => (
                                     <li key={index}>
                                         <p><strong>Data:</strong> {manutenzione.data}</p>
                                         <p><strong>Tipo di intervento:</strong> {manutenzione.tipoServizio}</p>
                                         <p><strong>Costo:</strong> {manutenzione.costo}€</p>
                                         <p><strong>Note:</strong> {manutenzione.note || "Nessuna"}</p>
                                     </li>
                                 ))}
                             </ul>
                         </div>
                     ) : (
                         <p><strong>Storico Manutenzioni:</strong> Nessuna manutenzione registrata</p>
                     )}

                     {vehicle.sinistri && vehicle.sinistri.length > 0 ? (
                         <div className="maintenance-history">
                             <h3>Storico Sinistri</h3>
                             <ul>
                                 {vehicle.sinistri.map((sinistro, index) => (
                                     <li key={index}>
                                         <p><strong>Data:</strong> {sinistro.data}</p>
                                         <p><strong>Descrizione:</strong> {sinistro.descrizione}</p>
                                         <p><strong>Luogo:</strong> {sinistro.luogo}</p>
                                         <p><strong>Danno:</strong> {sinistro.costoDanno}€</p>
                                     </li>
                                 ))}
                             </ul>
                         </div>
                     ) : (
                         <p><strong>Storico Sinistri:</strong> Nessun sinistro registrato</p>
                     )}

                 </div>
             )}

         </div>
         </Box>
     )
 }

export default VehicleDetails;


