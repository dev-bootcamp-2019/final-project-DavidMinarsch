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
            networkId: null,
            ids: [],
            registrations: [],
            allRegistrationsLoaded: false,
            lastLoadedIdsIndex: 0
    };
    this.bindMetamaskEventListeners = this.bindMetamaskEventListeners.bind(this);
    this.updateData = this.updateData.bind(this);
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
      const deployedNetwork = await ProofOfExistenceContract.networks[networkId];
      
      const abi = await ProofOfExistenceContract.abi;
      // Get the contract instance.
      const instance = new web3.eth.Contract(
        abi,
        deployedNetwork && deployedNetwork.address,
      );
      // let proofOfExistence = await contract(ProofOfExistenceContract);
      // proofOfExistence.setProvider(web3);

      // const c = await contract.methods.beneficiary().call({from: accounts[0]});
      //const d = await proofOfExistence.beneficiary({from: accounts[0] });

      // Set web3, accounts, and contract to the state, and then proceed with 
      // loading the account related registrations.
      this.setState({ web3, accounts, contract: instance, network, networkId }, this.onLoad);
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
    const ids = await this.getIds();
    this.setState({ ids });

    // Get first set of registrations for default account
    const [registrations, lastLoadedIdsIndex, allRegistrationsLoaded] = await this.getRegistrations();
    this.setState({ registrations, lastLoadedIdsIndex, allRegistrationsLoaded }, this.bindMetamaskEventListeners);
  }

  async getIds() {
    const { accounts, contract } = this.state;
    const newIds = await contract.methods.getIdsForAddress(accounts[0]).call({ from: accounts[0] });
    return newIds;
  }

  async getRegistrations() {
    const { accounts, ids, contract, lastLoadedIdsIndex, registrations } = this.state;
    const defaultNumberRegistrations = 12;
    let newRegistrations = [];
    let allRegistrationsLoaded = false;
    for (let i = lastLoadedIdsIndex; i < lastLoadedIdsIndex + defaultNumberRegistrations; i += 1) {
      try {
        const registration = await contract.methods.getRegistrationForId(ids[i]).call({ from: accounts[0] });
        if (registration.hash === '') throw new Error('Registration does not exist.');
        if (registration.registrant !== accounts[0]) throw new Error('Registration belongs to a different account.');
        newRegistrations.push([registration.hash, registration.timestamp, registration.registrant]); //ensure we find transaction hash here too!
      } catch (e) {
        allRegistrationsLoaded = true;
        break;
      }
    }
    return [registrations.concat(newRegistrations), lastLoadedIdsIndex + newRegistrations.length, allRegistrationsLoaded];
  }

  bindMetamaskEventListeners() {
    const { web3 } = this.state;
    const callback = (function (response) {
      let { web3, accounts, networkId } = this.state;
      if (parseInt(response.networkVersion) !== networkId) {
        window.location.reload();
      } else if (web3.utils.toChecksumAddress(response.selectedAddress) !== accounts[0]) {
        window.location.reload();
        // accounts[0] = response.selectedAddress;
        // this.setState({ accounts });
        // this.onLoad();
      }
    }).bind(this);

    web3.currentProvider.publicConfigStore.on('update', callback);
  }

  updateData() {
    this.onLoad();
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
                    updateData={this.updateData}
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
