/* eslint-disable space-before-function-paren */
/* eslint-disable no-undef */
const hre = require('hardhat');
const { deployed } = require('./deployed');
const { abi } = require('./abiGreeter')
const INSTANCE = "0x5Ee1510AbE5C5d91a24229a163a9A44373773038"

async function main() {

  const [deployer] = await ethers.getSigners();

  const rinkeby = ethers.getDefaultProvider('rinkeby')

  // First we need the "key" value of the mapping storage and also the "index" of where this mapping is in the smart contract state variable
  // we fill up the index and key of "0" as it fit the storage format 32 bytes (uint256) for each slot
  const index = ethers.utils.zeroPad(0, 32)
  const key = ethers.utils.zeroPad(deployer.address, 32)
  console.log("key:", key)
  console.log("index:", index)

  // Then we concatenate them to be prepared to be hashed
  const newKey = ethers.utils.concat([key, index])
  console.log("The concatenation of index and key: ", ethers.utils.hexlify(newKey))

  // We hash it to become the final key to give to get our value
  let hashKey = ethers.utils.keccak256(newKey)
  console.log(hashKey)

  // Here the magic happen !
  console.log("Storage '0'", await rinkeby.getStorageAt(INSTANCE, hashKey))
  let totalSupply = await rinkeby.getStorageAt(INSTANCE, 1)
  console.log("Storage '1'", ethers.BigNumber.from(totalSupply).toString(), 'ether')
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
