const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("OpenGarage Smart Contract", function () {
  let OpenGarage;
  let openGarage;
  let owner, manufacturer, insurer, vehicleOwner;

  beforeEach(async function () {
    // Ottieni i conti di test
    [owner, manufacturer, insurer, vehicleOwner] = await ethers.getSigners();

    // Deploy del contratto
    openGarage = await ethers.deployContract("OpenGarage");
    //openGarage = await OpenGarage.deploy();
    //await openGarage.deployed();
  });


  it("Registra un veicolo correttamente", async function () {
    // Assegna il ruolo di produttore
    //await openGarage.connect(owner).grantRole(await openGarage.MANUFACTURER_ROLE(), manufacturer.address);

    const vin = "1HGCM82633A123456";
    const cid = "QmTzQ1e9mX9vXJpyBpyTfVyxjN3PdN5aHGiUJ98jWkzDB3";

    // Registra un veicolo
    //await openGarage.connect(manufacturer).registerVehicle(vin, vehicleOwner.address, cid);
    await openGarage.registerVehicle(vin,cid,vehicleOwner.address);

    const vehicle = await openGarage.vehicles(vin);
    expect(vehicle.owner).to.equal(vehicleOwner.address);
    expect(vehicle.cid).to.equal(cid);
    console.log(cid);
  });

//   it("Trasferisce la proprietà di un veicolo", async function () {
//     // Assegna il ruolo di produttore
//     await openGarage.connect(owner).grantRole(await openGarage.MANUFACTURER_ROLE(), manufacturer.address);

//     const vin = "1HGCM82633A123456";
//     const cid = "QmTzQ1e9mX9vXJpyBpyTfVyxjN3PdN5aHGiUJ98jWkzDB3";

//     // Registra un veicolo
//     await openGarage.connect(manufacturer).registerVehicle(vin, vehicleOwner.address, cid);

//     // Trasferisce la proprietà
//     const newOwner = insurer.address;
//     await openGarage.connect(vehicleOwner).transferOwnership(vin, newOwner);

//     const vehicle = await openGarage.vehicles(vin);
//     expect(vehicle.owner).to.equal(newOwner);
//   });

//   it("Assegna i ruoli correttamente", async function () {
//     // Assegna il ruolo di produttore
//     await openGarage.connect(owner).grantRole(await openGarage.MANUFACTURER_ROLE(), manufacturer.address);

//     const hasRole = await openGarage.hasRole(await openGarage.MANUFACTURER_ROLE(), manufacturer.address);
//     expect(hasRole).to.be.true;
//   });

//   it("Restringe operazioni a utenti non autorizzati", async function () {
//     const vin = "1HGCM82633A123456";
//     const cid = "QmTzQ1e9mX9vXJpyBpyTfVyxjN3PdN5aHGiUJ98jWkzDB3";

//     // Prova a registrare un veicolo senza il ruolo MANUFACTURER_ROLE
//     await expect(
//       openGarage.connect(vehicleOwner).registerVehicle(vin, vehicleOwner.address, cid)
//     ).to.be.revertedWith("AccessControl: account");
//   });
});
