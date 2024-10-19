const { expect } = require('chai')
const { ethers, waffle } = require('hardhat')
const { expectRevert, time, snapshot } = require('@openzeppelin/test-helpers')

const toETH = amt => ethers.utils.parseEther(String(amt))
const txValue = amt => ({ value: toETH(amt) })
const ethVal = n => Number(ethers.utils.formatEther(n))
const num = n => Number(n)

const getBalance = async a => ethVal(await ethers.provider.getBalance(a.address))

function times(t, fn) {
  const out = []
  for (let i = 0; i < t; i++) out.push(fn(i))
  return out
}

const utf8Clean = raw => raw.replace(/data.*utf8,/, '')
const b64Clean = raw => raw.replace(/data.*,/, '')
const b64Decode = raw => Buffer.from(b64Clean(raw), 'base64').toString('utf8')
const getJsonURI = rawURI => JSON.parse(utf8Clean(rawURI))
const getSVG = rawURI => b64Decode(JSON.parse(utf8Clean(rawURI)).image)



const ONE_DAY = 60 * 60 * 24
const TEN_MINUTES = 60 * 10
const ZERO_ADDR = '0x0000000000000000000000000000000000000000'
const safeTransferFrom = 'safeTransferFrom(address,address,uint256)'

const contractBalance = contract => contract.provider.getBalance(contract.address)







let PredictTheNumber, ONE, TWO, THREE, FOUR, FIVE, allCoins
let picker, marketMaker, predicter1, predicter2

describe('PredictTheNumber', () => {
  beforeEach(async () => {
    const signers = await ethers.getSigners()

    picker = signers[0]
    marketMaker = signers[1]
    predicter1 = signers[2]
    predicter2 = signers[3]


    const PredictTheNumberFactory = await ethers.getContractFactory('PredictTheNumber', picker)
    const NumberCoinFactory = await ethers.getContractFactory('NumberCoin', picker)

    PredictTheNumber = await PredictTheNumberFactory.deploy()
    await PredictTheNumber.deployed()


    ONE = await NumberCoinFactory.attach(
      await PredictTheNumber.ONE()
    )
    TWO = await NumberCoinFactory.attach(
      await PredictTheNumber.TWO()
    )
    THREE = await NumberCoinFactory.attach(
      await PredictTheNumber.THREE()
    )
    FOUR = await NumberCoinFactory.attach(
      await PredictTheNumber.FOUR()
    )
    FIVE = await NumberCoinFactory.attach(
      await PredictTheNumber.FIVE()
    )

    allCoins = [ONE, TWO, THREE, FOUR, FIVE]

  })



  describe('Coin contracts', () => {
    it('should not allow minting or burning', async () => {
      for (let coin of allCoins) {
        await expectRevert(
          coin.connect(picker).mint(picker.address, 1),
          'Invalid sender'
        )

        await expectRevert(
          coin.connect(picker).burn(picker.address, 1),
          'Invalid sender'
        )
      }
    })
  })

  describe('BaseContract', () => {
    it('Market making should mint the correct number of coins', async () => {

      const startingBalance = await getBalance(marketMaker)
      await PredictTheNumber.connect(marketMaker).create(txValue('1'))

      for (let coin of allCoins) {
        expect(await coin.balanceOf(marketMaker.address)).to.equal(toETH(10000))
      }
      expect(await PredictTheNumber.balanceOf(marketMaker.address)).to.equal(toETH(10000))

      await ONE.connect(marketMaker).transfer(predicter2.address, toETH(1))
      expect(await ONE.balanceOf(marketMaker.address)).to.equal(toETH(9999))
      const endingBalance = await getBalance(marketMaker)

      expect(startingBalance - endingBalance).to.be.closeTo(1, 0.001)
      expect(await contractBalance(PredictTheNumber)).to.equal(toETH(1))
    })


    it('Redeem should return the eth', async () => {

      await PredictTheNumber.connect(marketMaker).create(txValue('1'))

      await expectRevert(
        PredictTheNumber.connect(predicter1).redeem(toETH(2000)),
        'ERC20: burn amount exceeds balance'
      )


      for (let coin of allCoins) {
        await coin.connect(marketMaker).transfer(predicter2.address, toETH(2000))
      }
      const startingBalance = await getBalance(predicter2)

      await expectRevert(
        PredictTheNumber.connect(picker).redeem(toETH(1000)),
        'ERC20: burn amount exceeds balance'
      )

      await expectRevert(
        PredictTheNumber.connect(predicter2).redeem(toETH(2000)),
        'ERC20: burn amount exceeds balance'
      )
      await PredictTheNumber.connect(marketMaker).transfer(predicter2.address, toETH(1500))

      await PredictTheNumber.connect(predicter2).redeem(toETH(1000))

      for (let coin of allCoins) {
        expect(
          await coin.connect(marketMaker).balanceOf(predicter2.address)
        ).to.equal(toETH(1000))
      }

      const endingBalance = await getBalance(predicter2)

      expect(endingBalance - startingBalance).to.be.closeTo(0.1, 0.001)
      expect(ethVal(await contractBalance(PredictTheNumber))).to.equal(0.9)
      expect(ethVal(await PredictTheNumber.connect(predicter2).balanceOf(predicter2.address))).to.equal(500)

      await expectRevert(
        PredictTheNumber.connect(picker).redeem(toETH(2000)),
        'ERC20: burn amount exceeds balance'
      )


      await PredictTheNumber.connect(predicter2).redeem(toETH(500))

      const mmStartBalance = await getBalance(marketMaker)
      await PredictTheNumber.connect(marketMaker).redeem(toETH(8000))
      const mmEndBalance = await getBalance(marketMaker)


      const trueEndingBalance = await getBalance(predicter2)

      expect(trueEndingBalance - startingBalance).to.be.closeTo(0.15, 0.001)
      expect(mmEndBalance - mmStartBalance).to.be.closeTo(0.8, 0.001)
      expect(ethVal(await contractBalance(PredictTheNumber))).to.equal(0.05)


      await PredictTheNumber.connect(picker).pickTheNumber(1)
      await expectRevert(
        PredictTheNumber.connect(predicter2).redeem(toETH(1000)),
        'Number already picked'
      )
    })


    for (let i = 1; i < 6; i++) {
      it(`picking ${i} should work`, async () => {

        await PredictTheNumber.connect(picker).create(txValue('1'))

        await expectRevert(
          PredictTheNumber.connect(marketMaker).pickTheNumber(i),
          'Ownable: caller is not the owner'
        )

        await PredictTheNumber.connect(picker).pickTheNumber(i)

        expect(await PredictTheNumber.connect(picker).TheNumber()).to.equal(i)

        await expectRevert(
          PredictTheNumber.connect(picker).pickTheNumber(i),
          'Number already picked'
        )

        await expectRevert(
          PredictTheNumber.connect(picker).redeem(toETH(2000)),
          'Number already picked'
        )

        await expectRevert(
          PredictTheNumber.connect(picker).create(txValue('1')),
          'Number already picked'
        )
      })
    }

    it(`picking invalid numbers shouldn't work`, async () => {
      expect(await PredictTheNumber.connect(picker).TheNumber()).to.equal(0)

      await expectRevert(
        PredictTheNumber.connect(picker).pickTheNumber(0),
        'Number out of range'
      )

      await expectRevert(
        PredictTheNumber.connect(picker).pickTheNumber(6),
        'Number out of range'
      )

      await expectRevert(
        PredictTheNumber.connect(picker).pickTheNumber(127),
        'Number out of range'
      )

      await expectRevert(
        PredictTheNumber.connect(picker).pickTheNumber(-2),
        'Number out of range'
      )

    })

    for (let i = 1; i < 6; i++) {
      it(`claiming ${i} as a winner should work`, async () => {
        const losingNumbers = times(5, j => j).filter(j => j !== i)
        const winnginCoinContract = allCoins[i - 1]

        await PredictTheNumber.connect(marketMaker).create(txValue('1'))

        await winnginCoinContract.connect(marketMaker).transfer(predicter1.address, toETH(2000))

        await PredictTheNumber.connect(picker).pickTheNumber(i)


        const startingBalance = await getBalance(predicter1)

        await PredictTheNumber.connect(predicter1).claim(i, toETH(1000))
        expect(ethVal(await winnginCoinContract.connect(predicter1).balanceOf(predicter1.address))).to.equal(1000)

        await PredictTheNumber.connect(predicter1).claim(i, toETH(1000))
        expect(await winnginCoinContract.connect(predicter1).balanceOf(predicter1.address)).to.equal(0)

        const endingBalance = await getBalance(predicter1)

        expect(endingBalance - startingBalance).to.be.closeTo(0.2, 0.001)

        expect(ethVal(await contractBalance(PredictTheNumber))).to.equal(0.8)

        for (let loser of losingNumbers) {
          await expectRevert(
            PredictTheNumber.connect(predicter2).claim(loser, 2000),
            'Can only claim prize for winning number'
          )
        }
      })
    }
  })

  describe('flash loans', () => {
    it('should work', async () => {
      const FlashLoanTestFactory = await ethers.getContractFactory('FlashLoanTest', picker)
      const FlashLoanTest = await FlashLoanTestFactory.deploy()
      await FlashLoanTest.deployed()



      await PredictTheNumber.connect(marketMaker).create(txValue('1'))

      const startingContractBalance = await contractBalance(PredictTheNumber)

      await expectRevert(
        PredictTheNumber.connect(predicter2).flashLoan(1, predicter2.address),
        'Flash loans not enabled'
      )
      expect(await PredictTheNumber.connect(predicter2).flashLoansEnabled()).to.equal(false)

      await expectRevert(
        PredictTheNumber.connect(marketMaker).enableFlashLoans(true),
        'Ownable: caller is not the owner'
      )

      await PredictTheNumber.connect(picker).enableFlashLoans(true)

      await expectRevert(
        PredictTheNumber.connect(predicter2).flashLoan(1, predicter2.address),
        'Must repay loan'
      )


      await PredictTheNumber.connect(predicter2).flashLoan(toETH(1), FlashLoanTest.address)
      await PredictTheNumber.connect(predicter2).flashLoan(toETH(1), FlashLoanTest.address)
      await PredictTheNumber.connect(predicter2).flashLoan(toETH(1), FlashLoanTest.address)

      await expectRevert.unspecified(
        PredictTheNumber.connect(predicter2).flashLoan(toETH(1.1), FlashLoanTest.address),
        ''
      )


      const endingContractBalance = await contractBalance(PredictTheNumber)

      expect(ethVal(await FlashLoanTest.balanceBorrowed())).to.equal(3)
      expect(startingContractBalance).to.equal(endingContractBalance)
    })
  })
})

