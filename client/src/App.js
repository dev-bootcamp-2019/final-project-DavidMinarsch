import React, { Component } from "react";
import { HashRouter, Route, Switch } from 'react-router-dom';
import ProofOfExistenceContract from "./contracts/ProofOfExistence.json";
import getWeb3 from "./utils/getWeb3";
import 'bulma/css/bulma.css'

import "./App.css";
import PathNotFound from './components/Shared/PathNotFound';
import Header from './components/Shared/Header';
import NetworkNotice from './components/Shared/NetworkNotice';
import Register from './components/Register/Register';
import Registrations from './components/Registrations/Registrations';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
            web3: null,
            accounts: null,
            contract: null,
            network: null,
            ids: [],
            registrations: [],
            allRegistrationsLoaded: false,
            lastLoadedIdsIndex: 0
    };
  }

  async componentDidMount() {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the network.
      const networkId = await web3.eth.net.getId();
      const network = (function(id) { 
        switch (id) {
          case 1: return 'mainnet';
          case 3: return 'ropsten';
          case 4: return 'rinkeby';
          case 42: return 'kovan';
          default: return 'localhost';
        }
      })(networkId);
      const deployedNetwork = ProofOfExistenceContract.networks[networkId];
      
      // Get the contract instance.
      const instance = new web3.eth.Contract(
        ProofOfExistenceContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with 
      // loading the account related registrations.
      this.setState({ web3, accounts, contract: instance, network }, this.onLoad);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        'The client failed to load web3, accounts, or contracts. Please make sure you are using a web3 enabled browser or have installed the Metamask browser extension. Check console for details...',
      );
      console.error(error);
    }
  }

  async onLoad() {
    // Gets all ids for default account
    const ids = await this.getIdsForUser();
    this.setState({ ids });

    // Get first set of registrations for default account
    const [registrations, lastLoadedIdsIndex, allRegistrationsLoaded] = await this.getRegistrations();
    this.setState({ registrations, lastLoadedIdsIndex, allRegistrationsLoaded });
  }

  async getIdsForUser() {
    const { accounts, contract } = this.state;
    const newIds = await contract.methods.getIdsForAddress(accounts[0]).call();
    return newIds;
  }

  async getRegistrations() {
    const { accounts, ids, contract, lastLoadedIdsIndex, registrations } = this.state;
    let newRegistrations = [];
    let allRegistrationsLoaded = false;
    for (let i = lastLoadedIdsIndex; i < lastLoadedIdsIndex + 8; i += 1) {
      try {
        const registration = await contract.methods.getRegistrationForId(ids[i]).call();
        if (registration.hash === '') throw new Error('Registration does not exist.');
        if (registration.registrant !== accounts[0]) throw new Error('Registration belongs to a different account.');
        newRegistrations.push([registration.hash, registration.timestamp]); //ensure we find transaction hash here too!
      } catch (e) {
        allRegistrationsLoaded = true;
        break;
      }
    }
    return [registrations.concat(newRegistrations), lastLoadedIdsIndex + newRegistrations.length, allRegistrationsLoaded];
  }

  render() {
    const { web3 } = this.state
    if (!web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <HashRouter basename="/">
          <Switch>
            <Route
              exact
              path="/"
              render={() => (
                <div>
                  <NetworkNotice {...this.state} />
                  <Header {...this.state} />
                  <Register
                    {...this.state}
                  />
                  <Registrations
                    {...this.state}
                    getRegistrations={this.getRegistrations}
                  />
                </div>
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
}

export default App;
