import React, { Component } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import multihashes from 'multihashes'

import EtherscanIOLink from '../Shared/EtherscanIOLink';


class Registration extends Component {

  multiHashToIpfsHash (digest) {
    let hashFunction = "0x1220";// Hardcoded assumption

    hashFunction = hashFunction.substr(2); // to remove "0x"
    digest = digest.substr(2); // to remove "0x"
    return multihashes.toB58String(multihashes.fromHexString(hashFunction + digest));
  }

  render() {
    const { network, registration } = this.props;
    const ipfsHash = this.multiHashToIpfsHash(registration[0]);
    const timestamp = parseInt(registration[1], 10) * 1000;
    const registrant = registration[2];

    return (
      <div className="card">
        <div className="card-image">
          <figure className="image is-4by3">
            <img src="images/unicorn.jpeg" alt="Placeholder" />
          </figure>
        </div>
        <div className="card-content">
          <div className="media">
            <div className="media-content">
              <div className="is-size-6">
                IPFS Hash:
              </div>
              <div className="is-size-7 has-text-weight-bold">
                {ipfsHash.slice(0,23)}
                <br />
                {ipfsHash.slice(23,46)}
              </div>
              <br />
              <EtherscanIOLink hash={registrant} type='address' network={network} />
              <br />
              <br />
              <div className="is-size-7">
                Existence proven {moment.utc(timestamp).fromNow()}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Registration.propTypes = {
  network: PropTypes.string.isRequired,
  registration: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Registration;
