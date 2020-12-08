const { assert } = require('chai');

const MockERC = artifacts.require('MockERC20');
const Escrow = artifacts.require('Escrow');


require('chai')
    .use(require('chai-as-promised'))
    .should()

function tokens(n) {
    return web3.utils.toWei(n, 'Ether');
}

contract('Escrow', ([buyer, seller]) => {
    let escrow, ercToken;
    beforeEach(async () => {
        ercToken = await MockERC.new(buyer, seller, tokens('1000'))
        escrow = await Escrow.new(ercToken.address, { from: seller })
    })

    describe('Erc mint', async() => {
        it('sends buyer correct tokens', async() => {
            const balance = await ercToken.balanceOf(buyer)
            assert.equal(balance.toString(), tokens('1000'))
        })

        it('sends seller correct tokens', async() => {
            const balance = await ercToken.balanceOf(seller)
            assert.equal(balance.toString(), tokens('1000'))
        })
    })

    describe('Escrow deployment', async() => {
        it('has a name', async() => {
            const name = await escrow.name()
            assert.equal(name, 'Escrow smart contract')
        })
    })

    describe('Escrow contract', async() => {
        it('correctly execute a purchase', async() => {
            await ercToken.approve(escrow.address, tokens('20'), { from: seller })
            await escrow.sellerInitialize(tokens('10'), { from: seller })
            
            let contractBalance = await ercToken.balanceOf(escrow.address)
            assert.equal(contractBalance.toString(), tokens('20'))

            let sellerBalance = await ercToken.balanceOf(seller)
            assert.equal(sellerBalance.toString(), tokens('980'))

            await ercToken.approve(escrow.address, tokens('20'), { from: buyer })
            await escrow.purchase({ from: buyer } )

            const balance = await ercToken.balanceOf(buyer)
            assert.equal(balance.toString(), tokens('980'))
            
            contractBalance = await ercToken.balanceOf(escrow.address)
            assert.equal(contractBalance.toString(), tokens('40'))

            //await ercToken.approve(seller, tokens('10'), { from: escrow.address })
            await escrow.itemReceived({ from: buyer })
            
            contractBalance = await ercToken.balanceOf(escrow.address)
            assert.equal(contractBalance.toString(), tokens('0'))

            sellerBalance = await ercToken.balanceOf(seller)
            assert.equal(sellerBalance.toString(), tokens('1010'))

            let buyerBalance = await ercToken.balanceOf(buyer)
            assert.equal(buyerBalance.toString(), tokens('990'))
        })

        it('correctly refunds a purchase', async () => {
            await ercToken.approve(escrow.address, tokens('20'), { from: seller })
            await escrow.sellerInitialize(tokens('10'), { from: seller })
            
            let contractBalance = await ercToken.balanceOf(escrow.address)
            assert.equal(contractBalance.toString(), tokens('20'))

            let sellerBalance = await ercToken.balanceOf(seller)
            assert.equal(sellerBalance.toString(), tokens('980'))

            await ercToken.approve(escrow.address, tokens('20'), { from: buyer })
            await escrow.purchase({ from: buyer } )

            const balance = await ercToken.balanceOf(buyer)
            assert.equal(balance.toString(), tokens('980'))
            
            contractBalance = await ercToken.balanceOf(escrow.address)
            assert.equal(contractBalance.toString(), tokens('40'))

            await escrow.refundBuyer({ from: seller })

            contractBalance = await ercToken.balanceOf(escrow.address)
            assert.equal(contractBalance.toString(), tokens('0'))

            sellerBalance = await ercToken.balanceOf(seller)
            assert.equal(sellerBalance.toString(), tokens('1000'))

            buyerBalance = await ercToken.balanceOf(buyer)
            assert.equal(buyerBalance.toString(), tokens('1000'))
        })
    })

}) 