import axios from "axios";

export async function getVehicleDetails(contract,carId) {
    try {
        console.log("carID richiesto:",carId);
        const cid = await getVehicleCID(contract,carId);
        if(!cid){
            console.log("CID non trovato su blockchain");
            return;
        }
        const requestURL = `http://localhost:3001/ipfs/getVehicle?cid=${cid}`;
        const responseIPFS = await axios.get(requestURL);
        if (responseIPFS.status === 200) {
            console.log("Dati ricevuti dal backend:", responseIPFS.data);
            return responseIPFS.data;
        } else {
            console.log("Errore nel server backend:", responseIPFS);
        }


    } catch (error) {
        console.error("Errore durante il recupero dei dettagli del veicolo:", error);
    }
    return null;
};

export async function getVehicleCID(contract,carId){
    if (!window.ethereum) {
        alert("MetaMask non è installato!");
        return;
    }
    try {
        const vehicle = await contract.vehicles(carId);
        console.log("Dettagli veicolo da blockchain:", vehicle);
        return vehicle.cid;
    } catch (error) {
        console.error("Errore durante il recupero del cid dalla blockchain:", error);
    }
    return null;
}

export async function sendDataToIpfs (formData) {

    try{
        const responseIPFS = await axios.post("http://localhost:3001/ipfs/upload", {formData})
        let cid = responseIPFS.data;
        console.log("cid:",cid)
        return cid;

    }catch (errorData){
        alert("errore nel caricamento dei dati");
        console.log(JSON.stringify(errorData))
    }

}