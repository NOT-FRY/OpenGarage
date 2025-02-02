const express = require('express');
const  {create}  = require('ipfs-http-client');
const ipfsRouter = express.Router();

// Configura IPFS

const ipfs = create({
    host: 'hungry-liger-90.telebit.io',  // Cambia con l'indirizzo del tuo nodo
    port: 443,         // Porta dell'API HTTP
    protocol: 'https',   // Usa 'https' se stai usando un nodo remoto
});

// Carica un file su IPFS
ipfsRouter.post('/upload', async (req, res) => {
    console.log("DATI ",req.body);
    const formData = req.body;

    if ((formData.formData.annoProduzione !== '') &&
        (formData.formData.dimensioni !== '') &&
        (formData.formData.marca !== '') &&
        (formData.formData.numeroKm !== '') &&
        (formData.formData.modello !== '') &&
        (formData.formData.numeroPorte !== '') &&
        (formData.formData.numeroTarga !== '') &&
        (formData.formData.posti !== '') &&
        (formData.formData.tipoCarburante !== ''))
    {

        try {
            const json = JSON.stringify(formData, null, 2);
            const result = await ipfs.add(json);
            console.log('File caricato su IPFS. CID:', result.cid.toString());
            res.status(200).send(result.cid.toString());
        } catch (error) {
            res.status(500).send("Errore nel caricamento del file su IPFS");
            console.log(error);
        }
    }
    else {
        res.status(422).send("Parametri errati");
    }
});
ipfsRouter.get('/getVehicle', async (req, res) => {
    const cid = req.query.cid;
    console.log("CID richiesta:",cid);
    const formData = req.body;
    if(cid){
        try {
            const stream = ipfs.cat(cid); // Recupera il contenuto dal CID
            let data = "";
            for await (const chunk of stream) {
                data += new TextDecoder().decode(chunk);
            }
            console.log("Dati recuperati:", data);
            res.status(200).send(data);
        } catch (error) {
            res.status(500).send("Errore nel recupero del file dall'IPFS");
            console.log(error);
        }
    }
    else {
        res.status(422).send("Parametri errati");
    }
});

module.exports = ipfsRouter;
