//SPDX-License-Identifier: UNLICENSED

// Solidity files have to start with this pragma.
// It will be used by the Solidity compiler to validate its version.
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "hardhat/console.sol";

contract OpenGarage is AccessControl {
    // Definizione dei ruoli
    bytes32 public constant MANUFACTURER_ROLE = keccak256("MANUFACTURER_ROLE");
    bytes32 public constant INSURER_ROLE = keccak256("INSURER_ROLE");
    bytes32 public constant OWNER_ROLE = keccak256("OWNER_ROLE");

    // Struttura per rappresentare un veicolo
    struct Vehicle {
        string carId; // Vehicle Identification Number
        address owner;
        string cid; // Content Identifier per IPFS
    }

    // Mappatura id -> Veicolo
    mapping(string => Vehicle) public vehicles;

    // Eventi per tracciamento
    event RoleAssigned(address indexed user, bytes32 role);
    event VehicleRegistered(string carId, address owner, string cid);
    event OwnershipTransferred(string carId, address oldOwner, address newOwner);

    // Funzione per registrarsi con un ruolo
    function registerAsRole(bytes32 role) public {
        require(
            role == MANUFACTURER_ROLE || role == INSURER_ROLE || role == OWNER_ROLE,
            "Ruolo non valido"
        );
        require(!hasRole(role, msg.sender), "Hai gia' questo ruolo");
        _grantRole(role, msg.sender);
        emit RoleAssigned(msg.sender, role);
    }

    // Funzione per registrare un nuovo veicolo (solo per produttori) TODO ruolo
    function registerVehicle(string memory carId, string memory cid, address owner) public /*onlyRole(MANUFACTURER_ROLE)*/ {
        require(bytes(vehicles[carId].carId).length == 0, "Veicolo gia' registrato");
        vehicles[carId] = Vehicle(carId, owner, cid);
        emit VehicleRegistered(carId, owner, cid);
    }

    // Funzione per trasferire la proprietà (solo per proprietari)
    function transferOwnership(string memory carId, address newOwner) public {
        Vehicle storage vehicle = vehicles[carId];
        require(vehicle.owner == msg.sender, "Non sei il proprietario del veicolo");
        address oldOwner = vehicle.owner;
        vehicle.owner = newOwner;
        emit OwnershipTransferred(carId, oldOwner, newOwner);
    }

    // Funzione per verificare il proprietario attuale di un veicolo
    function getOwner(string memory carId) public view returns (address) {
        require(bytes(vehicles[carId].carId).length != 0, "Veicolo non trovato");
        return vehicles[carId].owner;
    }
}
