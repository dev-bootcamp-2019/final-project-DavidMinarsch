import React from 'react';
import PropTypes from 'prop-types';


const EtherscanIOLink = (props) => {
  const { hash, type, network } = props;
  if (network === 'rinkeby' && type === 'address') {
    return (
      <a href={`https://${'rinkeby'}.etherscan.io/${type}/${hash}`} target="_blank" rel="noopener noreferrer">
        <button
          className="button is-size-small is-rounded is-light"
          type="button"
        >
          Account on etherscan.io
        </button>
      </a>
    );
  } else if (network === 'rinkeby' && type === 'ipfs') {
    return (
      <a href={`https://${'rinkeby'}.etherscan.io/${type}/${hash}`} target="_blank" rel="noopener noreferrer">
        <button
          className="button is-size-small is-rounded is-light"
          type="button"
        >
          View on etherscan.io
        </button>
      </a>
    );
  } else {
    return <div />;
  }
};

EtherscanIOLink.propTypes = {
  hash: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

export default EtherscanIOLink;
