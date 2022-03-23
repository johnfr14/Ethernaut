// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract NonceRecovery {

    address public origin;

    constructor(address origin_) {
        origin = origin_;
    }

    function getNextAddress(uint8 nonce) public view returns(address) {
        return address(uint160(uint256(keccak256(abi.encodePacked(bytes1(0xd6), bytes1(0x94), origin, bytes1(nonce))))));
    }
  
}