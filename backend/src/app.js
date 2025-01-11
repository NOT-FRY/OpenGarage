const express = require('express');
const app = express();
const cors = require('cors');

app.get('/', (req, res) => {
    res.send('hello root node');// this gets executed when you visit http://localhost:3000/
})
// Include route files
    const ipfs = require('./routes/ipfsRouter');
const corsOptions = {
    origin: 'http://localhost:3000', // Cambia se il tuo frontend è su un altro dominio
    methods: ['GET', 'POST'],  // Puoi aggiungere altri metodi se necessario
    allowedHeaders: ['Content-Type', 'Authorization'], // Header permessi
};

// Usa CORS con le opzioni definite
app.use(cors(corsOptions));
app.use(express.json()); // Necessario per analizzare JSON nel corpo della richiesta

// Use routes
    app.use('/ipfs', ipfs);

    const port = process.env.PORT || 3001;

    app.listen(port, () => {
        console.log('Server is running on port: ',port);
    });