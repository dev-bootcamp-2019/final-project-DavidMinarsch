import React from 'react';
import PropTypes from 'prop-types';


const EtherscanLink = (props) => {
  const { hash, type } = props;
  const href = `https://${process.env.ETH_NETWORK}.etherscan.io/${type}/${hash}`;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      <button
        className="button is-size-small is-rounded is-light"
        type="button"
      >
        view {type} on etherscan
      </button>
    </a>
  );
};


EtherscanLink.defaultProps = { type: 'address' };
EtherscanLink.propTypes = {
  hash: PropTypes.string.isRequired,
  type: PropTypes.string,
};

export default EtherscanLink;
