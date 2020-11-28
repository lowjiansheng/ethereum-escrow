const { assert } = require('chai');

const ERCToken = artifacts.require('ERC20');
const Escrow = artifacts.require('Escrow');


require('chai')
    .use(require('chai-as-promised'))
    .should()


contract('Escrow', ([owner, investor]) => {
    let escrow, ercToken;
    before(async() => {
        ercToken = await ERCToken.new(1000000, 'MockUSDC')
        escrow = await Escrow.new(ercToken.address, 10)
    })

    describe('Escrow deployment', async() => {
        it('has a name', async() => {
            const name = await escrow.name()
            assert.equal(name, 'Escrow smart contract')
        })
    })
}) 