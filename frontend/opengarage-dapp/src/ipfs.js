import { create } from 'ipfs-http-client';

const ipfs = create({
    host: '2d68-158-47-226-4.ngrok-free.app',  // Cambia con l'indirizzo del tuo nodo
    port: 443,         // Porta dell'API HTTP
    protocol: 'https',   // Usa 'https' se stai usando un nodo remoto
});

export default ipfs;
