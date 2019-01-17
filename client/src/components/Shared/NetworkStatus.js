import React from 'react';
import PropTypes from 'prop-types';


const NetworkStatus = ({ network }) => {
  if (network === 'mainnet') {
    return (
      <div className="is-inline has-color-mainnet">
        <i className="fas fa-diamond" />
        &nbsp;
        <strong className="has-color-mainnet">Main Ethereum Network</strong>
      </div>
    );
  } else if (network === 'ropsten') {
    return (
      <div className="is-inline has-color-ropsten">
        <i className="fas fa-circle" />
        &nbsp;
        <strong className="has-color-ropsten">Ropsten Test Network</strong>
      </div>
    );
  } else if (network === 'kovan') {
    return (
      <div className="is-inline has-color-kovan">
        <i className="fas fa-diamond" />
        &nbsp;
        <strong className="has-color-kovan">Kovan Test Network</strong>
      </div>
    );
  } else if (network === 'rinkeby') {
    return (
      <div className="is-inline has-color-rinkeby">
        <i className="fas fa-square" />
        &nbsp;
        <strong className="has-color-rinkeby">Rinkeby Test Network</strong>
      </div>
    );
  } else if (network === 'unknown') {
    return (
      <div className="is-inline has-text-danger">Unknown Test Network </div>
    );
  }
  return (<div />);
};

NetworkStatus.defaultProps = { network: null };
NetworkStatus.propTypes = { network: PropTypes.string };

export default NetworkStatus;
