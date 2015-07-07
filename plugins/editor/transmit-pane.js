'use strict';

const React = require('react');
const { createContainer } = require('sovereign');

const styles = require('./styles');
const transmissionStore = require('../../src/stores/transmission');
const { transmitInput } = require('../../src/actions/transmission');

class TransmitPane extends React.Component {

  handleInput(event) {
    transmitInput(event.key);
  }

  render() {
    return (
      <div style={styles.transmit}>
        <textarea style={styles.transmitInput} name='transmitInput'
          onKeyPress={this.handleInput} rows='1' />
        <br />
      </div>
    );
  }
}

module.exports = createContainer(TransmitPane, {
  getStores(){
    return {
      deviceStore: transmissionStore
    };
  },

  getPropsFromStores() {
    return transmissionStore.getState();
  }
});
