/* eslint-disable space-before-function-paren */
/* eslint-disable no-undef */
const hre = require('hardhat');
const { chalk } = require('chalk');
const { ethers } = require('hardhat');
const { deployed } = require('./deployed');
const INSTANCE = "0xaE650cf67E5532be22827bb36e61A844B77eC3F3"


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
  console.log(`Deploying OpCode with address ${deployer.address}`)
  let OpCode = await hre.ethers.getContractFactory('OpCode')
  let opCode = await OpCode.deploy()
  await opCode.deployed()
  
  await deployed('OpCode', hre.network.name, opCode.address)
  console.log("\nFunctions of NonceRecovery:")
  console.log(opCode.functions)
  //---------------------------------------------------------------------


  // STEP 2
  //---------------------------------------------------------------------
  // Set the address of our fresh bytecode contract
  console.log("Setting the address of our bytecode contract...")
  const tx = await magicNum.setSolver(opCode.address)
  await tx.wait()
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
