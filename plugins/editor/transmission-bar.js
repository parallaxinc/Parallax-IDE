'use strict';

const React = require('react');
const { createContainer } = require('sovereign');

const Indicators = require('./indicators');
const styles = require('./styles');
const transmissionStore = require('../../src/stores/transmission');

class TransmissionBar extends React.Component {

  render() {
    const { flashRx, flashTx } = this.props;

    return (
      <div style={styles.bar}>
        <Indicators flashRx={flashRx} flashTx={flashTx} />
      </div>
    );
  }
}

module.exports = createContainer(TransmissionBar, {
  getStores(){
    return {
      deviceStore: transmissionStore
    };
  },

  getPropsFromStores() {
    return transmissionStore.getState();
  }
});
