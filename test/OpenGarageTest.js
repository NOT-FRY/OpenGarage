const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("OpenGarage Smart Contract", function () {
  let OpenGarage, openGarage, admin, manufacturer, updater, user;

  beforeEach(async function () {

    [admin, manufacturer, updater, user] = await ethers.getSigners();
    // Deploy del contratto
    openGarage = await ethers.deployContract("OpenGarage");

  });

  it("Should deploy the contract and set the admin", async function () {
    const isAdmin = await openGarage.hasRole(await openGarage.DEFAULT_ADMIN_ROLE(), admin.address);
    expect(isAdmin).to.be.true;
  });

  it("Should allow admin to assign roles", async function () {
    const MANUFACTURER_ROLE = await openGarage.MANUFACTURER_ROLE();
    const UPDATER_ROLE = await openGarage.UPDATER_ROLE();

    await openGarage.assignRole(MANUFACTURER_ROLE, manufacturer.address);
    await openGarage.assignRole(UPDATER_ROLE, updater.address);

    expect(await openGarage.hasRole(MANUFACTURER_ROLE, manufacturer.address)).to.be.true;
    expect(await openGarage.hasRole(UPDATER_ROLE, updater.address)).to.be.true;
  });

  it("Should allow admin to revoke roles", async function () {
    const MANUFACTURER_ROLE = await openGarage.MANUFACTURER_ROLE();
    const UPDATER_ROLE = await openGarage.UPDATER_ROLE();

    await openGarage.assignRole(MANUFACTURER_ROLE, manufacturer.address);
    await openGarage.assignRole(UPDATER_ROLE, updater.address);

    await openGarage.deleteRole(MANUFACTURER_ROLE, manufacturer.address);
    await openGarage.deleteRole(UPDATER_ROLE, updater.address);

    expect(await openGarage.hasRole(MANUFACTURER_ROLE, manufacturer.address)).to.be.false;
    expect(await openGarage.hasRole(UPDATER_ROLE, updater.address)).to.be.false;
  });

  it("Should emit events on registering and updating a vehicle", async function () {
    const carId = "CAR123";
    const cid = "exampleCID";
    const newCid = "updatedCID";
    const MANUFACTURER_ROLE = await openGarage.MANUFACTURER_ROLE();
    const UPDATER_ROLE = await openGarage.UPDATER_ROLE();
    //I ruoli si devono riassegnare in ogni metodo di test
    await openGarage.assignRole(MANUFACTURER_ROLE, manufacturer.address);
    await openGarage.assignRole(UPDATER_ROLE, updater.address);

    await expect(openGarage.connect(manufacturer).registerVehicle(carId,cid))
      .to.emit(openGarage, "VehicleRegistered")
      .withArgs(carId, cid);

    await expect(openGarage.connect(updater).updateVehicle(carId, newCid))
      .to.emit(openGarage, "VehicleUpdated")
      .withArgs(carId, cid, newCid);
  });

  it("Should update vehicle information", async function () {
    const carId = "CAR123";
    const cid = "exampleCID";
    const newCid = "updatedCID";
    const MANUFACTURER_ROLE = await openGarage.MANUFACTURER_ROLE();
    const UPDATER_ROLE = await openGarage.UPDATER_ROLE();

    await openGarage.assignRole(MANUFACTURER_ROLE, manufacturer.address);
    await openGarage.assignRole(UPDATER_ROLE, updater.address);

    await openGarage.connect(manufacturer).registerVehicle(carId,cid)
    await openGarage.connect(updater).updateVehicle(carId, newCid);

    const vehicle = await openGarage.vehicles(carId);
    expect(vehicle.cid).to.equal(newCid);
  });

  it("Should not allow unauthorized user to register a vehicle", async function () {
    const carId = "CAR456";
    const cid = "unauthorizedCID";

    await expect(
      openGarage.connect(user).registerVehicle(carId, cid)
    ).to.be.reverted;
  });

  it("Should not allow unauthorized user to modify a vehicle", async function () {
    const carId = "CAR456";
    const cid = "unauthorizedCID";

    await expect(
      openGarage.connect(user).updateVehicle(carId, cid)
    ).to.be.reverted;
  });

});
