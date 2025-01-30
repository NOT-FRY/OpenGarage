import React, { useState} from "react";
import './Form.css'
import Header from "../Header/Header";
import axios from "axios"
import {BrowserProvider, Contract, JsonRpcSigner} from "ethers";
import {contractABI, contractAddress} from "../../utils/ContractUtils";
import {checkRole} from "../../utils/Role";

function CarForm(){
    const [formData, setFormData] = useState({
        idVeicolo: '',
        numeroTarga: '',
        marca: '',
        modello: '',
        annoProduzione: '',
        posti: '',
        numeroPorte: '',
        tipoCarburante: '',
        numeroKm: '',
        dimensioni: ''
    });

    const [owner, setOwner] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const sendDataToIpfs = async () => {
        try{
            const responseIPFS = await axios.post("http://localhost:3001/ipfs/upload", {formData})
            let cid = responseIPFS.data;
            console.log(cid)

            const carId = generateCarId();
            await registerVehicle(carId, cid);

        }catch (errorData){
            alert("errore nel caricamento dei dati");
            console.log(JSON.stringify(errorData))
        }
    }

    function generateCarId() {
        return `car-${crypto.randomUUID()}`;
    }

    async function registerVehicle(carId, cid) {
        if (!window.ethereum) {
            alert("MetaMask non è installato!");
            return;
        }

        try {
            const provider = new BrowserProvider(window.ethereum);
            await provider.send("eth_requestAccounts", []);

            const signer = await provider.getSigner();
            const contract = new Contract(contractAddress, contractABI, signer);

            const address = signer.getAddress();
            const isManufacturer = await checkRole(contract.MANUFACTURER_ROLE(), address);
            if(!isManufacturer){
                alert("User is not a manufacturer");
                return;
            }
            console.log("Sto registrando veicolo su blockchain...", carId, cid);
            const tx = await contract.registerVehicle(carId,cid, owner);
            await tx.wait();
            console.log("Veicolo registrato con successo su blockchain!", tx);

            //TODO da rimuovere
            const vehicle = await contract.vehicles(carId);
            console.log("Dettagli veicolo su blockchain:", vehicle);
        } catch (error) {
            console.error("Errore durante la registrazione del veicolo su blockchain:", error);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        alert("ciao");
        sendDataToIpfs().then(r=>{
            console.log('Dati inviati:', formData);
        })


    };

    return (
        <div>
            <Header/>
            <form onSubmit={handleSubmit} className={"form"}>
                <div className="form-title">Inserisci Veicolo</div>
                <div className="form-group">
                    <label htmlFor="numeroTarga">Numero di targa:</label>
                    <input
                        type="text"
                        id="numeroTarga"
                        name="numeroTarga"
                        value={formData.numeroTarga}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="marca">Marca:</label>
                    <input
                        type="text"
                        id="marca"
                        name="marca"
                        value={formData.marca}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="modello">Modello:</label>
                    <input
                        type="text"
                        id="modello"
                        name="modello"
                        value={formData.modello}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="annoProduzione">Anno di Produzione:</label>
                    <input
                        type="text"
                        id="annoProduzione"
                        name="annoProduzione"
                        value={formData.annoProduzione}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="posti">Numero Posti:</label>
                    <input
                        type="text"
                        id="posti"
                        name="posti"
                        value={formData.posti}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="numeroPorte">Numero di porte:</label>
                    <input
                        type="text"
                        id="numeroPorte"
                        name="numeroPorte"
                        value={formData.numeroPorte}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="tipoCarburante">Tipo di Carburante:</label>
                    <input
                        type="text"
                        id="tipoCarburante"
                        name="tipoCarburante"
                        value={formData.tipoCarburante}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="numeroKm">Numero di Km:</label>
                    <input
                        type="text"
                        id="numeroKm"
                        name="numeroKm"
                        value={formData.numeroKm}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="dimensioni">Dimensioni del Veicolo:</label>
                    <input
                        type="text"
                        id="dimensioni"
                        name="dimensioni"
                        value={formData.dimensioni}
                        onChange={handleChange}
                    />
                </div>
                <button type={"submit"}></button>
            </form>


            <form className={"form"}>
                <div className="form-title">Inserisci Veicolo</div>
                <div className="form-group">
                    <label htmlFor="Indirizzo proprietario">Indirizzo Proprietario:</label>
                    <input
                        type="text"
                        id="numeroTarga"
                        name="numeroTarga"
                        value={owner}
                        onChange={(e)=>{
                            setOwner(e.target.value);
                        }}
                    />
                </div>
            </form>

        </div>
    )
}

export default CarForm;