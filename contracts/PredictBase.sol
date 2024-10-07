// SPDX-License-Identifier: MIT

import "./Dependencies.sol";
import "./PredictCoin.sol";


pragma solidity ^0.8.23;

contract PredictBase is Ownable {
  int8 public chosenNumber;
  PredictCoin public ONE;
  PredictCoin public TWO;
  PredictCoin public THREE;
  PredictCoin public FOUR;
  PredictCoin public FIVE;

  uint256 public constant PRIZE_PER_COIN = 0.0001 ether;

  constructor() {
    ONE = new PredictCoin('1', 'ONE');
    TWO = new PredictCoin('2', 'TWO');
    THREE = new PredictCoin('3', 'THREE');
    FOUR = new PredictCoin('4', 'FOUR');
    FIVE = new PredictCoin('5', 'FIVE');
  }

  function pickNumber(int8 n) external onlyOwner {
    require(chosenNumber == 0, 'Number already chosen');
    require(n > 0 && n <= 5, 'Number out of range');

    chosenNumber = n;
  }

  function marketMake() external payable {
    require(chosenNumber == 0, 'Number already chosen');

    uint256 coinsToMint = msg.value * 2000;
    ONE.mint(msg.sender, coinsToMint);
    TWO.mint(msg.sender, coinsToMint);
    THREE.mint(msg.sender, coinsToMint);
    FOUR.mint(msg.sender, coinsToMint);
    FIVE.mint(msg.sender, coinsToMint);
  }

  function redeem(int8 coin, uint256 amount) external {
    require(coin == chosenNumber, 'Can only redeem coin for winning number');

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

    bool sent = payable(msg.sender).send((amount * PRIZE_PER_COIN) / 0.2 ether);
    require(sent, 'Failed to send');
  }

  function arbitrage(uint256 amount) external onlyOwner {
    require(chosenNumber == 0, 'Number already chosen');

    ONE.burn(msg.sender, amount);
    TWO.burn(msg.sender, amount);
    THREE.burn(msg.sender, amount);
    FOUR.burn(msg.sender, amount);
    FIVE.burn(msg.sender, amount);

    bool sent = payable(msg.sender).send((amount * PRIZE_PER_COIN) / 0.2 ether);
    require(sent, 'Failed to send');
  }
}