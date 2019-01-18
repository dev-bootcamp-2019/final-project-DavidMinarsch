import React, { Component } from 'react';
import PropTypes from 'prop-types';

import multihashes from 'multihashes'
import moment from 'moment';
import ipfs from './ipfs';
import EtherscanIOLink from '../Shared/EtherscanIOLink';


class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accounts: props.accounts,
      contract: props.contract,
      file: null,
      ipfsHash: null,
      success: null,
      error: null,
      txHash: null,
      account: null,
      buttonLoading: false
    };
    this.updateFile= this.updateFile.bind(this);
    this.createHash = this.createHash.bind(this);
    this.registerHash = this.registerHash.bind(this);
    this.updateError = this.updateError.bind(this);
  }

  updateFile() {
    this.setState({
      success: null,
      error: null,
      txHash: null,
      buttonLoading: false,
      account: null
    });
    const { files } = document.getElementById('file-input');

    if (files.length > 0) {
      this.setState({ file: files[0] });
    }
  }

  createHash() {
    this.setState({
      buttonLoading: true
    });
    const { file } = this.state;
    if (!file) {
      this.updateError('You did not select a file.');
      return;
    }

    let reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      const buffer = Buffer.from(reader.result);
      ipfs.add(buffer, { onlyHash: true }, (err, ipfsHash) => { // Upload buffer to IPFS
        if (err) console.error(err);
        this.setState({ipfsHash: ipfsHash[0].hash});
        const { accounts, contract } = this.state;
        this.registerOrRetrieveHash( ipfsHash[0].hash, accounts[0], contract);
      });
    };    
  }

  updateError(message) {
    this.setState({
      error: message,
      success: null,
      txHash: null,
      buttonLoading: false
    });
  }

  async registerOrRetrieveHash(_ipfsHash, _account, _contract) {
    const multiHash = this.ipfsHashToMultiHash(_ipfsHash)
    const registration = await this.checkHashIsNotRegistered(multiHash.digest, _contract);
    if (registration.hash === "0x0000000000000000000000000000000000000000000000000000000000000000") {
      this.registerHash(multiHash.digest, _account, _contract);
    } else {
      this.setState({account: registration.registrant});
      this.updateError(`The existence of this file was already proven ${moment.utc(parseInt(registration.timestamp, 10) * 1000).fromNow()} by account ${registration.registrant}.`)
    }
  }

  async checkHashIsNotRegistered(_multiHash, _contract) {
    return _contract.methods.getRegistrationForHash(_multiHash).call().catch(e => this.updateError(e.message));
  }

  ipfsHashToMultiHash (_ipfsHash) {
    let multiHash = multihashes.fromB58String(Buffer.from(_ipfsHash))
    return {
      hashFunction: '0x' + multiHash.slice(0, 2).toString('hex'),
      digest: '0x' + multiHash.slice(2).toString('hex'),
      size: multiHash.length - 2
    };
  }

  async registerHash(_multiHash, _account, _contract) {
    await this.sendTransaction(_multiHash, _account, _contract, (err, txHash) => {
      if (err) return this.updateError(err.message);
      return this.setState({ txHash, success: true, buttonLoading: false });
    }).catch(e => this.updateError(e.message));
  }

  async sendTransaction(_ipfsHash, _account, _contract, callback) {
    const gasCushion = 1.2;
    const safeGasLimit = 2e5;
    const gasEstimate = await _contract.methods
      .registerHash(_ipfsHash)
      .estimateGas({ from: _account })
      .catch(console.error);
    return _contract.methods
      .registerHash(_ipfsHash)
      .send({
        from: _account,
        gas: gasEstimate ? Math.floor(gasEstimate * gasCushion) : safeGasLimit,
      }, callback);
  }

  render() {
    const { account, file, ipfsHash, txHash, success, error, buttonLoading, network } = this.state;

    return (
      <div>
        <section className="container section">
          <div className="file has-name">
            <label id="file-input-label" htmlFor="file-input" className="file-label">
              <input
                id="file-input"
                className="file-input"
                type="file"
                onChange={this.updateFile}
              />
              <span className="file-cta">
                <span className="file-icon">
                  <i className="fas fa-upload" />
                </span>
                <span className="file-label">
                  Choose a file ...
                </span>
              </span>
              <span className="file-name">
                {file ? file.name : 'No file chosen'}
              </span>
            </label>
          </div>
          <br />
          <ul>
            <li> Demonstrate data ownership without revealing the actual data.</li>
            <li> Document timestamping.</li>
            <li> Document integrity checking.</li>
          </ul>
          <br />
          <br />
          <button
            className={`button is-warning ${buttonLoading ? 'is-loading' : ''}`}
            onClick={this.createHash}
            type="submit"
          >
            Register On Blockchain
          </button>
          <br />
          <br />
          <div>
            {success && (
              <article className="message is-success">
                <div className="message-body">
                  <br />
                  <p> Success: Hash {ipfsHash} registered on blockchain.</p>
                  <br />
                  {txHash && (<EtherscanIOLink type="tx" hash={txHash} network={network} />)}
                </div>
              </article>
            )}
            {error && (
              <article className="message is-danger">
                <div className="message-body">
                  <br />
                  <p> Error: {error}   </p>
                  <br />
                  {account && (<EtherscanIOLink hash={account} type="address" network={network} />)}
                </div>
              </article>
            )}

          </div>
        </section>
      </div>
    );
  }
}

Register.propTypes = {
  accounts: PropTypes.arrayOf(PropTypes.string).isRequired,
  contract: PropTypes.objectOf(PropTypes.object).isRequired,
};

export default Register;
