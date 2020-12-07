//var ERC20Contract = artifacts.require("ERC20");
var MockERC20Contract = artifacts.require("MockERC20");
var EscrowContract = artifacts.require("Escrow");

function tokens(n) {
  return web3.utils.toWei(n, 'Ether');
}

module.exports = function(deployer, network, accounts) {
    deployer.deploy(MockERC20Contract, accounts[0], accounts[1], tokens('100')).then(function() {
      return deployer.deploy(EscrowContract, MockERC20Contract.address)
    })
}