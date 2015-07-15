'use strict';

const React = require('react');
const { createContainer } = require('sovereign');

const styles = require('./styles');
const transmissionStore = require('../../src/stores/transmission');
const { transmitInput } = require('../../src/actions/transmission');

class TransmitPane extends React.Component {

  handleKeyDown(event) {
    const { keyCode } = event.nativeEvent;
    if (keyCode < 32 || (keyCode > 127 && keyCode < 160)) {
      transmitInput(keyCode);
    }
  }
  handleKeyPress(event) {
    const { keyCode } = event.nativeEvent;
    if ((keyCode >= 32 && keyCode <= 127) ||
        (keyCode >= 160 && keyCode <= 255)) {
      transmitInput(keyCode);
    }
  }

  render() {
    const { connected, text } = this.props;
    return (
      <div style={styles.transmit}>
        <textarea
          style={styles.transmitInput}
          name='transmitInput'
          value={text}
          onKeyDown={this.handleKeyDown}
          onKeyPress={this.handleKeyPress}
          rows='1'
          disabled={!connected} />
        <br />
      </div>
    );
  }
}

module.exports = createContainer(TransmitPane, {
  getStores(){
    return {
      transmissionStore: transmissionStore
    };
  },

  getPropsFromStores() {
    return transmissionStore.getState();
  }
});
