import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FileUploader from "./FileUploader";
import App from "./App";
const RoutesConfig = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/fileUploader" element={<FileUploader />} />
            </Routes>
        </Router>
    );
};

export default RoutesConfig;
