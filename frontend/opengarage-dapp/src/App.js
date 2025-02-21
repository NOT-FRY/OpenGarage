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
        toast.error('Attenzione, Metamask non è installato!', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });
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

    return (
        LoginPage(contractState,signerState)
    );
}

export default App;
