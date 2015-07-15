'use strict';

const alt = require('../alt');

const { connected, disconnected, rx, tx, transmitInput } = require('../actions/transmission');
const deviceStore = require('./device');

class TransmissionStore {
  constructor() {

    this.bindListeners({
      onConnected: connected,
      onDisconnected: disconnected,
      onRx: rx,
      onTx: tx,
      onTransmitInput: transmitInput
    });

    this.state = {
      flashRx: false,
      flashTx: false,
      timeoutIdRx: null,
      timeoutIdTx: null,
      flashDuration: 50,
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
