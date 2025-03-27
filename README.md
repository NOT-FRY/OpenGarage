# OpenGarage

## Autori
- Alfonso Califano
- Rachele Capuano
- Francesco Di Lauro
## Descrizione del Progetto

**OpenGarage** è una **DApp** progettata per memorizzare e gestire informazioni relative ai veicoli, con l'obiettivo di rendere più sicura e affidabile la loro compravendita. Grazie alla blockchain, ogni operazione viene registrata in modo trasparente e immutabile.


### Funzionamento

- 🚗 **Inserimento dei Veicoli:**  
  I produttori di automobili o concessionari possono registrare i veicoli sulla piattaforma, inserendo dettagli come **numero di targa, produttore, modello, numero di posti, dimensioni**, ecc. Inoltre, devono specificare l'**indirizzo Ethereum del primo proprietario**.

- ⚠️ **Gestione dei Sinistri:**  
  Gli **Enti Assicurativi**, accreditati sulla piattaforma, possono registrare informazioni relative ai sinistri, tra cui **data, luogo dell’incidente e una breve descrizione**.

- 🛠️ **Registrazione delle Manutenzioni:**  
  I **Meccanici**, anch'essi accreditati, possono aggiungere dati sulle manutenzioni effettuate, specificando **data, tipo di intervento e note aggiuntive**.

- 🔍 **Consultazione dei Dati:**  
  I potenziali acquirenti possono visualizzare le informazioni di un veicolo tramite un identificativo univoco, chiamato **CarID**, fornito dal venditore.

- 🔄 **Passaggio di Proprietà:**  
  I proprietari possono trasferire il veicolo a un nuovo acquirente inserendo il suo **indirizzo Ethereum**. Il numero di precedenti proprietari viene aggiornato, offrendo un'ulteriore metrica utile per valutare l'acquisto, insieme allo storico di sinistri e manutenzioni.

## Tecnologie Utilizzate


- ![Solidity](https://img.shields.io/badge/Solidity-363636?logo=solidity&logoColor=white) Per la scrittura dello smart contract che gestisce le registrazioni e le verifiche dei dati.
- ![Hardhat](https://img.shields.io/badge/Hardhat-FFD700?logo=ethereum&logoColor=black) Per lo sviluppo, il testing e il deployment dello smart contract.
- ![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black) Per lo sviluppo dell’interfaccia utente.
- ![Express.js](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white) Per il backend, che si occupa della della comunicazione con IPFS.
- ![IPFS](https://img.shields.io/badge/IPFS-65C2CB?logo=ipfs&logoColor=white) Per archiviare i dati in maniera decentralizzata, evitando di sovraccaricare la blockchain.

La validazione delle transazioni avviene tramite **Metamask**, un'estensione per browser che permette di interagire con la DApp.

## Istruzioni per l'avvio

```bash
git clone https://github.com/NOT-FRY/OpenGarage.git
cd OpenGarage
./OpenGarage.sh
```
N.B. è necessario configurare almeno un nodo IPFS per il corretto funzionamento della DApp.
