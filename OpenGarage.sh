#!/bin/sh

set -e # ogni comando che fallisce causerà l'interruzione del resto dello script
echo "Starting OpenGarage..."

echo  "Installing hardhat dependencies..."
npm install

npx kill-port 8545 3000 3001

echo "Compiling smart contract..."
npx hardhat compile

echo "Starting Hardhat node..."
npx hardhat node &

# Attendi che la rete sia attiva
sleep 5

echo "Deploying contract..."
npx hardhat run scripts/deploy.js --network localhost

cd backend
echo "Installing backend dependencies..."
npm install
echo "Starting backend..."
npm start &

cd ../frontend/opengarage-dapp
echo "Installing frontend dependencies..."
npm install

echo "Starting frontend..."
npm start