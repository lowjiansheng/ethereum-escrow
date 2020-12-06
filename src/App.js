import React, { Component } from 'react'
import './App.css'
import Web3 from 'web3'
import HeaderBar from './components/HeaderBar'

class App extends Component {

  componentWillMount() {
    this.loadBlockchainData()
  }

  async loadBlockchainData() {
    const web3 = new Web3(Web3.givenProvider || "http://localhost:8545")
    const network = await web3.eth.net.getNetworkType()
    console.log("network:", network)
    
    // Fetch account
    const accounts = await web3.eth.getAccounts()
    const etherBalance = await web3.eth.getBalance(accounts[0])
    this.setState({
      account: accounts[0],
      balance: web3.utils.fromWei(etherBalance) 
    })
  }

  constructor(props) {
    super(props)
    this.state = { 
      account: '',
      balance: ''
    }
  }

  render() {
    return (
      <div className="App">
          <HeaderBar etherBalance={this.state.balance}/>
      </div>
    );
  }
}

export default App;
