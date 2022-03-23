/* eslint-disable space-before-function-paren */
/* eslint-disable no-undef */
const hre = require('hardhat');
const { chalk } = require('chalk')
const { deployed } = require('./deployed');
const { ethers } = require('hardhat');
const INSTANCE = "0x83947639e183667E5DD55de28e9Ee770d80646E9"

async function instanceState(rinkeby) {
  console.log('                          INSTANCE STORAGE STATE')
  console.log("Storage '0':", await rinkeby.getStorageAt(INSTANCE, 0), '\n')
}

async function main() {
  const [deployer] = await ethers.getSigners();
  const rinkeby = ethers.getDefaultProvider('rinkeby')
  

  await instanceState(rinkeby);


  // await instanceState(rinkeby)
  // STEP 1 
  //-----------------------------------------------------------------------------
  // Deploying our malicious contract
  console.log("Deploying malicious contract...")
  let Malicious = await hre.ethers.getContractFactory('Malicious')
  let malicious = await Malicious.deploy(INSTANCE, {gasLimit: 1000000})
  await malicious.deployed()

  await deployed("Malicious", hre.network.name, malicious.address)
  //---------------------------------------------------------------------------------


  await instanceState(rinkeby)

  00100001

  11011110

  11111111
  
  
  console.log("You win !")
  // console.log(ethers.utils.hexlify(key))
  // const bytesLike = ethers.utils.arrayify(deployer.address)
  // console.log(ethers.utils.hexlify(bytesLike))
  // console.log("My address to bytes: ", bytesLike)
  // // console.log(ethers.utils.hexlify(bytesLike))
  // const uintLike = ethers.utils.hexlify(bytesLike.slice(4))
  // console.log("My address to uint160: ", uintLike)
 }

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
