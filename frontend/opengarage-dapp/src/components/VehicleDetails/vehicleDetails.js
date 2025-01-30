import React, { useState } from "react";
 const VehicleDetails = ({ contract }) => {
     const [carId, setCarId] = useState("");
     const [vehicle, setVehicle] = useState(null);
     const [loading, setLoading] = useState(false);


     async function getVehicleDetails(carId) {
         if (!window.ethereum) {
             alert("MetaMask non è installato!");
             return;
         }

         if (!carId) {
             alert("Inserisci l'ID del veicolo");
             return;
         }

         setLoading(true);

         try {
             const vehicle = await contract.vehicles(carId);
             console.log("Dettagli veicolo:", vehicle);
             return vehicle;
         } catch (error) {
             console.error("Errore durante il recupero dei dettagli del veicolo:", error);
         }
     };
     return (
         <div className="container">
            <h2>Dettagli Veicolo</h2>
            <div className="input-section">
                <input
                    type="text"
                    placeholder="Inserisci Id veicolo"
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


