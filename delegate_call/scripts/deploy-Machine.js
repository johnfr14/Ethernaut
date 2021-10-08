/* eslint-disable space-before-function-paren */
/* eslint-disable no-undef */
const hre = require('hardhat');
const { deployed } = require('./deployed');

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // Optionnel car l'account deployer est utilisé par défaut
  const [deployer] = await ethers.getSigners();
  console.log('Deploying contracts with the account:', deployer.address);

  //deploying storage
  const Storage = await hre.ethers.getContractFactory('Storage');
  const storage = await Storage.deploy(5);

  await storage.deployed();
  console.log(storage)
  await deployed('Greeter', hre.network.name, storage.address);

  // deploying Machine
  const Machine = await hre.ethers.getContractFactory('Machine');
  const machine = await Machine.deploy(storage.address);
  
  await machine.deployed();
  await deployed('Greeter', hre.network.name, machine.address);
  

  // Create/update deployed.json and print usefull information on the console.
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
