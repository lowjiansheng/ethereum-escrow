import React, { Component } from 'react'
import './App.css'
import Web3 from 'web3'

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
        <header className="App-header">
          <p>
          Account: {this.state.account}
          </p>
          <p>
            Ether balance: {this.state.balance}
          </p>
        </header>
      </div>
    );
  }
}

export default App;
