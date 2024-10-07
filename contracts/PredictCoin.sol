// SPDX-License-Identifier: MIT

import "./Dependencies.sol";


pragma solidity ^0.8.23;

contract PredictCoin is ERC20 {
  address public baseContract;

  constructor(string memory name_, string memory symbol_) ERC20(name_, symbol_) {
    baseContract = msg.sender;
  }

  function mint(address account, uint256 amount) external {
    require(msg.sender == baseContract, 'Invalid sender');
    _mint(account, amount);
  }

  function burn(address account, uint256 amount) external {
    require(msg.sender == baseContract, 'Invalid sender');
    _burn(account, amount);
  }
}