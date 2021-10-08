//SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.0;

import "./Storage.sol";

contract Machine {

    uint public reservedValue;
    Storage stor;


    constructor(address addr) {
        stor = Storage(addr);
    }
    
    function saveValue(uint x) public returns (bool) {
        stor.setValue(x);
        return true;
    }

    function setValue(uint x) public {
        (bool result,) = address(stor).delegatecall(abi.encodeWithSignature("setValue(uint256)", x));
        if (result) {
         this;
        }
    }

    function getValueStorage() public view returns (uint) {
        return stor.reservedValue();
    }

    function getValueMachine() public view returns (uint) {
        return reservedValue;
    }
}