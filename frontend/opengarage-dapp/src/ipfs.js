import { create } from 'ipfs-http-client';

const ipfs = create({
    host: 'localhost',  // Cambia con l'indirizzo del tuo nodo
    port: 5001,         // Porta dell'API HTTP
    protocol: 'http',   // Usa 'https' se stai usando un nodo remoto
});

export default ipfs;
