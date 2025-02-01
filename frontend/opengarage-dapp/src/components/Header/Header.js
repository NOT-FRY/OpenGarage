import React from "react";
import "./Header.css";
import {useNavigate} from "react-router-dom";

const Header = () => {

    const navigate = useNavigate();

    return (
        <header className="header">
            <h1>Open Garage</h1>

        </header>
    );
};

export default Header;
