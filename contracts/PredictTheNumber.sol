// SPDX-License-Identifier: MIT

import "./Dependencies.sol";
import "./NumberCoin.sol";


pragma solidity ^0.8.23;

contract PredictTheNumber is Ownable, ERC20 {
  int8 public chosenNumber;
  NumberCoin public ONE;
  NumberCoin public TWO;
  NumberCoin public THREE;
  NumberCoin public FOUR;
  NumberCoin public FIVE;

  uint256 public constant PRIZE_PER_COIN = 0.0001 ether;

  constructor() ERC20('Predict Market Maker', 'PREDICT') {
    ONE = new NumberCoin('1', 'ONE');
    TWO = new NumberCoin('2', 'TWO');
    THREE = new NumberCoin('3', 'THREE');
    FOUR = new NumberCoin('4', 'FOUR');
    FIVE = new NumberCoin('5', 'FIVE');
  }

  function NUMBER_PICKER() external view returns (address) {
    return owner();
  }

  function pickNumber(int8 n) external onlyOwner {
    require(chosenNumber == 0, 'Number already chosen');
    require(n > 0 && n <= 5, 'Number out of range');

    chosenNumber = n;
  }

  function create() external payable {
    require(chosenNumber == 0, 'Number already chosen');

    uint256 coinsToMint = msg.value * 10000;
    ONE.mint(msg.sender, coinsToMint);
    TWO.mint(msg.sender, coinsToMint);
    THREE.mint(msg.sender, coinsToMint);
    FOUR.mint(msg.sender, coinsToMint);
    FIVE.mint(msg.sender, coinsToMint);
    _mint(msg.sender, coinsToMint);
  }

  function claim(int8 coin, uint256 amount) external {
    require(coin == chosenNumber, 'Can only claim prize for winning number');

    if (coin == 1) {
      ONE.burn(msg.sender, amount);
    } else if (coin == 2) {
      TWO.burn(msg.sender, amount);
    } else if (coin == 3) {
      THREE.burn(msg.sender, amount);
    } else if (coin == 4) {
      FOUR.burn(msg.sender, amount);
    } else if (coin == 5) {
      FIVE.burn(msg.sender, amount);
    }

    bool sent = payable(msg.sender).send((amount * PRIZE_PER_COIN) / 1 ether);
    require(sent, 'Failed to send');
  }

  function redeem(uint256 amount) external {
    require(chosenNumber == 0, 'Number already chosen');


    ONE.burn(msg.sender, amount);
    TWO.burn(msg.sender, amount);
    THREE.burn(msg.sender, amount);
    FOUR.burn(msg.sender, amount);
    FIVE.burn(msg.sender, amount);

    _burn(msg.sender, amount);

    bool sent = payable(msg.sender).send((amount * PRIZE_PER_COIN) / 1 ether);
    require(sent, 'Failed to send');
  }
}