import React, { Component } from 'react';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';

import Registration from '../Registration/Registration';

class Registrations extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // accounts: props.accounts,
      // contract: props.contract,
      // ids: props.ids,
      // lastLoadedIdsIndex: props.lastLoadedIdsIndex,
      // registrations: props.registrations,
      // allRegistrationsLoaded: props.allRegistrationsLoaded,
    };
    // this.getRegistrations = this.getRegistrations.bind(this);
  }

  render() {
    const { ids, registrations, allRegistrationsLoaded, getRegistrations, network} = this.props;
    let columns = [];

    for (let i = 0; i < registrations.length; i += 1) {
      const mod = i % 4;
      columns[mod] = columns[mod] || [];
      columns[mod].push(registrations[i]);
    }
    return (
      <div>
        <InfiniteScroll
          // state={this.props}
          key="registrations-scroll"
          dataLength={ids.length}
          next={getRegistrations}
          hasMore={!allRegistrationsLoaded}
          loader={
            <div className="has-text-centered card-content"> Loading ... </div>
          }
          endMessage={
            (registrations.length !== 0 && (<div className="has-text-centered card-content"> All your registrations are loaded! </div>))
          }
        >
          {registrations.length !== 0 && (
          <section className="container section">
            <div className="columns">
              {columns.map((col) => {
                return (
                  <div className="column is-3" key={`column-${Math.random()}`}>
                    {col.map((registration) => {
                      return (
                        <div key={`registration-${registration[0]}`}>
                          <Registration registration={registration} network={network} />
                          <br />
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </section>
          )}
          {registrations.length === 0 && (
            <section className="container">
              <div className="notification">
                You have no registrations yet.
              </div>
            </section>
          )}
        </InfiniteScroll>
      </div>
    );
  }
}

Registrations.propTypes = {
  ids: PropTypes.arrayOf(PropTypes.string).isRequired,
  registrations: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
  allRegistrationsLoaded: PropTypes.bool.isRequired,
  getRegistrations: PropTypes.func.isRequired,
  network: PropTypes.string.isRequired,
};

export default Registrations;
