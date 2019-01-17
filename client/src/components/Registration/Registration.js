import React, { Component } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import multihashes from 'multihashes'

import EtherscanIOLink from '../Shared/EtherscanIOLink';


class Registration extends Component {

  multihash2hash (digest) {
    let hashFunction = "0x1220";// Hardcoded assumption

    hashFunction = hashFunction.substr(2);
    digest = digest.substr(2);
    return multihashes.toB58String(multihashes.fromHexString(hashFunction + digest));
  }

  render() {
    const { network, registration } = this.props;
    const timestamp = parseInt(registration[2], 10) * 1000;
    const digest = registration[1];
    const txHash = registration[0];

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
              <div className="is-size-5 has-text-weight-bold">
                IPFS Hash: {this.multihash2hash(digest)}
              </div>
              <br />
              <EtherscanIOLink hash={txHash} type={'tx'} network={network} />
              <br />
              <br />
              <div className="is-size-6">
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
  registration: PropTypes.array.isRequired,
};

export default Registration;
