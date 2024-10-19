// SPDX-License-Identifier: MIT

import "./Dependencies.sol";
import "./NumberCoin.sol";


pragma solidity ^0.8.28;

contract PredictTheNumber is Ownable, ERC20 {
  int8 public TheNumber;
  NumberCoin public ONE;
  NumberCoin public TWO;
  NumberCoin public THREE;
  NumberCoin public FOUR;
  NumberCoin public FIVE;

  uint256 public constant PRIZE_PER_COIN = 0.0001 ether;

  event Claim(uint256 amount, address claimer);
  event Create(uint256 amount, address creator);
  event Redeem(uint256 amount, address redeemer);
  event NumberPicked(int8 number);

  constructor() ERC20('Predict Market Maker', 'PREDICT') {
    ONE = new NumberCoin('NUMBER_COIN: 1', 'ONE');
    TWO = new NumberCoin('NUMBER_COIN: 2', 'TWO');
    THREE = new NumberCoin('NUMBER_COIN: 3', 'THREE');
    FOUR = new NumberCoin('NUMBER_COIN: 4', 'FOUR');
    FIVE = new NumberCoin('NUMBER_COIN: 5', 'FIVE');
  }

  function NUMBER_PICKER() external view returns (address) {
    return owner();
  }

  function pickTheNumber(int8 n) external onlyOwner {
    require(TheNumber == 0, 'Number already picked');
    require(n > 0 && n <= 5, 'Number out of range');

    TheNumber = n;

    emit NumberPicked(n);
  }

  function claim(int8 coin, uint256 amount) external {
    require(coin == TheNumber, 'Can only claim prize for winning number');

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

    (bool sent,) = payable(msg.sender).call{value: (amount * PRIZE_PER_COIN) / 1 ether}('');
    require(sent, 'Failed to send');

    emit Claim(amount, msg.sender);
  }

  function create() external payable {
    require(TheNumber == 0, 'Number already picked');

    uint256 coinsToMint = msg.value * 10000;
    ONE.mint(msg.sender, coinsToMint);
    TWO.mint(msg.sender, coinsToMint);
    THREE.mint(msg.sender, coinsToMint);
    FOUR.mint(msg.sender, coinsToMint);
    FIVE.mint(msg.sender, coinsToMint);
    _mint(msg.sender, coinsToMint);

    emit Create(coinsToMint, msg.sender);
  }

  function redeem(uint256 amount) external {
    require(TheNumber == 0, 'Number already picked');

    ONE.burn(msg.sender, amount);
    TWO.burn(msg.sender, amount);
    THREE.burn(msg.sender, amount);
    FOUR.burn(msg.sender, amount);
    FIVE.burn(msg.sender, amount);

    _burn(msg.sender, amount);

    (bool sent,) = payable(msg.sender).call{value: (amount * PRIZE_PER_COIN) / 1 ether}('');
    require(sent, 'Failed to send');

    emit Redeem(amount, msg.sender);
  }



  // FREE FLASH LOANS
  bool transient loanActive;
  bool public flashLoansEnabled = false;

  event FlashLoan(uint256 amount, address borrower);
  event FlashLoansEnabled(bool enabled);

  receive() external payable {
    if (!loanActive) {
      (bool sentTip,) = payable(owner()).call{value: msg.value}('');
      require(sentTip, 'Failed to send');
    }
  }

  function enableFlashLoans(bool f) external onlyOwner {
    flashLoansEnabled = f;

    emit FlashLoansEnabled(f);
  }

  function flashLoan(uint256 amount, address recipient) external {
    require(flashLoansEnabled, 'Flash loans not enabled');
    require(TheNumber == 0, 'Number already picked');
    require(!loanActive);

    loanActive = true;

    uint256 originalBalance = address(this).balance;

    // Send $
    (bool sent,) = payable(recipient).call{value: amount}('');
    require(sent, 'Failed to send');

    // Receive Tip
    if (address(this).balance > originalBalance) {
      (bool sentTip,) = payable(owner()).call{value: address(this).balance - originalBalance}('');
      require(sentTip, 'Failed to send');
    }

    loanActive = false;

    emit FlashLoan(amount, msg.sender);

    // Ensure loan repaid
    require(address(this).balance == originalBalance, 'Must repay loan');
  }

}