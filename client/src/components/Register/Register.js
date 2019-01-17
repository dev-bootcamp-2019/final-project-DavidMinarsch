import React, { Component } from 'react';
import 'bulma/css/bulma.css'

import ipfs from './ipfs';
import EtherscanIOLink from '../Shared/EtherscanIOLink';
import multihashes from 'multihashes'
import moment from 'moment';


class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      web3: props.web3,
      accounts: props.accounts,
      contract: props.contract,
      filePath: null,
      file: null,
      buffer: null,
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
      const filePath = window.URL.createObjectURL(files[0]);
      this.setState({ filePath, file: files[0] });
    }
  }
  
  // file is converted to a buffer for upload to IPFS
  convertToBuffer(reader) {
    //file is converted to a buffer for upload to IPFS
    const buffer = Buffer.from(reader.result);
    //set this buffer -using es6 syntax
    this.setState({buffer});
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
    // // BMP, SVG, JPG, PNG and GIF
    // const isImage = (file.name.endsWith('jpg') || file.name.endsWith('jpeg') || file.name.endsWith('gif') || file.name.endsWith('svg') || file.name.endsWith('png'));
    // if (!isImage) {
    //   this.updateError('File must be an image');
    // }

    let reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      const buffer = Buffer.from(reader.result);
      ipfs.add(buffer, { onlyHash: true }, (err, ipfsHash) => { // Upload buffer to IPFS
        if (err) console.error(err);
        this.setState({ipfsHash: ipfsHash[0].hash});
        this.registerOrRetrieveHash(this.state.ipfsHash, this.state.accounts[0], this.state.contract);
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
    const multiHash = this.ipfs2multihash(_ipfsHash)
    const registration = await this.checkHashIsNotRegistered(multiHash, _contract);
    debugger;
    if (registration.hash === "0x0000000000000000000000000000000000000000000000000000000000000000") {
      this.registerHash(multiHash, _account, _contract);
    } else {
      this.setState({account: registration.registrant});
      this.updateError(`The existence of this file was already proven ${moment.utc(parseInt(registration.timestamp, 10) * 1000).fromNow()} by account ${registration.registrant}.`)
    };
  }

  async checkHashIsNotRegistered(_multiHash, _contract) {
    return _contract.methods.getRegistrationForHash(_multiHash).call().catch(e => this.updateError(e.message));
  }

  ipfs2multihash (hash) {
    let mh = multihashes.fromB58String(Buffer.from(hash))
    return '0x' + mh.slice(2).toString('hex');
    // return {
    //   hashFunction: '0x' + mh.slice(0, 2).toString('hex'),
    //   digest: '0x' + mh.slice(2).toString('hex'),
    //   size: mh.length - 2
    // }
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
    const { account, file, txHash, success, error, buttonLoading, network } = this.state;

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
          <ul >
            <li > Demonstrate data ownership without revealing the actual data.</li>
            <li > Document timestamping.</li>
            <li > Document integrity checking.</li>
          </ul>
          <br />
          <br />
          {/* {filePath && (<img src={filePath} alt="uploaded-file" />)}
          <br />
          <br />
          {/* <div className="control">
            <input className="input" name="tags" />
          </div>
          <br />
          <br /> */}
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
                  <p> Success: File registered on blockchain.</p>
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
                  {account && (<EtherscanIOLink hash={account} type={'address'} network={network} />)}
                </div>
              </article>
            )}

          </div>
        </section>
      </div>
    );
  }
}

export default Register;
