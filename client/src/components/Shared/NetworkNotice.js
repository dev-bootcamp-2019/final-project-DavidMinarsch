import React, { Component } from 'react';
import PropTypes from 'prop-types';

import NetworkStatus from './NetworkStatus';


class NetworkNotice extends Component {
  constructor(props) {
    super(props);
    this.bindEventListeners = this.bindEventListeners.bind(this);
  }

  componentDidMount() {
    this.bindEventListeners();
  }


  bindEventListeners() {
    const modal = document.querySelector(".modal");
    const button = document.querySelector(".delete.toggle-modal");
    if (!(button === null)) {
      button.addEventListener('click', function(){
        modal.classList.toggle('is-active');
      });
    } 
  }

  render() {
    const { network } = this.props;

    if ( network === 'rinkeby' || network === 'localhost') { return (<div />); }

    return (
      <div className="modal is-active">
        <div className="modal-background" />
        <div className="modal-content">
          <article className="message">
            <div className="message-header is-color-warning">
              <p> Notice </p>
              <button className="delete toggle-modal" type="button" />
            </div>
            <div className="message-body">
              <div>
                You are currently on &nbsp;<NetworkStatus network={network} />.
              </div>
              <div>
                Please switch to
                &nbsp;<NetworkStatus network="rinkeby" />&nbsp; or 
                &nbsp;<NetworkStatus network="localhost" />&nbsp; to access the dapp.
              </div>
              <br />
            </div>
          </article>
        </div>
      </div>
    );
  }
}


NetworkNotice.propTypes = { 
  network: PropTypes.string.isRequired
};


export default NetworkNotice;
