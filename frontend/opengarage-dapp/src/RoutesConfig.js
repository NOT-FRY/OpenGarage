import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from "./App";
import CarForm from "./components/Form/form"
import VehicleDetails from "./components/VehicleDetails/vehicleDetails"
import HomePageUser from "./components/HomePageUser/homePageUser"
import MaintenanceForm from "./components/Meccanico/manutenzione";
import InsuranceForm from "./components/Assicuratore/sinistro";
import Amministratore from "./components/Amministratore/amministratore";

const RoutesConfig = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/registerVehicle" element={<CarForm />} />
                <Route path="/vehicleDetails" element={<VehicleDetails />} />
                <Route path="/homePageUser" element={<HomePageUser />} />
                <Route path="/maintenance" element={<MaintenanceForm />} />
                <Route path="/insurance" element={<InsuranceForm />} />
                <Route path="/assignRole" element={<Amministratore />} />
            </Routes>
        </Router>
    );
};

export default RoutesConfig;
