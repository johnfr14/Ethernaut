// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import './Token.sol';

contract Malicious {
    address private _owner;
    Token public tokenContract;

    constructor(address tokenAddress) public {
        _owner = msg.sender;
        tokenContract = Token(tokenAddress);
    }

    function transferMalicious(uint amount) public {
        tokenContract.transfer(msg.sender, amount);
    }

}