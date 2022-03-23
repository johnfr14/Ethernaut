//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract Greeter {

    mapping(address => uint256) public balance; 
    uint256 totalSupply;

    constructor() {
        balance[msg.sender] = 10;
        totalSupply = 1 ether;
    }
}
