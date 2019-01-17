import React, { Component } from "react";
import Redirect from 'react-router/Redirect';
import { HashRouter, Route, Switch } from 'react-router-dom';
import ProofOfExistenceContract from "./contracts/ProofOfExistence.json";
import getWeb3 from "./utils/getWeb3";

import "./App.css";
import Register from './components/Register/Register';
import PathNotFound from './components/Shared/PathNotFound';


class App extends Component {
  state = { 
            web3: null,
            accounts: null,
            contract: null,
            network: null,
            ids: [],
            registrations: [],
            lastLoadedIdsIndex: 0
          };

  async getIds() {
    const { accounts, contract } = this.state;
    const newIds = await contract.methods.getIdsForAddress(accounts[0]).call();
    this.setState({
      ids: newIds,
    });
    return newIds;
  } 

  async getRegistrations() {
    const { ids, contract, lastLoadedIdsIndex, registrations } = this.state;
    let newRegistrations = [];
    for (let i = lastLoadedIdsIndex + 1; i <= lastLoadedIdsIndex + 5; i += 1) {
      try {
        const registration = await contract.methods.getRegistrationForId(ids[i]).call();
        if (registration.hash === '') throw new Error('Registration does not exist.');
        newRegistrations.push(registration);
      } catch (e) {
        break;
      }
    }
    this.setState({
      registrations: registrations.concat(newRegistrations),
      lastLoadedIdsIndex: lastLoadedIdsIndex + newRegistrations.length,
    });
    return registrations.concat(newRegistrations);
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <HashRouter basename="/">
          <Switch>
            <Route
              exact path="/"
              render={() => (
                <Redirect
                  to="/upload"
                />
              )}
            />
            <Route
              exact path="/upload"
              render={() => (
                <Register
                  {...this.state}
                  retrieveMoreFiles={this.retrieveMoreFiles}
                />
              )}
            />
            <Route
              path="*"
              render={() => (
                <PathNotFound
                  {...this.state}
                />
              )}
            />
          </Switch>
        </HashRouter>
      </div>
    );
  }

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const network = (function(id) { 
        switch (id) {
          case 1: return 'mainnet';
          case 3: return 'ropsten';
          case 4: return 'rinkeby';
          case 42: return 'kovan';
          default: return 'unknown';
        }
      })(networkId);
      const deployedNetwork = ProofOfExistenceContract.networks[networkId];
      const instance = new web3.eth.Contract(
        ProofOfExistenceContract.abi,
        deployedNetwork && deployedNetwork.address,
      );


      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance, network }, this.onLoad);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  onLoad = async () => {
    // Gets all ids for account
    const ids = await this.getIds();

    // Get first set of registrations
    const registrations = await this.getRegistrations();

    // // Update state with the result.
    // this.setState({ ids, registrations });
  };
}

export default App;
