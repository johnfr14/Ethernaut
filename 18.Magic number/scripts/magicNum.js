/* eslint-disable space-before-function-paren */
/* eslint-disable no-undef */
const hre = require('hardhat');
const { chalk } = require('chalk');
const { ethers } = require('hardhat');
const { deployed } = require('./deployed');
const INSTANCE = "0x0f9a5D81813a3E3b317f24E56453E0b7c289F2B1"


async function main() {
  const [deployer] = await ethers.getSigners();
  const rinkeby = ethers.getDefaultProvider('rinkeby')
  
  let MagicNum = await hre.ethers.getContractFactory('MagicNum')
  let magicNum = await MagicNum.attach(INSTANCE)
  console.log("\nFunctions of MagicNum:")
  console.log(magicNum.functions)


  
  // STEP 1
  //---------------------------------------------------------------------
  // Deploy our self builded bytecode contract
  const bytecode = "0x600a600c600039600a6000f3604260805260206080f3"
  console.log(`Deploying OpCode with address ${deployer.address}`)
  // As surprising as it is we just need to send the transaction to the blockchain with the bytecode as data
  const tx = await deployer.sendTransaction({data: bytecode, gasLimit: 100000})
  const receipt = await tx.wait()
  console.log(receipt)
  
  //---------------------------------------------------------------------
  

  // STEP 2
  //---------------------------------------------------------------------
  // Set the address of our fresh bytecode contract
  console.log("Setting the address of our bytecode contract...")
  const tx2 = await magicNum.setSolver(receipt.contractAddress)
  await tx2.wait()
  console.log("Transaction valided !")
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
