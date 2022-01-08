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

  // We get the contract to deploy
  const Force = await hre.ethers.getContractFactory('Force');
  const force = await Force.deploy();

  // Attendre que le contrat soit réellement déployé, cad que la transaction de déploiement
  // soit incluse dans un bloc
  await force.deployed();
  
  await deployed('Force', hre.network.name, force.address);

  const tx = await force.target("0x01eFbdDC55820CD44014eeE6797e0a53f5c73a9b")
  const receipt = tx.wait()
  
  console.log(`\n${receipt}\n`);
  
  const tx2 = await deployer.sendTransaction({to: force.address, value: ethers.utils.parseEther("0.01")})
  const receipt2 = tx2.wait()

  console.log(`\n${receipt2}\n`);

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
