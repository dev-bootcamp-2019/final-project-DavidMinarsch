import React from 'react';
import PropTypes from 'prop-types';


const EtherscanIOLink = (props) => {
  const { hash, type, network } = props;
  if (network !== 'rinkeby' && type === 'address') {
    return (
      <a href={`https://${'rinkeby'}.etherscan.io/${type}/${hash}`} target="_blank" rel="noopener noreferrer">
        <button
          className="button is-size-small is-rounded is-light"
          type="button"
        >
          View the transactions related to this account on etherscan.io
        </button>
      </a>
    );
  } else if (network !== 'rinkeby' && type === 'tx') {
    return (
      <a href={`https://${'rinkeby'}.etherscan.io/${type}/${hash}`} target="_blank" rel="noopener noreferrer">
        <button
          className="button is-size-small is-rounded is-light"
          type="button"
        >
          View this transaction on etherscan.io
        </button>
      </a>
    );
  } else {
    return <div>Loading Web3, accounts, and contract...</div>;
  }
};

EtherscanIOLink.propTypes = {
  hash: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

export default EtherscanIOLink;
