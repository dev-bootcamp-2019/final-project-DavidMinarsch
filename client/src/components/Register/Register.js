import React, { Component } from 'react';
// import ipfsAPI from 'ipfs-api';

import Header from '../Shared/Header';
import EtherscanLink from '../Shared/EtherscanLink';
import NetworkNotice from '../Shared/NetworkNotice';

// const useLocal = process.env.USE_LOCAL_IPFS === 'true';
// const localConfig = { host: 'localhost', port: '5001', protocol: 'http' };
// const remoteConfig = { host: process.env.REMOTE_IPFS_GATEWAY, protocol: 'https' };
// const ipfs = ipfsAPI(useLocal ? localConfig : remoteConfig);


class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ids: [],
      web3: null,
      accounts: null,
      contract: null,
      filePath: null,
      file: null,
      success: null,
      error: null,
      txHash: null,
      buttonLoading: false,
    };
    this.handleFileChange = this.handleFileChange.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
    this.registerFile = this.registerFile.bind(this);
    this.updateError = this.updateError.bind(this);
  }

  handleFileChange() {
    this.setState({ success: null, error: null, txHash: null, buttonLoading: false });
    const { files } = document.getElementById('file-input');

    if (files.length > 0) {
      const filePath = window.URL.createObjectURL(files[0]);
      this.setState({ filePath, file: files[0] });
    }
  }

  updateError(message) {
    this.setState({ error: message, success: null, txHash: null, buttonLoading: false });
  }

  uploadFile() {
    this.setState({ buttonLoading: true });
    const { file } = this.state;
    if (!file) {
      this.updateError('No file selected');
      return;
    }
    // BMP, SVG, JPG, PNG and GIF
    const isImage = (file.name.endsWith('jpg') || file.name.endsWith('jpeg') || file.name.endsWith('gif') || file.name.endsWith('svg') || file.name.endsWith('png'));
    if (!isImage) {
      this.updateError('File must be an image');
    }

    // const reader = new window.FileReader();
    // reader.onloadend = () => {
    //   const buf = Buffer.from(reader.result, 'base64');
    //   ipfs.files.add(buf, (err, result) => { // Upload buffer to IPFS
    //     if (err) console.error(err);
    //     const fileHash = result[0].hash;
    //     this.registerFile(fileHash);
    //   });
    // };
    // reader.readAsArrayBuffer(file);
  }

  async registerFile(fileHash) {
    const { account } = this.props;
    await this.registerTransaction(fileHash, account, (err, txHash) => {
      if (err) return this.updateError(err.message);
      return this.setState({ txHash, success: true, buttonLoading: false });
    }).catch(e => this.updateError(e.message));
  }

  async registerTransaction(_fileHash, _ethWallet, callback) {
    const gasCushion = 1.2;
    const safeGasLimit = 2e5;
    const gas = await this.state.contract.methods
      .registerFile(_fileHash)
      .estimateGas({ from: _ethWallet })
      .catch(console.error);
    return this.state.contract.methods
      .registerFile(_fileHash)
      .send({
        from: _ethWallet,
        gas: gas ? Math.floor(gas * gasCushion) : safeGasLimit,
      }, callback);
  };

  render() {
    const { file, filePath, txHash, success, error, buttonLoading } = this.state;

    return (
      <div>
        <NetworkNotice {...this.props} />
        <Header {...this.props} />
        <section className="container section">
          <div className="file has-name">
            <label id="file-input-label" htmlFor="file-input" className="file-label">
              <input
                id="file-input"
                className="file-input"
                type="file"
                onChange={this.handleFileChange}
              />
              <span className="file-cta">
                <span className="file-icon">
                  <i className="fas fa-upload" />
                </span>
                <span className="file-label">
                  Choose an image…
                </span>
              </span>
              <span className="file-name">
                {file ? file.name : 'No file chosen'}
              </span>
            </label>
          </div>
          <br />
          {filePath && (<img src={filePath} alt="uploaded-file" />)}
          <br />
          <br />
          {/* <div className="control">
            <input className="input" name="tags" />
          </div>
          <br />
          <br /> */}
          <button
            className={`button is-warning ${buttonLoading ? 'is-loading' : ''}`}
            onClick={this.uploadFile}
            type="submit"
          >
            Upload File
          </button>
          <div>
            ** It takes a while to connect to remote IPFS. <br />
            ** Sometimes metamask popup does not show.
            Please check if there are unfinished metamask transactions.
          </div>
          <br />
          <br />
          <div>
            {success && (
              <article className="message is-success">
                <div className="message-body">
                  <p> Success: File uploaded to IPFS and submitted to blockchain.</p>
                  <br />
                  <EtherscanLink type="tx" hash={txHash} />
                </div>
              </article>
            )}
            {error && (
              <article className="message is-danger">
                <div className="message-body">
                  <p> Error: {error}   </p>
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
