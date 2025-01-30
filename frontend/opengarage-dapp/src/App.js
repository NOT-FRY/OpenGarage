// Importa ethers.js
import {BrowserProvider, Contract, JsonRpcSigner} from "ethers";
import {useNavigate} from 'react-router-dom'
import "./App.css";
import LoginPage from "./components/Login/login"
import {contractABI, contractAddress} from "./utils/ContractUtils";
import {useEffect, useState} from "react";


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

async function initBlockchain() {
    try {
        const provider = new BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);

        const signer = await provider.getSigner();
        const contract = new Contract(contractAddress, contractABI, signer);

        return {
            provider: provider,
            contract: contract,
            signer: signer,
        };
    } catch (error) {
        console.error("Errore durante l'inizializzazione della blockchain:", error);
        return null; // Restituisci null in caso di errore
    }
}


// Funzione per registrare un veicolo
/*
async function registerVehicle(carId, cid) {
    if (!window.ethereum) {
        alert("MetaMask non è installato!");
        return;
    }



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


    try {
        const vehicle = await contract.vehicles(carId);
        console.log("Dettagli veicolo:", vehicle);
        return vehicle;
    } catch (error) {
        console.error("Errore durante il recupero dei dettagli del veicolo:", error);
    }
}

*/

// Integrazione con il frontend
function App() {

    const [providerState, setProvideState] = useState();
    const [signerState, setSignerState] = useState();
    const [contractState, setContractState] = useState();

    useEffect(() => {
        if (window.ethereum) {
            initBlockchain().then((item) => {
                if (item) {
                    setContractState(item.contract);
                    setSignerState(item.signer);
                    setProvideState(item.provider);
                } else {
                    console.error("Impossibile inizializzare la blockchain. Controlla MetaMask o il contratto.");
                }
            });
        }
    }, []);


    const navigate = useNavigate();
/*
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
    }; */

    return (
        LoginPage(contractState,signerState)
    );
}

export default App;
