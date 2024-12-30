//SPDX-License-Identifier: UNLICENSED

// Solidity files have to start with this pragma.
// It will be used by the Solidity compiler to validate its version.
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "hardhat/console.sol";

contract OpenGarage is AccessControl {
    // Definizione dei ruoli
    bytes32 public constant MANUFACTURER_ROLE = keccak256("MANUFACTURER_ROLE");
    bytes32 public constant UPDATER_ROLE = keccak256("UPDATER_ROLE");

    // Struttura per rappresentare un veicolo
    struct Vehicle {
        string carId; // Identificatore del veicolo sulla DApp
        string cid; // Content Identifier per IPFS
    }

    constructor(){
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);//Di Open zeppelin, può gestire tutti i ruoli
    }

    // Mappatura id -> Veicolo
    mapping(string => Vehicle) public vehicles;

    // Eventi per tracciamento
    event VehicleRegistered(string carId, string cid);
    event OwnershipTransferred(string carId, address oldOwner, address newOwner);
    event VehicleUpdated(string carId,string oldCID,string newCID);

    // Funzione per assegnare un ruolo
    function assignRole(bytes32 role, address account) public onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(role, account);
    }

    // Funzione per rimuovere un ruolo
    function deleteRole(bytes32 role, address account) public onlyRole(DEFAULT_ADMIN_ROLE) {
        revokeRole(role, account);
    }

    // Funzione per registrare un nuovo veicolo (solo per produttori)
    function registerVehicle(string memory carId, string memory cid) public onlyRole(MANUFACTURER_ROLE){
        require(bytes(vehicles[carId].carId).length == 0, "Veicolo gia' registrato");
        vehicles[carId] = Vehicle(carId, cid);
        emit VehicleRegistered(carId, cid);
    }

    // Funzione per aggiornare un veicolo (solo per meccanici/assicuratori), viene aggiornato il CID 
    function updateVehicle(string memory carId, string memory newCID) public onlyRole(UPDATER_ROLE){
        require(bytes(vehicles[carId].carId).length != 0, "Veicolo non trovato");
        Vehicle storage vehicle = vehicles[carId];
        string memory oldCID = vehicle.cid;
        vehicle.cid = newCID;
        emit VehicleUpdated(carId, oldCID, newCID);
    }

    // Funzione per trasferire la proprietà (solo per proprietari)
    // function transferOwnership(string memory carId, address newOwner) public {
    //     Vehicle storage vehicle = vehicles[carId];
    //     require(vehicle.owner == msg.sender, "Non sei il proprietario del veicolo");
    //     address oldOwner = vehicle.owner;
    //     vehicle.owner = newOwner;
    //     emit OwnershipTransferred(carId, oldOwner, newOwner);
    // }

    // Funzione per verificare il proprietario attuale di un veicolo
    // function getOwner(string memory carId) public view returns (address) {
    //     require(bytes(vehicles[carId].carId).length != 0, "Veicolo non trovato");
    //     return vehicles[carId].owner;
    // }

    // Funzione per recuperare il CID di un veicolo
    function getCidByCarId(string memory carId) public view returns (string memory){
        require(bytes(vehicles[carId].carId).length != 0, "Veicolo non trovato");
        return vehicles[carId].cid;
    }
}
