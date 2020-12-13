import React, { Component } from 'react'
import './App.css'
import Web3 from 'web3'
import HeaderBar from './components/HeaderBar'

import Escrow from './abis/Escrow.json'
import MockERC20 from './abis/MockERC20.json'
import BuyerBody from './components/BuyerBody'
import SellerBody from './components/SellerBody'
import Users from './constants/Users'
import { Container } from 'react-bootstrap'
import EthNotEnabled from './components/EthNotEnabled'

class App extends Component {

  componentWillMount() {
    console.log(window.ethereum)
    if (window.ethereum) {
      this.setState({
        ethEnabled: true
      })
      this.loadBlockchainData()
    } else {
      this.setState({
        ethEnabled: false
      })
    }
  
  }

  async loadBlockchainData() {

    const web3 = new Web3(Web3.givenProvider || "http://localhost:8545")
    const network = await web3.eth.net.getNetworkType()
    
    const networkId = await web3.eth.net.getId()
  
    const mockERC20Contract = new web3.eth.Contract(MockERC20.abi, MockERC20.networks[networkId].address)
    const escrowContract = new web3.eth.Contract(Escrow.abi, Escrow.networks[networkId].address)
  
    // Fetch escrow information
    const sellingAmount = await escrowContract.methods.sellingAmount().call()

    // Contract information
    const escrowCurrentState = await escrowContract.methods.currentState().call()
    console.log("Debug: Current escrow state " + escrowCurrentState)

    const mockERCSymbol = await mockERC20Contract.methods.symbol().call()

    // Contract User information
    const sellerAddress = await escrowContract.methods.seller().call()
    const buyerAddress = await escrowContract.methods.buyer().call()

    const currentAddress = await web3.eth.getAccounts()
    console.log(currentAddress)
    if (currentAddress.length > 0) {
      const accounts = await web3.eth.getAccounts()
      const etherBalance = await web3.eth.getBalance(accounts[0])
      const mockERCBalance = await mockERC20Contract.methods.balanceOf(accounts[0]).call()

      this.setState({
        account: accounts[0],
        etherBalance: web3.utils.fromWei(etherBalance),
        ercBalance: web3.utils.fromWei(mockERCBalance),
        ethConnected: true
      })
    } 

    this.setState({
      ercSymbol: mockERCSymbol,
      escrowContract: escrowContract,
      mockERC20Contract: mockERC20Contract,
      escrowState: escrowCurrentState,
      web3: web3,
      sellingAmount: sellingAmount,
      sellerAddress: sellerAddress,
      buyerAddress: buyerAddress
    })
  }

  connectEthWallet = (event) => {
    event.preventDefault()
    window.ethereum.enable()
  }


  constructor(props) {
    super(props)
    this.state = { 
      ethEnabled: '',
      ethConnected: false,
      account: '',
      etherBalance: '',
      ercBalance: '',
      appState: '',
      escrowContract: '',
      mockERC20Contract: '',
      ercSymbol: '',
      escrowState: '',
      web3: {},
      sellingAmount: '',
      sellerAddress: '',
      buyerAddress: ''
    }
  }

  onSellerButtonClick = () => {
    this.setState({
      appState: Users.seller
    })
  }

  onBuyerButtonClick = () => {
    this.setState({
      appState: Users.buyer
    })
  }

  setSellingAmountHandler = (sellingAmount) => {
    this.setState({
      sellingAmount: sellingAmount
    })
  }

  render() {
    let mainBody
    if (this.state.ethEnabled) {
      if (!this.state.ethConnected) {
        mainBody = <div>Account not connected. Please connect to use the DApp.</div>
      } 
      else if (this.state.appState == Users.seller) {
        mainBody = <SellerBody 
                    escrowContract={this.state.escrowContract} 
                    escrowState={this.state.escrowState} 
                    web3={this.state.web3} 
                    mockERC20Contract={this.state.mockERC20Contract}
                    sellerAddress={this.state.account}
                    setSellingAmountHandler={this.setSellingAmountHandler}
                    buyerAddress={this.state.buyerAddress}
                    />
      } else {
        mainBody = <BuyerBody 
                    escrowContract={this.state.escrowContract} 
                    escrowState={this.state.escrowState}
                    sellingAmount={this.state.sellingAmount}
                    mockERC20Contract={this.state.mockERC20Contract}
                    web3={this.state.web3}
                    buyerAddress={this.state.account}
                    sellerAddress={this.state.sellerAddress}
                    />
      }
    } else {
      mainBody = <EthNotEnabled />
    }
    
    return (
      <div className="App">
          <HeaderBar 
          etherBalance={this.state.etherBalance}
          ercBalance={this.state.ercBalance}
          ercSymbol={this.state.ercSymbol}
          sellerOnClick={this.onSellerButtonClick} 
          buyerOnClick={this.onBuyerButtonClick}
          connectButtonOnClickHandler={this.connectEthWallet}
          isEthConnected={this.state.ethConnected}
          />
          <Container>
            {mainBody}
          </Container>
      </div>
    );
  }
}

export default App;
