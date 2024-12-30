import React, { useState} from "react";
import './Form.css'
import ipfs from "../../ipfs";

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if ((formData.annoProduzione !== '') &&
        (formData.dimensioni !== '') &&
        (formData.marca !== '') &&
        (formData.numeroKm !== '') &&
        (formData.modello !== '') &&
        (formData.numeroPorte !== '') &&
        (formData.numeroTarga !== '') &&
        (formData.posti !== '') &&
        (formData.tipoCarburante !== ''))
        {

            try {
                const json = JSON.stringify(formData, null, 2);
                const result = await ipfs.add(json);
                console.log('File caricato su IPFS. CID:', result.cid.toString());
            } catch (error) {
                console.error('Errore durante il caricamento su IPFS:', error);
            }
        }
        else {
            alert("Valorizza tutti i campi");
        }


    };

    return (
        <form onSubmit={handleSubmit} className={"form"}>
            <div className="form-group">
                <label htmlFor="numeroTarga">numero targa:</label>
                <input
                    type="text"
                    id="numeroTarga"
                    name="numeroTarga"
                    value={formData.numeroTarga}
                    onChange={handleChange}
                />
            </div>
            <div className="form-group">
                <label htmlFor="marca">marca:</label>
                <input
                    type="text"
                    id="marca"
                    name="marca"
                    value={formData.marca}
                    onChange={handleChange}
                />
            </div>
            <div className="form-group">
                <label htmlFor="modello">modello:</label>
                <input
                    type="text"
                    id="modello"
                    name="modello"
                    value={formData.modello}
                    onChange={handleChange}
                />
            </div>
            <div className="form-group">
                <label htmlFor="annoProduzione">anno di produzione:</label>
                <input
                    type="text"
                    id="annoProduzione"
                    name="annoProduzione"
                    value={formData.annoProduzione}
                    onChange={handleChange}
                />
            </div>
            <div className="form-group">
                <label htmlFor="posti">posti:</label>
                <input
                    type="text"
                    id="posti"
                    name="posti"
                    value={formData.posti}
                    onChange={handleChange}
                />
            </div>
            <div className="form-group">
                <label htmlFor="numeroPorte">numero di porte:</label>
                <input
                    type="text"
                    id="numeroPorte"
                    name="numeroPorte"
                    value={formData.numeroPorte}
                    onChange={handleChange}
                />
            </div>
            <div className="form-group">
                <label htmlFor="tipoCarburante">tipo carburante:</label>
                <input
                    type="text"
                    id="tipoCarburante"
                    name="tipoCarburante"
                    value={formData.tipoCarburante}
                    onChange={handleChange}
                />
            </div>
            <div className="form-group">
                <label htmlFor="numeroKm">numero Km:</label>
                <input
                    type="text"
                    id="numeroKm"
                    name="numeroKm"
                    value={formData.numeroKm}
                    onChange={handleChange}
                />
            </div>
            <div className="form-group">
                <label htmlFor="dimensioni">dimensioni:</label>
                <input
                    type="text"
                    id="dimensioni"
                    name="dimensioni"
                    value={formData.dimensioni}
                    onChange={handleChange}
                />
            </div>
            <button type="submit">Salva</button>
        </form>
    )
}

export default CarForm;