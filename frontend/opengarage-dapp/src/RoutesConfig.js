import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FileUploader from "./FileUploader";
import App from "./App";
import CarForm from "./components/Form/form"

const RoutesConfig = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/fileUploader" element={<FileUploader />} />
                <Route path="/registerVehicle" element={<CarForm />} />
            </Routes>
        </Router>
    );
};

export default RoutesConfig;
