import React, { Component } from 'react';
import PropTypes from 'prop-types';

import NetworkStatus from './NetworkStatus';


class NetworkNotice extends Component {
  componentDidMount() { }

  render() {
    const { network } = this.props;

    //network === process.env.DEFAULT_NETWORK
    if (true) { return (<div />); }

    return (
      <div className="modal is-active">
        <div className="modal-background" />
        <div className="modal-content">
          <article className="message">
            <div className="message-header is-color-warning">
              <p> Wrong network detected </p>
              <button class="delete toggle-modal"></button>
            </div>
            <div className="message-body">
              <div>
                You are currently on &nbsp;<NetworkStatus network={network} />.
              </div>
              <div>
                Please switch to
                &nbsp;<NetworkStatus network={'rinkeby'} />&nbsp; to access the dapp.
              </div>
              <br />
            </div>
          </article>
        </div>
      </div>
    );
  }
}


NetworkNotice.defaultProps = { network: null };
NetworkNotice.propTypes = { network: PropTypes.string };


export default NetworkNotice;
