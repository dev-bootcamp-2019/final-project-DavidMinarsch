import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';

import NetworkStatus from './NetworkStatus';


class Header extends Component {
  componentDidMount() {}

  render() {
    const { accounts, network, ids, registrations } = this.props;
    const isActive = str => (window.location.href.includes(str) ? 'is-active' : '');

    return (
      <div>
        <section className="hero is-warning is-small">
          <div className="hero-head">
            <nav className="navbar">
              <div className="container">
                <div className="navbar-brand">
                  <a className="navbar-item" href="/">
                    <img src="images/logo.png" alt="Logo" />
                  </a>
                  <span className="navbar-burger burger" data-target="navbarMenuHeroB">
                    <span />
                    <span />
                    <span />
                  </span>
                </div>
                <div id="navbarMenuHeroB" className="navbar-menu">
                  <div className="navbar-end">
                    <li className="navbar-item">
                      <NetworkStatus network={network} />
                    </li>
                    <li className="navbar-item">
                      {accounts}
                    </li>
                    <li className="navbar-item">
                      {ids}
                    </li>
                    <li className="navbar-item">
                      <div className="tag is-dark">
                        IPFS: {process.env.USE_LOCAL_IPFS === 'true' ? 'local node' : 'remote gateway'}
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
                Proof of Existence Decentralized App
              </p>
            </div>
            <br />
          </div>

          <div className="hero-foot">
            <nav className="tabs is-boxed is-fullwidth">
              <div className="container">
                <ul>
                  <li className={isActive('/upload')}>
                    <NavLink to="/upload"> Register </NavLink>
                  </li>
                  <li className={isActive('/my')}>
                    <NavLink to="/my"> My Registrations </NavLink>
                  </li>
                </ul>
              </div>
            </nav>
          </div>
        </section>
      </div>
    );
  }
}

Header.propTypes = {
  accounts: PropTypes.array.isRequired,
  network: PropTypes.string.isRequired,
};

export default Header;
