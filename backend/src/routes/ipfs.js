const express = require('express');
const { create } = require('ipfs-http-client');
const router = express.Router();

// Configura IPFS
const ipfs = create({
    host: '2d68-158-47-226-4.ngrok-free.app',  // Cambia con l'indirizzo del tuo nodo
    port: 443,         // Porta dell'API HTTP
    protocol: 'https',   // Usa 'https' se stai usando un nodo remoto
});

// Carica un file su IPFS
router.post('/upload', async (req, res) => {

    const formData = req.body;

    if ((formData.annoProduzione !== '') &&
        (formData.dimensioni !== '') &&
        (formData.marca !== '') &&
        (formData.numeroKm !== '') &&
        (formData.modello !== '') &&
        (formData.numeroPorte !== '') &&
        (formData.numeroTarga !== '') &&
        (formData.posti !== '') &&
        (formData.tipoCarburante !== ''))
    {

        try {
            const json = JSON.stringify(formData, null, 2);
            const result = await ipfs.add(json);
            console.log('File caricato su IPFS. CID:', result.cid.toString());
            res.status(200).send('File caricato su IPFS. CID:', result.cid.toString());
        } catch (error) {
            res.status(500).send("Errore nel caricamento del file su IPFS");
        }
    }
    else {
        res.status(422).send("Parametri errati");
    }
});

module.exports = router;
