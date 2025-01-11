import React, { useState } from 'react';
import ipfs from '../../ipfs'; // Importa il client IPFS configurato
import './FileUploader.css';
import Header from '../Header/Header.js';


const FileUploader = () => {
    const [file, setFile] = useState(null); // Stato per il file selezionato
    const [cid, setCid] = useState('');    // Stato per il CID del file caricato

    // Funzione per gestire la selezione del file
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    // Funzione per caricare il file su IPFS
    const uploadToIPFS = async () => {
        if (!file) {
            alert('Seleziona un file prima di caricare.');
            return;
        }

        try {
            const fileData = new Blob([file]);
            const result = await ipfs.add(fileData);
            setCid(result.cid.toString()); // Salva il CID nel componente
            console.log('File caricato su IPFS. CID:', result.cid.toString());
        } catch (error) {
            console.error('Errore durante il caricamento su IPFS:', error);
        }
    };

    return (
        <>
            <Header />
            <div className="file-uploader">
                <div className="container">
                    <h1>Carica un file su IPFS</h1>
                    <input type="file" onChange={handleFileChange} />
                    <button onClick={uploadToIPFS}>Carica</button>

                    {cid && (
                        <div className="cid-container">
                            <p>File caricato con successo!</p>
                            <p>
                                CID: <a href={`https://ipfs.io/ipfs/${cid}`} target="_blank" rel="noopener noreferrer">{cid}</a>
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default FileUploader;
