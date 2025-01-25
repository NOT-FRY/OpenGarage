// Importa ethers.js
import { BrowserProvider, Contract } from "ethers";
import FileUploader from "./components/FileUploader/FileUploader";
import { useNavigate } from 'react-router-dom'
import "./App.css";
import LoginPage from "./components/Login/login"

// Configurazione del contratto
const contractAddress = require('./contracts/OpenGarage-address.json').OpenGarageAddress;
const contractABI = require('./contracts/OpenGarage.json').abi;

/*Non ci sono le enum in JS, vado a mappare con stringhe poi al momento della chiamata
 al metodo dello smart contract, vado ad ottenere il ruolo corretto direttamente dal contratto*/
const Roles = {
	DEFAULT_ADMIN_ROLE: "DEFAULT_ADMIN_ROLE",
	MANUFACTURER_ROLE: "MANUFACTURER_ROLE",
	UPDATER_ROLE: "UPDATER_ROLE"
}

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
async function registerVehicle(carId, cid) {
    if (!window.ethereum) {
        alert("MetaMask non è installato!");
        return;
    }

    const provider = new BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);

    const signer = await provider.getSigner();
    const contract = new Contract(contractAddress, contractABI, signer);

    try {

        const address = signer.getAddress()
        const isManufacturer = await checkRole(contract.MANUFACTURER_ROLE(), address);
        if(!isManufacturer){
            alert("User is not a manufacturer");
            return;
        }

        const tx = await contract.registerVehicle(carId,cid);
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

async function assignRole(role, address) {
    if (!window.ethereum) {
        alert("MetaMask non è installato!");
        return;
    }

    const provider = new BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);

    const signer = await provider.getSigner();
    const contract = new Contract(contractAddress, contractABI, signer);

    try {

        const adminAddress = signer.getAddress()
        const isAdmin = await checkRole(contract.DEFAULT_ADMIN_ROLE(), adminAddress);
        if(!isAdmin){
            alert("User is not an Administrator");
            console.log("L'utente non è amministratore:",adminAddress);
            return;
        }
        let contractRole;
        switch(role){
            case Roles.MANUFACTURER_ROLE:
                contractRole = contract.MANUFACTURER_ROLE();
                break;
            case Roles.UPDATER_ROLE:
                contractRole = contract.UPDATER_ROLE();
                break;
        }

        const tx = await contract.assignRole(contractRole,address);
        await tx.wait();
        console.log("Ruolo assegnato con successo all'indirizzo ", address);
    } catch (error) {
        console.error("Errore l'assegnazione del ruolo:", error);
    }
}

async function checkRole(role,address) {
    if (!window.ethereum || !address) {
        return false;
    }

    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new Contract(contractAddress, contractABI, signer);

    try {
        return await contract.hasRole(role, address);
    } catch (error) {
        console.error("Errore durante la verifica del ruolo: ", error);
        return false;
    }
}

// Integrazione con il frontend
function App() {
    const navigate = useNavigate();

    //routes
    const handleRedirect = () => {
        navigate('/fileUploader'); // Sostituisci "/destination" con la tua rotta
    };

    const handleRegisterVehicle = () => {
        navigate('/registerVehicle'); // Sostituisci "/destination" con la tua rotta
    };

    const handleRegister = async () => {
        const carId = prompt("Inserisci il carId del veicolo:");
        const cid = prompt("Inserisci il CID (IPFS) del veicolo:");
        await registerVehicle(carId, cid);
    };

    const handleGetDetails = async () => {
        const carId = prompt("Inserisci il carId del veicolo:");
        const vehicle = await getVehicleDetails(carId);
        alert(`Dettagli veicolo: carId: ${vehicle.carId}, CID: ${vehicle.cid}`);
    };

    const handleAssignRole = async () => {
        const address = prompt("Inserisci l'indirizzo dell'utente:");
        //TODO per adesso assegno di default manufacturer
        await assignRole(Roles.MANUFACTURER_ROLE, address);
    };

    return (
        <div>
            < LoginPage />
        </div>
    );
}

export default App;
