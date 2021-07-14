import React, { Component, lazy, Suspense } from "react";
// @ts-ignore
import getWeb3 from "./getWeb3";

import "./App.css";
import { StartScreen } from "components/StartScreen";
import Menu from "components/Menu";
import { createBrowserHistory } from 'history';
import { Route, Router, Switch } from "react-router";
import { Toast } from 'primereact/toast';
import { BenchmarkClient } from "BenchmarkClient";



let History = createBrowserHistory();



class App extends Component {


  constructor(props) {
    super(props);
    this.state = { storageValue: 0, web3: null, accounts: null, contract: null, currentAccount: null, client: null };

    this.handleAccountsChanged = this.handleAccountsChanged.bind(this);
    this.handleChainChanged = this.handleChainChanged.bind(this)

    this.toast = React.createRef();
  }

  handleChainChanged(_chainId) {
    // We recommend reloading the page, unless you must do otherwise
    window.location.reload();
  }

  handleAccountsChanged(accounts) {
    if (this.state) {
      console.log("Accounts changed", accounts, this.state.currentAccount)
      if (accounts.length === 0) {
        // MetaMask is locked or the user has not connected any accounts
        this.showError('Please connect to MetaMask.');
      } else if (accounts[0] !== this.state.currentAccount) {
        this.setState({ currentAccount: accounts[0] })
      }
    } else {
      console.log("React timing issue", this, this.state)
    }

  }

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const { web3, ethereum, accounts } = await getWeb3();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      console.log(networkId)

      this.setState({ web3, accounts, currentAccount: accounts[0], networkId, client: new BenchmarkClient(web3, accounts[0]) })

      ethereum.on('chainChanged', this.handleChainChanged);
      ethereum.on('accountsChanged', this.handleAccountsChanged);

      // const deployedNetwork = SimpleStorageContract.networks[networkId];
      // const instance = new BenchmarkClient("0x26912E00C4698e3F1E391B0806473e6F83033507", web3)
      /*
            // Set web3, accounts, and contract to the state, and then proceed with an
            // example of interacting with the contract's methods.
            this.setState({ web3, accounts, contract: instance }, this.runExample);*/
    } catch (error) {

      if (typeof error === 'string') {
        this.showPersistentError(
          error,
        );
      } else {
        // Catch any errors for any of the above operations.
        this.showPersistentError(
          `Failed to load web3, accounts, or contract. Check console for details.`,
        );


        console.error(error);
      }

    }
  };


  showError = (message) => {
    this.toast.current.show({ severity: 'error', summary: 'Fehler', detail: message, life: 5000 });
  }

  showPersistentError = message => {
    this.toast.current.show({ severity: 'error', summary: 'Fehler', detail: message, sticky: true });
  }

  showInfo = (message) => {
    this.toast.current.show({ severity: 'info', summary: 'Info', detail: message, life: 5000 })
  }


  render() {
    window.web3 = this.state.web3
    const ParticipateScreen = lazy(() => import("components/BenchmarkParticipateScreen"));
    const BenchmarkCreationScreen = lazy(() => import("components/BenchmarkCreationScreen"));
    const ImprintScreen = lazy(() => import("components/ImprintScreen"));
    const ArchitectureScreen = lazy(() => import("components/ArchitectureScreen"))
    return (
      <div className="App">
        <Toast ref={this.toast} />
        {!this.state.web3 ? <p>See Error Message(s)</p> :
          <Router history={History}>
            <Menu />
            <Suspense fallback={<div>Loading component...</div>}>
              <Switch>
                <Route path="/create">
                  <BenchmarkCreationScreen web3={this.state.web3} currentAccount={this.state.currentAccount} client={this.state.client} />
                </Route>
                <Route path="/participate">
                  <ParticipateScreen web3={this.state.web3} accounts={this.state.accounts} currentAccount={this.state.currentAccount} client={this.state.client} />
                </Route>
                <Route path="/imprint">
                  <ImprintScreen />
                </Route>
                <Route path="/architecture">
                  <ArchitectureScreen />
                </Route>
                <Route path="/" exact>
                  <StartScreen />
                </Route>

              </Switch>
            </Suspense>
          </Router>}
      </div>
    );
  }
}

export default App;
