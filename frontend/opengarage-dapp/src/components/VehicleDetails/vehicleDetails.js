import React, { useState } from "react";
import axios from "axios";
import CarForm from "../Form/form";
import {BrowserProvider, Contract} from "ethers";
import {contractABI, contractAddress} from "../../utils/ContractUtils";
import {checkRole} from "../../utils/Role";
import {useNavigate} from "react-router-dom";
 const VehicleDetails = ({ contract }) => {
     const [carId, setCarId] = useState("");
     const [vehicle, setVehicle] = useState(null);
     const [loading, setLoading] = useState(false);


     async function getVehicleDetails() {
         try {
             setLoading(true);
             console.log("carID:",carId);
             const cid = await getVehicleCID(carId);
             const requestURL = "http://localhost:3001/ipfs/getVehicle?cid=" + cid;
             const responseIPFS = await axios.get(requestURL);
             if (responseIPFS.status === 200) {
                 console.log("Dati ricevuti dal backend:", responseIPFS.data);
                 setVehicle(responseIPFS.data.formData); // Aggiorna lo state con i dati ricevuti
             } else {
                 console.log("Errore nel server backend:", responseIPFS);
             }

         } catch (error) {
             console.error("Errore durante il recupero dei dettagli del veicolo:", error);
         } finally {
            setLoading(false);
         }
     };

     async function getVehicleCID(carId){
         if (!window.ethereum) {
             alert("MetaMask non è installato!");
             return;
         }

         try {
             const provider = new BrowserProvider(window.ethereum);
             await provider.send("eth_requestAccounts", []);

             const signer = await provider.getSigner();
             const contract = new Contract(contractAddress, contractABI, signer);

             const vehicle = await contract.vehicles(carId);
             console.log("Dettagli veicolo da blockchain:", vehicle);
             return vehicle.cid;
         } catch (error) {
             console.error("Errore durante il recupero del cid dalla blockchain:", error);
         }
         return null;
     }
     return (
         <div className="container">
            <h2>Dettagli Veicolo</h2>
            <div className="input-section">
                <input
                    type="text"
                    placeholder="Inserisci carId"
                    value={carId}
                    onChange={(e) => setCarId(e.target.value)}
                />
                <button onClick={getVehicleDetails} disable={loading}>
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
                 </div>
             )}

         </div>
     )
 }

export default VehicleDetails;


