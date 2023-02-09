import React, { Component } from 'react';
import Web3 from 'web3'
import './App.css';
import Color from './Color.json'

class App extends Component {

  async componentWillMount() {
    await this.loadBlockchainData()
  }


  async loadBlockchainData() {
//    const web3 = window.web3

     const web3 = new Web3( "http://ec2-44-234-62-156.us-west-2.compute.amazonaws.com:8545")
     const networkId = await web3.eth.net.getId();
     const network = await web3.eth.net.getNetworkType()
     console.log( "network:", network)
     const accounts = await web3.eth.getAccounts()

    console.log("account", accounts[0])
     this.setState({ account: accounts[1] })
     var config  = require('./Color.json');   // put a copy in /src directory...
     let jsonData = require('./Color.json');
     var networkKey =  Object.keys(jsonData['networks'])[Object.keys(jsonData.networks).length-1] 
     const contract = new web3.eth.Contract(jsonData.abi);
     contract.options.address = jsonData['networks'][networkId]["address"]

    this.setState({ contract })
     // Load account
    //const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })

    //const networkId = await web3.eth.net.getId()
    const networkData = Color.networks[networkId]
    const totalSupply = await contract.methods.totalSupply().call()
   this.setState({ totalSupply })
      // Load Colors
      for (var i = 1; i <= totalSupply; i++) {
        const color = await contract.methods.colors(i - 1).call()
        this.setState({
          colors: [...this.state.colors, color]
        })
      }
  }

  mint = (color) => {


      this.state.contract.methods.mint(color).send({ from: this.state.account, gas: 3000000}).once('receipt', (receipt) => {
      this.setState({
        colors: [...this.state.colors, color]
      })
    })
  }

  constructor(props) {
    super(props)
    this.state = {
    account: '',
      contract: null,
      totalSupply: 0,
      colors: []
    }
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0
shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            target="_blank"
            rel="noopener noreferrer"
          >
            Color Tokens
          </a>
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
     <small className="text-white"><span id="account">{this.state.account}
nt}</span></small>
            </li>
          </ul>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <h1>Issue Token</h1>
                <form onSubmit={(event) => {
                  event.preventDefault()
                  const color = this.color.value
                  this.mint(color)
                }}>
                  <input
                    type='text'
                    className='form-control mb-1'
                    placeholder='e.g. #FFFFFF'
                    ref={(input) => { this.color = input }}
                  />
         <input
                    type='submit'
                    className='btn btn-block btn-primary'
                    value='MINT'
                  />
                </form>
              </div>
            </main>
          </div>
          <hr/>
          <div className="row text-center">
            { this.state.colors.map((color, key) => {
              return(
                <div key={key} className="col-md-3 mb-3">
                  <div className="token" style={{ backgroundColor: color }}></div>
                  <div>{color}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
