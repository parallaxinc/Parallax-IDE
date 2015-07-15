'use strict';

const alt = require('../alt');

const { connected, disconnected, rx, tx, transmitInput, transmitParsed } = require('../actions/transmission');
const deviceStore = require('./device');

class TransmissionStore {
  constructor() {

    this.bindListeners({
      onConnected: connected,
      onDisconnected: disconnected,
      onRx: rx,
      onTx: tx,
      onTransmitInput: transmitInput,
      onTransmitParsed: transmitParsed
    });

    this.state = {
      flashRx: false,
      flashTx: false,
      timeoutIdRx: null,
      timeoutIdTx: null,
      flashDuration: 50,
      transmitText: '',
      connected: false
    };

  }

  onConnected() {
    this.setState({ connected: true });
  }

  onDisconnected() {
    this.setState({ connected: false });
  }

  onRx() {
    const { flashDuration, timeoutIdRx } = this.state;
    this.setState({flashRx: true});

    if(!timeoutIdRx) {
      const id = setTimeout(() => {
        this.setState({
          flashRx: false,
          timeoutIdRx: null
        });
      }, flashDuration);

      this.setState({ timeoutIdRx: id });
    }
  }

  onTx() {
    const { flashDuration, timeoutIdTx } = this.state;

    this.setState({flashTx: true});

    if(!timeoutIdTx) {
      const id = setTimeout(() => {
        this.setState({
          flashTx: false,
          timeoutIdTx: null
        });
      }, flashDuration);

      this.setState({ timeoutIdTx: id });
    }
  }

  onTransmitInput(input) {

    const { keyCode } = input.nativeEvent;

    const { selectedDevice } = deviceStore.getState();
    const { getBoard } = this.getInstance();

    const board = getBoard(selectedDevice);

    board.write(keyCode)
      .catch((err) => this._handleError(err));
  }

  onTransmitParsed(input) {
    const { transmitText } = this.state;

    let updatedTransmitText = null;

    input.forEach((ch) => {
      if (ch.type === 'backspace') {
        updatedTransmitText = transmitText.slice(0, -1);

      } else if (ch.type === 'text') {
        updatedTransmitText = transmitText + ch.data;
      }
      this.setState({ transmitText: updatedTransmitText });
    });
  }
}

TransmissionStore.config = {
  stateKey: 'state'
};

module.exports = alt.createStore(TransmissionStore);
