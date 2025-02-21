import {BrowserProvider, Contract} from "ethers";
import {contractABI, contractAddress} from "./ContractUtils";
import {toast} from "react-toastify";
import {toastError, toastSuccess, toastWarn} from "./Toast";

/*Non ci sono le enum in JS, vado a mappare con stringhe poi al momento della chiamata
 al metodo dello smart contract, vado ad ottenere il ruolo corretto direttamente dal contratto*/
export const Roles = {
    DEFAULT_ADMIN_ROLE: "DEFAULT_ADMIN_ROLE",
    MANUFACTURER_ROLE: "MANUFACTURER_ROLE",
    INSURER_ROLE: "INSURER_ROLE",
    MECHANIC_ROLE: "MECHANIC_ROLE"
}

export async function checkRole(role,address) {
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

export async function assignRole(role, address) {
    if (!window.ethereum) {
        toastError('Attenzione, Metamask non è installato!');
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
            toastWarn('L\' Utente non è amministratore!');
            console.log("L'utente non è amministratore:",adminAddress);
            return;
        }
        let contractRole;
        switch(role){
            case Roles.MANUFACTURER_ROLE:
                contractRole = contract.MANUFACTURER_ROLE();
                break;
            case Roles.INSURER_ROLE:
                contractRole = contract.INSURER_ROLE();
                break;
            case Roles.MECHANIC_ROLE:
                contractRole = contract.MECHANIC_ROLE();
                break;
            default:
                console.error("Ruolo non valido");
                break;
        }

        const tx = await contract.assignRole(contractRole,address);
        await tx.wait();
        toastSuccess(`Ruolo "${role}" assegnato con successo a: ${address}`);
    } catch (error) {
        console.error("Errore con l'assegnazione del ruolo:", error);
        toastError('Errore con l\'assegnazione del ruolo');
    }
}