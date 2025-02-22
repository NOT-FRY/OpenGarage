import React, {useEffect, useState} from "react";

import Header from "../Header/Header";
import {assignRole, checkRole, Roles} from "../../utils/Role";
import {
    Box,
    Button, Chip,
    CircularProgress,
    Container, FormControl,
    InputLabel, MenuItem,
    Paper,
    Select,
    TextField,
    Typography
} from "@mui/material";
import {toast, ToastContainer} from "react-toastify";
import {toastError} from "../../utils/Toast";

function Amministratore() {
    const [selectedOption, setSelectedOption] = useState(Roles.MANUFACTURER_ROLE);
    const [userAddress, setUserAddress] = useState("");


    function onValueChange(event) {
        setSelectedOption(event.target.value);
    }

    function onAddressChange(event) {
        setUserAddress(event.target.value);
    }

    async function formSubmit(event) {
        event.preventDefault();

        if (!userAddress.trim()) {
            toastError('Inserisci un indirizzo valido.');
            return;
        }
        await assignRole(selectedOption, userAddress);
    }

    return (

        <div>
            <ToastContainer />
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="100vh"
                width="100%"
            >
                <Box
                    sx={{
                        width: "50%", // Larghezza del blocco (puoi modificarlo)
                        maxWidth: "400px", // Imposta un limite massimo per evitare eccessiva espansione
                        padding: 4,
                        textAlign: "center",
                        backgroundColor: "#1A2730",
                        boxShadow: 3,
                        borderRadius: 2,
                    }}
                >
                    <Typography variant="h5" gutterBottom fontFamily={'sans-serif'} fontWeight={'bold'} sx={{
                        color: 'white'
                    }}>
                        Benvenuto Admin!
                    </Typography>

                    <Typography variant="h6" fontFamily={'sans-serif'}  gutterBottom sx={{
                        color: 'white'
                    }}>
                       Inserisci l'indirizzo dell'utente per assegnare un ruolo
                    </Typography>

                    <form onSubmit={formSubmit}>
                        <FormControl fullWidth>
                    <TextField
                        onChange={onAddressChange}
                        id="outlined-basic"
                        label="Indirizzo Utente"
                        size="medium"
                        variant="outlined"
                        sx={{
                            paddingBottom: 3,
                            "& .MuiOutlinedInput-input": {
                                backgroundColor: "white",
                            },
                            // Cambia colore della label quando il campo è attivo
                            "& .MuiInputLabel-root": {
                            },
                            "& .MuiInputLabel-root.MuiFormLabel-filled": {
                                color: "#A63E1B", // Colore della label quando il campo è riempito
                                paddingTop: 1
                            },
                            "& .MuiInputLabel-root.Mui-focused": {
                                color: "#A63E1B", // Cambia colore quando è attivo
                                paddingTop: 1
                            },
                            // Cambia colore del bordo quando il campo è attivo
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                    borderColor: "gray", // Colore predefinito del bordo
                                },
                                "&:hover fieldset": {
                                    borderColor: "#A63E1B", // Colore quando passi sopra con il mouse
                                },
                                "&.Mui-focused fieldset": {
                                    borderColor: "#A63E1B", // Colore quando è attivo
                                    borderWidth: "3px", // Bordo più spesso per enfatizzare l'attivazione
                                },
                            },
                        }}
                    />
                        </FormControl>
                        <FormControl fullWidth sx={{
                            paddingBottom: 3
                        }}>
                            <InputLabel
                                id="demo-simple-select-label"
                                sx={{
                                    color: "#A63E1B", // Label color
                                    paddingTop: 1,
                                    "&.Mui-focused": {
                                        color: "#A63E1B", // Label color when focused
                                    },
                                }}
                            >
                                Role
                            </InputLabel>
                            <Select
                                value={selectedOption}
                                label="Ruolo"
                                onChange={onValueChange}
                                variant="outlined"
                                size='medium'
                                sx={{
                                    '& .MuiSelect-outlined':{
                                        backgroundColor: "white", // Sfondo bianco
                                    },

                                    "& .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "gray", // Bordo standard
                                    },
                                    "&:hover .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "#A63E1B", // Bordo in hover
                                    },
                                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "#A63E1B", // Bordo quando attivo
                                        borderWidth: "3px",
                                    },
                                }}
                            >
                                <MenuItem value={'MANUFACTURER_ROLE'}>MANUFACTURER_ROLE</MenuItem>
                                <MenuItem value={'MECHANIC_ROLE'}>MECHANIC_ROLE</MenuItem>
                                <MenuItem value={'INSURER_ROLE'}>INSURER_ROLE</MenuItem>
                            </Select>
                        </FormControl>
                        <Button type={'submit'} variant="contained" size={'large'} sx={{
                            backgroundColor: "#A63E1B"
                        }}>Conferma</Button>
                    </form>
                </Box>
            </Box>
        </div>
    );
}

export default Amministratore;
