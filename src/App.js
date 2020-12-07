import React, { Component } from 'react'
import './App.css'
import Web3 from 'web3'
import HeaderBar from './components/HeaderBar'

import Escrow from './abis/Escrow.json'
import MockERC20 from './abis/MockERC20.json'

class App extends Component {

  componentWillMount() {
    this.loadBlockchainData()
  }

  async loadBlockchainData() {
    const web3 = new Web3(Web3.givenProvider || "http://localhost:8545")
    const network = await web3.eth.net.getNetworkType()
    
    const networkId = await web3.eth.net.getId()
  
    const mockERC20Contract = new web3.eth.Contract(MockERC20.abi, MockERC20.networks[networkId].address)
    const escrowContract = new web3.eth.Contract(Escrow.abi, Escrow.networks[networkId].address)
  
    // Fetch accounts
    const accounts = await web3.eth.getAccounts()
    const etherBalance = await web3.eth.getBalance(accounts[0])
    const mockERCBalance = await mockERC20Contract.methods.balanceOf(accounts[0]).call()
    const mockERCSymbol = await mockERC20Contract.methods.symbol().call()


    this.setState({
      account: accounts[0],
      etherBalance: web3.utils.fromWei(etherBalance),
      ercBalance: web3.utils.fromWei(mockERCBalance),
      ercSymbol: mockERCSymbol,
      escrowContract: escrowContract
    })
  }

  constructor(props) {
    super(props)
    this.state = { 
      account: '',
      etherBalance: '',
      ercBalance: '',
      appState: '',
      escrowContract: '',
      ercSymbol: ''
    }
  }

  onSellerButtonClick = () => {
    this.setState({
      appState: "seller"
    })
  }

  onBuyerButtonClick = () => {
    this.setState({
      appState: "buyer"
    })
  }

  render() {
    let mainBody
    if (this.state.appState == "seller") {
      mainBody = <div>Seller</div>
    } else {
      mainBody = <div>Buyer</div>
    }

    return (
      <div className="App">
          <HeaderBar 
          etherBalance={this.state.etherBalance}
          ercBalance={this.state.ercBalance}
          ercSymbol={this.state.ercSymbol}
          sellerOnClick={this.onSellerButtonClick} 
          buyerOnClick={this.onBuyerButtonClick}/>
          {mainBody}
      </div>
    );
  }
}

export default App;
