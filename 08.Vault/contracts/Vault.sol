// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Vault {
  bool public locked;
  bytes32 private _password;

  constructor(bytes32 password_) {
    locked = true;
    _password = password_;
  }

  function unlock(bytes32 password_) public {
    if (_password == password_) {
      locked = false;
    }
  }
}