// Importa ethers.js
import { BrowserProvider, Contract } from "ethers";
import FileUploader from "./FileUploader";
import {useNavigate} from 'react-router-dom'

// Configurazione del contratto
const contractAddress = require('./contracts/OpenGarage-address.json').OpenGarageAddress;
const contractABI = require('./contracts/OpenGarage.json').abi;

// Funzione per connettere MetaMask
async function connectWallet() {
    if (!window.ethereum) {
        alert("MetaMask non è installato!");
        return;
    }

    try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        console.log("Account connesso:", accounts[0]);
        return accounts[0];
    } catch (error) {
        console.error("Errore durante la connessione:", error);
    }
}

// Funzione per registrare un veicolo
async function registerVehicle(carId, cid, ownerAddress) {
    if (!window.ethereum) {
        alert("MetaMask non è installato!");
        return;
    }

    const provider = new BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);

    const signer = await provider.getSigner();
    const contract = new Contract(contractAddress, contractABI, signer);

    try {
        const tx = await contract.registerVehicle(carId,cid,ownerAddress);
        await tx.wait();
        console.log("Veicolo registrato con successo!", tx);
    } catch (error) {
        console.error("Errore durante la registrazione del veicolo:", error);
    }
}

// Funzione per ottenere i dettagli di un veicolo
async function getVehicleDetails(carId) {
    if (!window.ethereum) {
        alert("MetaMask non è installato!");
        return;
    }

    const provider = new BrowserProvider(window.ethereum);
    const contract = new Contract(contractAddress, contractABI, provider);

    try {
        const vehicle = await contract.vehicles(carId);
        console.log("Dettagli veicolo:", vehicle);
        return vehicle;
    } catch (error) {
        console.error("Errore durante il recupero dei dettagli del veicolo:", error);
    }
}



// Integrazione con il frontend
function App() {
    const navigate = useNavigate();

    const handleRedirect = () => {
        navigate('/fileUploader'); // Sostituisci "/destination" con la tua rotta
    };

    const handleRegister = async () => {
        const carId = prompt("Inserisci il carId del veicolo:");
        const owner = prompt("Inserisci l'indirizzo del proprietario:");
        const cid = prompt("Inserisci il CID (IPFS) del veicolo:");
        await registerVehicle(carId, cid, owner);
    };

    const handleGetDetails = async () => {
        const carId = prompt("Inserisci il carId del veicolo:");
        const vehicle = await getVehicleDetails(carId);
        alert(`Dettagli veicolo: carId: ${vehicle.carId}, Owner: ${vehicle.owner}, CID: ${vehicle.cid}`);
    };

    return (
        <div>
            <button onClick={connectWallet}>Connetti MetaMask</button>
            <button onClick={handleRegister}>Registra Veicolo</button>
            <button onClick={handleGetDetails}>Recupera Dettagli Veicolo</button>
            <button onClick={handleRedirect}>Recupera Dettagli Veicolo</button>
        </div>
    );
}

export default App;
