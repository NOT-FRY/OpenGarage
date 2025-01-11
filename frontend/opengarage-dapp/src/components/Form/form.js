import React, { useState} from "react";
import './Form.css'
import Header from "../Header/Header";
import axios from "axios"

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
            alert(responseIPFS.data);
        }catch (errorData){
            alert("errore nel caricamento dei dati");
            console.log(JSON.stringify(errorData))
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
            <Header />
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
        </div>
    )
}

export default CarForm;