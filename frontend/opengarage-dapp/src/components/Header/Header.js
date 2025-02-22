import React, {useState} from "react";
import "./Header.css";
import {useNavigate} from "react-router-dom";
import logo from './../../images/logo.png'
import {Button} from "@mui/material";
import {checkRole} from "../../utils/Role";
import * as signer from "ethers";
import {toastError} from "../../utils/Toast";


const Header = () => {

    const navigate = useNavigate();
    const [errorAlert, setErrorAlert] = useState(false);
    const [loggedUser, setLoggedUser] = useState(false);

    async function connectWallet() {
        if (!window.ethereum) {
            toastError("Attenzione, Metamask non è installato!");
        }

        try {
            const accounts = await window.ethereum.request({method: "eth_requestAccounts"});
            console.log("Account connesso:", accounts[0]);
            navigate('/vehicleDetails');



        } catch (error) {
            console.error("Errore durante la connessione:", error);
        }
    }


    return (
        <header className="header">
            <div style={{display: 'flex'}}>
                <img src={logo} width={'5%'} height={'5%'} alt={''}/>
                <div style={{
                    width: '100%',
                    alignContent: 'center',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <h1>Open Garage</h1>
                </div>
                <div style={{
                    alignContent: 'center',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <Button onClick={connectWallet} variant="outlined" sx={{
                        borderColor: "#A63E1B",
                        color: 'white'
                    }}>Ricerca veicolo</Button>
                </div>
            </div>

        </header>
    );
};

export default Header;
