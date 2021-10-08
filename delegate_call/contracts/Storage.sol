//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract Storage {
    uint public reservedValue;

    constructor(uint v) {
        reservedValue = v;
    }
    
    function setValue(uint v) public {
        reservedValue = v;
    }
}