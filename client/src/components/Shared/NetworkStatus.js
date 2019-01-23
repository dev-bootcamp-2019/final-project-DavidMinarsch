import React from 'react';
import PropTypes from 'prop-types';


const NetworkStatus = ({ network }) => {
  if (network === 'mainnet') {
    return (
      <div className="is-inline has-color-mainnet">
        Network: <strong className="has-color-mainnet">Main</strong>
      </div>
    );
  } else if (network === 'ropsten') {
    return (
      <div className="is-inline has-color-ropsten">
        Network: <strong className="has-color-ropsten">Ropsten</strong>
      </div>
    );
  } else if (network === 'kovan') {
    return (
      <div className="is-inline has-color-kovan">
        Network: <strong className="has-color-kovan">Kovan</strong>
      </div>
    );
  } else if (network === 'rinkeby') {
    return (
      <div className="is-inline has-color-rinkeby">
        Network: <strong className="has-color-rinkeby">Rinkeby</strong>
      </div>
    );
  } else if (network === 'localhost') {
    return (
      <div className="is-inline has-text-danger">
        Network: <strong className="has-color-localhost">Localhost</strong>
      </div>
    );
  }
  return (<div />);
};

NetworkStatus.propTypes = { network: PropTypes.string.isRequired };

export default NetworkStatus;
