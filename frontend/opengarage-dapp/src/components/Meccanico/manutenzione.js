import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MaintenanceForm.css";

const MaintenanceForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        carId: "",
        data: "",
        tipoServizio: "",
        costo: "",
        note: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        //salva su ipfs

    };

    return (
        <div className="maintenance-form-container">
            <h1>Registra Manutenzione Veicolo</h1>
            <form onSubmit={handleSubmit} className="maintenance-form">
                <div className="form-group">
                    <label>ID Veicolo:</label>
                    <input type="text" name="carId" value={formData.carId} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Data Manutenzione:</label>
                    <input type="date" name="data" value={formData.data} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Tipo di Intervento:</label>
                    <input type="text" name="tipoServizio" value={formData.tipoServizio} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Costo (€):</label>
                    <input type="number" name="costo" value={formData.costo} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Note Aggiuntive:</label>
                    <textarea name="notes" value={formData.note} onChange={handleChange}></textarea>
                </div>

                <button type="submit">Registra Manutenzione</button>
            </form>
        </div>
    );
};

export default MaintenanceForm;
