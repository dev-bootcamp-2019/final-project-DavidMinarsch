import React, { Component } from 'react';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';

import Registration from '../Registration/Registration';

class Registrations extends Component {
  componentDidMount() {}

  render() {
    const { ids, registrations, allRegistrationsLoaded, getRegistrations, network} = this.props;
    let columns = [];

    for (let i = 0; i < registrations.length; i += 1) {
      const mod = i % 3;
      columns[mod] = columns[mod] || [];
      columns[mod].push(registrations[i]);
    }
    return (
      <div>
        <InfiniteScroll
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
          {registrations.length !== 0 && (<section className="container section">
            <div className="columns">
              {columns.map((col) => {
                return (
                  <div className="column is-4" key={`column-${Math.random()}`}>
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
  ids: PropTypes.array.isRequired,
  registrations: PropTypes.array.isRequired,
  allRegistrationsLoaded: PropTypes.bool.isRequired,
  getRegistrations: PropTypes.func.isRequired,
  network: PropTypes.string.isRequired,
};

export default Registrations;
