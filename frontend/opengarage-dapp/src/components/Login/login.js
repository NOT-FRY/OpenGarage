import React, {useState} from "react";
import Header from "../Header/Header";
import {BrowserProvider, Contract} from "ethers";
import {assignRole, checkRole, Roles} from "../../utils/Role";
import {useNavigate} from "react-router-dom";
import {contractABI, contractAddress} from "../../utils/ContractUtils";
import {JsonRpcSigner} from "ethers";
import background from '../../images/Opera_senza_titolo.png';
import Alert from 'react-bootstrap/Alert';



export default function LoginPage(contract, signer) {
    const navigate = useNavigate();
    const [errorAlert, setErrorAlert] = useState(false);

// Funzione per connettere MetaMask
    async function connectWallet() {
        if (!window.ethereum) {
            setErrorAlert(true);
        }

        try {
            const accounts = await window.ethereum.request({method: "eth_requestAccounts"});
            console.log("Account connesso:", accounts[0]);


            const address = signer.getAddress()

            const isAdmin = await checkRole(contract.DEFAULT_ADMIN_ROLE(), address);

            if(isAdmin){
                navigate('/assignRole');
            }else{
                console.log("verifico ruolo...");
                const isManufacturer = await checkRole(contract.MANUFACTURER_ROLE(), address);
                if(isManufacturer){
                    navigate('/registerVehicle');
                }else{
                    const isMechanic = await checkRole(contract.MECHANIC_ROLE(), address);
                    if(isMechanic){
                        navigate('/maintenance');
                    }else{
                        const isInsurer = await checkRole(contract.INSURER_ROLE(), address);
                        if(isInsurer)
                            navigate('/insurance');
                        else
                            navigate('/homePageUser');
                    }
                }
            }

        } catch (error) {
            console.error("Errore durante la connessione:", error);
        }
    }

    return (
        <div>

            <Header/>
            {errorAlert && (<Alert key='warning' variant='warning'>
                This is a alert—check it out!
            </Alert>)}
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            width: '100%',
            backgroundColor: '#f9e4d1', // Aggiunge uno sfondo leggero per contrasto
        }}>


            {/* Contenitore con bordo */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '45%', // Larghezza della card
                height: '50vh', // Altezza della card

                borderRadius: '12px', // Angoli arrotondati
                boxShadow: '4px 4px 10px rgba(0, 0, 0, 0.2)', // Ombra leggera
                backgroundColor: '#fff', // Sfondo bianco per contrasto
                overflow: 'hidden', // Evita overflow
            }}>
                {/* Sfondo sulla sinistra */}
                <div style={{
                    flex: 1,
                    height: '100%',
                    backgroundImage: `url(${background})`,
                    backgroundSize: 'cover', // Usa 'cover' per riempire senza distorsioni
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'left'
                }}></div>

                {/* Contenuto sulla destra */}
                <div style={{
                    display: 'flex',
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px'
                }}>

                    <div className="button-container">
                        <h2 style={{color:'black'}}>Login to OpenGarage</h2>
                        <button
                            style={{
                                padding: '10px 20px',
                                fontSize: '16px',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                transition: '0.3s'
                            }}
                            onClick={connectWallet}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#E95D2C'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#A63E1B'}
                        >
                            Connetti a MetaMask
                        </button>
                    </div>
                </div>
            </div>
        </div>
        </div>

    )
}

