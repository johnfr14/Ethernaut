const hre = require('hardhat');
const {deployed} = require('./deployed')

async function main() {

    const [deployer] = await ethers.getSigners(); 
    console.log('Deploying contracts with the account:', deployer.address);
    // We get the contract to deploy
    const Malicious = await hre.ethers.getContractFactory("Malicious");
    const malicious = await Malicious.deploy();

    // Attendre que le contrat soit réellement déployé, cad que la transaction de déploiement
    // soit incluse dans un bloc
    await malicious.deployed();

    // Create/update deployed.json and print usefull information on the console.
    await deployed('Malicious', hre.network.name, malicious.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });