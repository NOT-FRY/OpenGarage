import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./InsuranceForm.css";


const InsuranceForm = () => {
    const [formData, setFormData] = useState({
        carId1: "",
        carId2: "",
        data: "",
        descrizione: "",
        luogo: "",
        costoDanno: "",
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        //salva su ipfs


    };

    return (
        <div className="insurance-form-container">
            <h2>Registra un Sinistro Stradale</h2>
            <form onSubmit={handleSubmit} className="insurance-form">
                <label>ID dei veicoli coinvolti:</label>
                <label>Veicolo 1:</label>
                <input type="text" name="carId1" value={formData.carId1} onChange={handleChange} required/>

                <label>Veicolo 2:</label>
                <input type="text" name="carId2" value={formData.carId2} onChange={handleChange} required/>

                <label>Data dell'incidente:</label>
                <input type="date" name="data" value={formData.data} onChange={handleChange} required/>

                <label>Luogo dell'incidente:</label>
                <input type="text" name="luogo" value={formData.luogo} onChange={handleChange} required/>

                <label>Descrizione dell'incidente:</label>
                <textarea name="descrizione" value={formData.descrizione} onChange={handleChange} required></textarea>

                <label>Costo stimato del danno (€):</label>
                <input type="number" name="costoDanno" value={formData.costoDanno} onChange={handleChange} required/>

                <button type="submit">Registra Sinistro</button>
            </form>
        </div>
    );
};

export default InsuranceForm;
