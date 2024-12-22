// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.

const path = require("path");

async function main() {
  // This is just a convenience check
  if (network.name === "hardhat") {
    console.warn(
      "You are trying to deploy a contract to the Hardhat Network, which" +
        "gets automatically created and destroyed every time. Use the Hardhat" +
        " option '--network localhost'"
    );
  }

  // ethers is available in the global scope
  const [deployer] = await ethers.getSigners();
  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress()
  );

  const OpenGarage = await ethers.getContractFactory("OpenGarage");
  const openGarage = await OpenGarage.deploy();
  const address = await openGarage.getAddress();
  console.log("OpenGarage contract deployed to:", address);

  //We also save the contract's artifacts and address in the frontend directory
  saveFrontendFiles(openGarage,address);
}

function saveFrontendFiles(openGarage,address) {
  const fs = require("fs");
  const contractsDir = path.join(__dirname, "..", "frontend","opengarage-dapp", "src", "contracts");

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    path.join(contractsDir, "OpenGarage-address.json"),
    JSON.stringify({ OpenGarageAddress: address }, undefined, 2)
  );

  const OpenGarageArtifact = artifacts.readArtifactSync("OpenGarage");

  fs.writeFileSync(
    path.join(contractsDir, "OpenGarage.json"),
    JSON.stringify(OpenGarageArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
