'use strict';

const alt = require('../alt');

const { connected, disconnected, transmitInput } = require('../actions/transmission');
const deviceStore = require('./device');

class TransmissionStore {
  constructor() {

    this.bindListeners({
      onConnected: connected,
      onDisconnected: disconnected,
      onTransmitInput: transmitInput
    });

    this.state = {
      text: '',
      connected: false
    };

  }

  onConnected() {
    this.setState({
      text: '',
      connected: true
    });
  }

  onDisconnected() {
    this.setState({ connected: false });
  }

  onTransmitInput(val) {
    const { selectedDevice } = deviceStore.getState();
    const { getBoard } = this.getInstance();

    const board = getBoard(selectedDevice);

    board.once('transmit', this._processEvent.bind(this));

    board.write(val)
      .catch((err) => this._handleError(err));
  }

  _processEvent(input) {
    const { text } = this.state;

    const newText = input.reduce((result, ch) => {
      if(ch.type === 'backspace'){
        return result.slice(0, -1);
      }

      if(ch.type === 'text'){
        return result + ch.data;
      }

      return result;
    }, text);

    this.setState({
      text: newText
    });
  }
}

TransmissionStore.config = {
  stateKey: 'state'
};

module.exports = alt.createStore(TransmissionStore);
