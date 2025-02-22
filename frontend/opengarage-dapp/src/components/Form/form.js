import React, { useState} from "react";
import './Form.css'
import Header from "../Header/Header";
import axios from "axios"
import {BrowserProvider, Contract, JsonRpcSigner} from "ethers";
import {contractABI, contractAddress} from "../../utils/ContractUtils";
import {checkRole} from "../../utils/Role";
import {useNavigate} from "react-router-dom";
import {sendDataToIpfs} from "../../utils/VehicleUtils";
import {toast, ToastContainer} from "react-toastify";
import {toastError, toastSuccess, toastWarn} from "../../utils/Toast";
import {Box, Button} from "@mui/material";

function CarForm(){
    const navigate = useNavigate();

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
        dimensioni: '',
        numeroProprietari: 1,
    });

    const [owner, setOwner] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    function generateCarId() {
        return `car-${crypto.randomUUID()}`;
    }

    async function registerVehicle(carId, cid) {
        if (!window.ethereum) {
            toastError('Attenzione, Metamask non è installato!');
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
                toastWarn('L\'Utente non è un produttore!');
                return;
            }
            console.log("Sto registrando veicolo su blockchain...", carId, cid);
            const tx = await contract.registerVehicle(carId,cid, owner);
            await tx.wait();
            toastSuccess(`Veicolo registrato con successo su blockchain! carID: ${carId}`);

            await new Promise(r => setTimeout(r, 5000));
            navigate('/vehicleDetails');
        } catch (error) {
            console.error("Errore durante la registrazione del veicolo su blockchain:", error);
            toastError('Errore durante la registrazione del veicolo su blockchain:');
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const cid = await sendDataToIpfs(formData);
        console.log('Dati inviati:', formData);
        if(cid){
            const carId = generateCarId();
            await registerVehicle(carId, cid);
        }else{
            console.log("Errore nel recupero del CID");
        }


    };

    return (
        <div>
            <ToastContainer/>
            <form className={"form"}>
                <div className="form-title">Indirizzo Proprietario</div>
                <div className="form-group">
                    <label htmlFor="Indirizzo proprietario">Indirizzo Proprietario:</label>
                    <input
                        type="text"
                        id="numeroTarga"
                        name="numeroTarga"
                        value={owner}
                        onChange={(e) => {
                            setOwner(e.target.value);
                        }}
                    />
                </div>
            </form>

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
                <Box display='flex' justifyContent={'center'}>
                <Button type={'submit'} variant="contained" size={'large'} sx={{
                    backgroundColor: "#A63E1B"

                }}>Conferma</Button>
                </Box>
            </form>


        </div>
    )
}

export default CarForm;