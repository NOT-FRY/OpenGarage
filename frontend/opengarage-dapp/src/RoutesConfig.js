import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FileUploader from "./components/FileUploader/FileUploader";
import App from "./App";
import CarForm from "./components/Form/form"
import VehicleDetails from "./components/VehicleDetails/vehicleDetails"
import HomePageUser from "./components/HomePageUser/homePageUser"

const RoutesConfig = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/fileUploader" element={<FileUploader />} />
                <Route path="/registerVehicle" element={<CarForm />} />
                <Route path="/vehicleDetails" element={<VehicleDetails />} />
                <Route path="/homePageUser" element={<HomePageUser />} />
            </Routes>
        </Router>
    );
};

export default RoutesConfig;
