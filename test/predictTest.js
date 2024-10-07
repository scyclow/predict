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







let PredictBase, ONE, TWO, THREE, FOUR, FIVE, allCoins
let picker, marketMaker, predicter1, predicter2

describe('PredictBase', () => {
  beforeEach(async () => {
    const signers = await ethers.getSigners()

    picker = signers[0]
    marketMaker = signers[1]
    predicter1 = signers[2]
    predicter2 = signers[3]


    const PredictBaseFactory = await ethers.getContractFactory('PredictBase', picker)
    const PredictCoinFactory = await ethers.getContractFactory('PredictCoin', picker)

    PredictBase = await PredictBaseFactory.deploy()
    await PredictBase.deployed()


    ONE = await PredictCoinFactory.attach(
      await PredictBase.ONE()
    )
    TWO = await PredictCoinFactory.attach(
      await PredictBase.TWO()
    )
    THREE = await PredictCoinFactory.attach(
      await PredictBase.THREE()
    )
    FOUR = await PredictCoinFactory.attach(
      await PredictBase.FOUR()
    )
    FIVE = await PredictCoinFactory.attach(
      await PredictBase.FIVE()
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
      await PredictBase.connect(marketMaker).marketMake(txValue('1'))

      for (let coin of allCoins) {
        expect(await coin.balanceOf(marketMaker.address)).to.equal(toETH(2000))
      }

      await ONE.connect(marketMaker).transfer(predicter2.address, toETH(1))
      expect(await ONE.balanceOf(marketMaker.address)).to.equal(toETH(1999))
      const endingBalance = await getBalance(marketMaker)

      expect(startingBalance - endingBalance).to.be.closeTo(1, 0.001)
      expect(await contractBalance(PredictBase)).to.equal(toETH(1))
    })


    it('Arbitrage should return the eth', async () => {

      const startingBalance = await getBalance(picker)
      await PredictBase.connect(marketMaker).marketMake(txValue('1'))

      await expectRevert(
        PredictBase.connect(marketMaker).arbitrage(toETH(2000)),
        'Ownable: caller is not the owner'
      )

      for (let coin of allCoins) {
        await coin.connect(marketMaker).transfer(picker.address, toETH(2000))
      }


      await PredictBase.connect(picker).arbitrage(toETH(1000))

      for (let coin of allCoins) {
        expect(
          await coin.connect(marketMaker).balanceOf(picker.address)
        ).to.equal(toETH(1000))
      }

      const endingBalance = await getBalance(picker)

      expect(endingBalance - startingBalance).to.be.closeTo(0.5, 0.001)
      expect(ethVal(await contractBalance(PredictBase))).to.equal(0.5)

      await expectRevert(
        PredictBase.connect(picker).arbitrage(toETH(2000)),
        'ERC20: burn amount exceeds balance'
      )
    })


    for (let i = 1; i < 6; i++) {
      it(`picking ${i} should work`, async () => {

        await PredictBase.connect(picker).marketMake(txValue('1'))

        await expectRevert(
          PredictBase.connect(marketMaker).pickNumber(i),
          'Ownable: caller is not the owner'
        )

        await PredictBase.connect(picker).pickNumber(i)

        expect(await PredictBase.connect(picker).chosenNumber()).to.equal(i)

        await expectRevert(
          PredictBase.connect(picker).pickNumber(i),
          'Number already chosen'
        )

        await expectRevert(
          PredictBase.connect(picker).arbitrage(toETH(2000)),
          'Number already chosen'
        )

        await expectRevert(
          PredictBase.connect(picker).marketMake(txValue('1')),
          'Number already chosen'
        )
      })
    }

    it(`picking invalid numbers shouldn't work`, async () => {
      expect(await PredictBase.connect(picker).chosenNumber()).to.equal(0)

      await expectRevert(
        PredictBase.connect(picker).pickNumber(0),
        'Number out of range'
      )

      await expectRevert(
        PredictBase.connect(picker).pickNumber(6),
        'Number out of range'
      )
    })

    for (let i = 1; i < 6; i++) {
      it(`redeeming ${i} as a winner should work`, async () => {
        const losingNumbers = times(5, j => j).filter(j => j !== i)
        const winnginCoinContract = allCoins[i - 1]

        await PredictBase.connect(marketMaker).marketMake(txValue('1'))

        await winnginCoinContract.connect(marketMaker).transfer(predicter1.address, toETH(2000))

        await PredictBase.connect(picker).pickNumber(i)


        const startingBalance = await getBalance(predicter1)

        await PredictBase.connect(predicter1).redeem(i, toETH(1000))
        expect(ethVal(await winnginCoinContract.connect(predicter1).balanceOf(predicter1.address))).to.equal(1000)

        await PredictBase.connect(predicter1).redeem(i, toETH(1000))
        expect(await winnginCoinContract.connect(predicter1).balanceOf(predicter1.address)).to.equal(0)

        const endingBalance = await getBalance(predicter1)

        expect(endingBalance - startingBalance).to.be.closeTo(1, 0.001)

        expect(ethVal(await contractBalance(PredictBase))).to.equal(0)

        for (let loser of losingNumbers) {
          await expectRevert(
            PredictBase.connect(predicter2).redeem(loser, 2000),
            'Can only redeem coin for winning number'
          )
        }
      })
    }
  })
})

