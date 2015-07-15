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
    const keyCodeArr = new Uint8Array([keyCode]);

    this._updateTransmitText(keyCode);

    const { selectedDevice } = deviceStore.getState();
    const { getBoard } = this.getInstance();

    const board = getBoard(selectedDevice);

    board.write(keyCodeArr.buffer)
      .catch((err) => this._handleError(err));
  }

  _updateTransmitText(keyCode) {

    const key = String.fromCharCode(keyCode);
    const { transmitText } = this.state;

    let updatedTransmitText = null;
    const ignorePress = [16, 17, 18, 20];

    if ((keyCode >= 32 && keyCode <= 127) ||
        (keyCode >= 160 && keyCode <= 255)) {
      updatedTransmitText = transmitText + key;
    } else if (keyCode === 8) {
      updatedTransmitText = transmitText.slice(0, -1);
    } else if (keyCode === 10 || keyCode === 13) {
      updatedTransmitText = transmitText + '\n';
    } else if (ignorePress.indexOf(keyCode) > -1) {
      return;
    } else {
      updatedTransmitText = transmitText + ' ';
    }

    this.setState({ transmitText: updatedTransmitText });

  }

}

TransmissionStore.config = {
  stateKey: 'state'
};

module.exports = alt.createStore(TransmissionStore);
