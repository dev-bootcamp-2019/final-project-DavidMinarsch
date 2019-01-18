import React, { Component } from 'react';
import PropTypes from 'prop-types';

import NetworkStatus from './NetworkStatus';


class Header extends Component {
  constructor(props) {
    super(props);
    this.bindEventListeners = this.bindEventListeners.bind(this);
  }

  componentDidMount() {
    this.bindEventListeners();
  }

  bindEventListeners() {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('#'+burger.dataset.target);
 
    burger.addEventListener('click', function(){
      burger.classList.toggle('is-active');
      nav.classList.toggle('is-active');
    });
  }

  render() {
    const { accounts, network } = this.props;

    return (
      <div>
        <section className="hero is-warning is-small">
          <div className="hero-head">
            <nav className="navbar">
              <div className="container">
                <div className="navbar-brand">
                  <a className="navbar-item" href="/">
                    <img src="images/unicorn.jpeg" alt="Logo" />
                  </a>
                  <span className="navbar-burger burger" data-target="navbarMenu">
                    <span />
                    <span />
                    <span />
                  </span>
                </div>
                <div id="navbarMenu" className="navbar-menu">
                  <div className="navbar-end">
                    <li className="navbar-item">
                      <div className="tag is-light">
                        <NetworkStatus network={network} />
                      </div>
                    </li>
                    <li className="navbar-item">
                      <div className="tag is-light">
                        Account: <strong>{accounts[0]}</strong>
                      </div>
                    </li>
                    <li className="navbar-item">
                      <div className="tag is-light">
                        IPFS: <strong>{process.env.USE_LOCAL_IPFS === 'true' ? 'local node' : 'remote Infura gateway'}</strong>
                      </div>
                    </li>
                  </div>
                </div>
              </div>
            </nav>
          </div>

          <div className="hero-body">
            <div className="container has-text-centered">
              <p className="title">
                Proof of Existence dApp
              </p>
            </div>
            <br />
          </div>

        </section>
      </div>
    );
  }
}

Header.propTypes = {
  accounts: PropTypes.arrayOf(PropTypes.string).isRequired,
  network: PropTypes.string.isRequired,
};

export default Header;
