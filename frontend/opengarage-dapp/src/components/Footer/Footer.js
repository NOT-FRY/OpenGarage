import {Box} from "@mui/material";
import logo from "../../images/logo.png";
import React from "react";


export default function Footer() {
    return(
        <Box sx={{
            width: '100%',
            height:'100%',
            backgroundColor: "#1A2730",
            color:"#B0CEE2",
        }}
             alignContent={'center'}
        >
            <Box justifyContent={'center'} alignItems={'center'} display={'flex'} sx={{paddingTop: 2}}>
                <img src={logo} width={'5%'} height={'5%'} alt={''}/>
            </Box>
            <Box justifyContent={'center'} alignItems={'center'} display={'flex'}>
                <h6>Progetto Universitario</h6>
            </Box>

        </Box>
    )
}