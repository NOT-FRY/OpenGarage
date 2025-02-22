import {Box, Dialog} from "@mui/material";
import React from "react";





export default function ApproveTransfer(props) {

    const { onClose, open, carId, handleCarId, onSubmit} = props;

    return (
        <Dialog open={open} onClose={onClose}>

            <Box
                sx={{
                    width: "100%", // Larghezza del blocco (puoi modificarlo)
                    maxWidth: "400px", // Imposta un limite massimo per evitare eccessiva espansione
                    padding: 4,
                    textAlign: "center",
                    backgroundColor: "#1A2730",
                    boxShadow: 6,
                    borderRadius: 1,
                }}
            >
                <h2>Inserisci il carId per approvare il trasferimento</h2>
                <form onSubmit={onSubmit} className="transfer-form">
                    <label>
                        Car ID:
                        <input
                            type="text"
                            value={carId}
                            onChange={(e) => handleCarId(e.target.value)}
                            required
                        />
                    </label>

                    <button className={"main-button"} type={'submit'}>Verifica e Firma</button>
                </form>
            </Box>
        </Dialog>
    );

}

