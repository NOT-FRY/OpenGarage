import {BrowserProvider, Contract} from "ethers";
import {contractABI, contractAddress} from "./ContractUtils";

/*Non ci sono le enum in JS, vado a mappare con stringhe poi al momento della chiamata
 al metodo dello smart contract, vado ad ottenere il ruolo corretto direttamente dal contratto*/
export const Roles = {
    DEFAULT_ADMIN_ROLE: "DEFAULT_ADMIN_ROLE",
    MANUFACTURER_ROLE: "MANUFACTURER_ROLE",
    UPDATER_ROLE: "UPDATER_ROLE"
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
        alert("Ruolo assegnato con successo!");
    } catch (error) {
        console.error("Errore l'assegnazione del ruolo:", error);
    }
}