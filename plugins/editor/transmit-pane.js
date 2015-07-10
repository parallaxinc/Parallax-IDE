'use strict';

const React = require('react');
const { createContainer } = require('sovereign');

const styles = require('./styles');
const deviceStore = require('../../src/stores/device');
const { transmitInput } = require('../../src/actions/device');

class TransmitPane extends React.Component {


  handleKeyDown(event) {
    const { keyCode } = event.nativeEvent;
    if (keyCode < 32 || (keyCode > 127 && keyCode < 160)) {
      transmitInput(event);
    }
  }
  handleKeyPress(event) {
    const { keyCode } = event.nativeEvent;
    if ((keyCode >= 32 && keyCode <= 127) ||
        (keyCode >= 160 && keyCode <= 255)) {
      transmitInput(event);
    }
  }

  render() {
    const { connection, transmitText } = this.props;
    return (
      <div style={styles.transmit}>
        <textarea style={styles.transmitInput} name='transmitInput'
          value={ transmitText } onKeyDown={this.handleKeyDown}
          onKeyPress={this.handleKeyPress} rows='1' disabled={!connection} />
        <br />
      </div>
    );
  }
}

module.exports = createContainer(TransmitPane, {
  getStores(){
    return {
      deviceStore: deviceStore
    };
  },

  getPropsFromStores() {
    return deviceStore.getState();
  }
});
