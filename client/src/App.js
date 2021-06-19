import React, { Component } from "react";
// @ts-ignore
import BenchmarkContract from "./contracts/BenchMark.json";
import getWeb3 from "./getWeb3";

import "./App.css";
import { StartScreen } from "components/StartScreen";
import  Menu from "components/Menu";
import {createBrowserHistory} from 'history';
import { Route, Router, Switch } from "react-router";
import { ParticipateScreen } from "components/BenchmarkParticipateScreen";
import { BenchmarkClient } from "BenchmarkClient";

let History = createBrowserHistory();



class App extends Component {
  

  constructor(props){
    super(props);
    this.state = { storageValue: 0, web3: null, accounts: null, contract: null, currentAccount: null };

    this.handleAccountsChanged = this.handleAccountsChanged.bind(this);
    this.handleChainChanged = this.handleChainChanged.bind(this)
  }

  handleChainChanged(_chainId) {
    // We recommend reloading the page, unless you must do otherwise
    window.location.reload();
  }

  handleAccountsChanged(accounts) {
    if(this.state){
      console.log("Accounts changed", accounts, this.state.currentAccount)
    if (accounts.length === 0) {
      // MetaMask is locked or the user has not connected any accounts
      alert('Please connect to MetaMask.');
    } else if (accounts[0] !== this.state.currentAccount) {
      this.setState({currentAccount: accounts[0]})
    }
    }else{
      console.log("React timing issue", this, this.state)
    }
    
  }

   componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const {web3, ethereum, accounts} = await getWeb3();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      console.log(networkId)

      this.setState({web3, accounts, currentAccount: accounts[0], networkId})

      ethereum.on('chainChanged', this.handleChainChanged);
      ethereum.on('accountsChanged', this.handleAccountsChanged);
      
      //const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new BenchmarkClient("0x26912E00C4698e3F1E391B0806473e6F83033507", web3)
/*
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);*/
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  }; 

  runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    await contract.methods.set(5).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();

    // Update state with the result.
    this.setState({ storageValue: response });
  };

  render() {
    /*
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    */
    return (
      <div className="App">
        {/* <h1>Good to Go!</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Smart Contract Example</h2>
        <p>
          If your contracts compiled and migrated successfully, below will show
          a stored value of 5 (by default).
        </p>
        <p>
          Try changing the value stored on <strong>line 42</strong> of App.js.
        </p>
        <div>The stored value is: {this.state.storageValue}</div> */}
        
      <Router history={History}>
      <Menu />
        <Switch>
        <Route path="/create">
            <p>hi</p>
          </Route>
          <Route path="/participate">
            <ParticipateScreen web3={this.state.web3} accounts={this.state.accounts} currentAccount={this.state.currentAccount} />
          </Route>
          <Route path="/">
            <StartScreen />
          </Route>
        </Switch>
      </Router>
      </div>
    );
  }
}

export default App;
