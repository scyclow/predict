// SPDX-License-Identifier: MIT

import "hardhat/console.sol";

pragma solidity ^0.8.28;

contract FlashLoanTest {
  uint256 public balanceBorrowed;

  receive() external payable {
    balanceBorrowed += msg.value;
    payable(msg.sender).send(msg.value);
  }
}