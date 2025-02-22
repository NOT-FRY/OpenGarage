import React, { useState, useEffect } from "react";
import './HomePageUser.css';
import Header from "../Header/Header";
import axios from "axios";
import { BrowserProvider, Contract } from "ethers";
import { contractABI, contractAddress } from "../../utils/ContractUtils";
import { useNavigate } from "react-router-dom";
import {checkRole} from "../../utils/Role";
import {getVehicleDetails, sendDataToIpfs} from "../../utils/VehicleUtils";
import {toast, ToastContainer} from "react-toastify";
import {toastError, toastSuccess, toastWarn} from "../../utils/Toast";
import {Box, Button, Typography} from "@mui/material";
import RequestTransfer from "./RequestTransfer";
import {ChangeEvent} from "react";
import ApproveTransfer from "./ApproveTransfer";

function HomePageUser() {
    const [carId, setCarId] = useState("");
    const [carIdForApprove, setCarIdForApprove] = useState("");
    const [newOwner, setNewOwner] = useState("");
    const [pendingTransfers, setPendingTransfers] = useState([]);
    const [contract, setContract] = useState(null);
    const [signer, setSigner] = useState(null);
    const [openDialogRequest, setOpenDialogRequest] = useState(false);
    const [openDialogApprove, setOpenDialogApprove] = useState(false);


    const navigate = useNavigate();

    const handleDialogRequestOpen = () =>{
        setOpenDialogRequest(true);
    }

    const handleDialogRequestClose = () =>{
        setOpenDialogRequest(false);
    }

    const handleCarId = (value : string) => {
        setCarId(value)
    }

    const handleNewOwner = (value : string) => {
        setNewOwner(value);
    }

    const handleDialogApproveOpen = () =>{
        setOpenDialogApprove(true);
    }

    const handleDialogApproveClose = () =>{
        setOpenDialogApprove(false);
    }

    const handleCarIdForApprove = (value : string) => {
        setCarIdForApprove(value);
    }

    const onSubmitRequest = (e) =>{
        e.preventDefault();
        handleTransferRequest().then(r=>{
            console.log("richiesta ok");
        })
    }

    const onSubmitApprove =  (e) =>{
        e.preventDefault();
       handleApproveTransfer().then(r=>{
            console.log("richiesta ok");
        })
    }

    const handleTransferRequest = async () => {
        if (!window.ethereum) {
            toastError('Attenzione, Metamask non è installato!');
            return;
        }
        try {
            const provider = new BrowserProvider(window.ethereum);
            await provider.send("eth_requestAccounts", []);

            const signer = await provider.getSigner();
            const contract = new Contract(contractAddress, contractABI, signer);

            const isADMIN = await checkRole(contract.DEFAULT_ADMIN_ROLE(), signer );
            const isManufacturer = await checkRole(contract.MANUFACTURER_ROLE(), signer );
            const isInsurer = await checkRole(contract.INSURER_ROLE(), signer);
            const isMechanic = await checkRole(contract.MECHANIC_ROLE(), signer);

            //Utente normale
            if (!isADMIN && !isManufacturer && !isInsurer && !isMechanic){
                setSigner(signer);
                setContract(contract);
                const tx = await contract.requestVehicle(carId, newOwner);
                await tx.wait();
                toastSuccess('Richiesta di trasferimento eseguita!');
            }else{
                toastWarn('User is a special User!');
            }

        } catch (error) {
            console.error("Errore nella richiesta del trasferimento:", error);
            toastError('Errore nella richiesta di trasferimento.');
        }
    }

    // Funzione per approvare il trasferimento
    const handleApproveTransfer = async (carId) => {
        if (!window.ethereum) {
            toastError('Attenzione, Metamask non è installato!');
            return;
        }

        try {
            const provider = new BrowserProvider(window.ethereum);
            await provider.send("eth_requestAccounts", []);

            const signer = await provider.getSigner();
            const contract = new Contract(contractAddress, contractABI, signer);

            const isADMIN = await checkRole(contract.DEFAULT_ADMIN_ROLE(), signer );
            const isManufacturer = await checkRole(contract.MANUFACTURER_ROLE(), signer );
            const isInsurer = await checkRole(contract.INSURER_ROLE(), signer);
            const isMechanic = await checkRole(contract.MECHANIC_ROLE(), signer);

            //Utente normale
            if (!isADMIN && !isManufacturer && !isInsurer && !isMechanic){
                setSigner(signer);
                setContract(contract);

                const vehicle = await getVehicleDetails(contract,carIdForApprove);
                if(vehicle){
                    vehicle.formData.numeroProprietari += 1; // Incrementa il numero di proprietari
                    const newCID = await sendDataToIpfs(vehicle.formData);
                    if(newCID){
                        const tx = await contract.approveTransfer(carIdForApprove, newCID);
                        await tx.wait();
                        toastSuccess('Trasferimento approvato!');
                    }
                }else{
                    toastWarn('Veicolo non trovato!');
                }

            }else{
                toastWarn('User is a special user!');
            }

        } catch (error) {
            console.error("Errore nell'approvazione del trasferimento:", error);
            toastError('Errore nell\'approvazione del trasferimento.');
        }
    };

    return (
        <Box sx={{
            width: '100%',
            height: '100vh'
        }} alignContent={'center'}>
            {openDialogRequest &&
                <RequestTransfer handleCarId={handleCarId} handleNewOwner={handleNewOwner} open={openDialogRequest}
                                 carId={carId} newOwner={newOwner} onSubmit={onSubmitRequest}
                                 onClose={handleDialogRequestClose}/>
            }
            {openDialogApprove &&
                <ApproveTransfer handleCarId={handleCarIdForApprove} open={openDialogApprove} carId={carIdForApprove}
                                 onSubmit={onSubmitApprove} onClose={handleDialogApproveClose}/>
            }
            <Box display={'flex'} justifyContent={'center'}>
                <Typography variant="h5" gutterBottom fontFamily={'sans-serif'} fontWeight={'bold'} sx={{
                    color: 'black'
                }}>
                    Passaggio di proprietà
                </Typography>
            </Box>
            <Box display={'flex'} justifyContent={'center'}>
                <Button variant="contained" onClick={handleDialogRequestOpen} sx={{
                    borderColor: '#A63E1B',
                    backgroundColor: '#A63E1B',
                    marginRight: '30px',
                }}>
                    Avvia Nuovo
                </Button>

                <Button variant="contained" onClick={handleDialogApproveOpen} sx={{
                    borderColor: '#A63E1B',
                    backgroundColor: '#A63E1B'
                }}>
                    Approva Passaggio
                </Button>

            </Box>


            <ToastContainer/>

        </Box>
    )
        ;
}

export default HomePageUser;
