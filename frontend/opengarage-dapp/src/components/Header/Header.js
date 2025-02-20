import React from "react";
import "./Header.css";
import {useNavigate} from "react-router-dom";
import logo from './../../images/logo.png'

const Header = () => {

    const navigate = useNavigate();

    return (
        <header className="header">
            <div style={{display:'flex'}}>
            <img src={logo} width={'5%'} height={'5%'} alt={''}/>
                <div style={{width:'100%', alignContent: 'center', alignItems: 'center', justifyContent: 'space-between'}}>
            <h1>Open Garage</h1>
                </div>
            </div>
        </header>
    );
};

export default Header;
