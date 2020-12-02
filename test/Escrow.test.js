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
        await ercToken.approve(seller, )
        escrow = await Escrow.new(ercToken.address, tokens('10'), { from: seller })
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

        it('selling amount is correct', async() => {
            const amount = await escrow.sellingAmount()
            assert.equal(amount.toString(), tokens('10'))
        })

        it('seller stake is initialised', async() => {
            const sellerBalance = await ercToken.balanceOf(seller)
            assert.equal(sellerBalance.toString(), tokens('980'))
        })

        it('has correct amount of erc token', async() => {
            const escrowBalance = await ercToken.balanceOf(address(escrow))
            assert.equal(escrowBalance.toString(), tokens('20'))
        })
    })

    describe('Escrow contract', async() => {
        it('correctly execute a purchase', async() => {
            await ercToken.approve(escrow.address, tokens('10'), { from: buyer })
            await escrow.purchase({ from: buyer } )

            const balance = await ercToken.balanceOf(buyer)
            assert.equal(balance.toString(), tokens('990'))
            
            let sellerBalance = await ercToken.balanceOf(seller)
            assert.equal(sellerBalance.toString(), tokens('0'))

            let contractBalance = await ercToken.balanceOf(escrow.address)
            assert.equal(contractBalance.toString(), tokens('10'))

            //await ercToken.approve(seller, tokens('10'), { from: escrow.address })
            await escrow.itemReceived({ from: buyer })
            
            contractBalance = await ercToken.balanceOf(escrow.address)
            assert.equal(contractBalance.toString(), tokens('0'))

            sellerBalance = await ercToken.balanceOf(seller)
            assert.equal(sellerBalance.toString(), tokens('10'))
        })

        it('correctly refunds a purchase', async () => {
            await ercToken.approve(escrow.address, tokens('10'), { from: buyer })
            await escrow.purchase({ from: buyer } )

            const balance = await ercToken.balanceOf(buyer)
            assert.equal(balance.toString(), tokens('990'))
            
            let sellerBalance = await ercToken.balanceOf(seller)
            assert.equal(sellerBalance.toString(), tokens('0'))

            let contractBalance = await ercToken.balanceOf(escrow.address)
            assert.equal(contractBalance.toString(), tokens('10'))

            await escrow.refundBuyer({ from: seller })


        })
    })

}) 