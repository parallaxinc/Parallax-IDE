'use strict';

const alt = require('../alt');

const { rx, tx } = require('../actions/transmission');

class TransmissionStore {
  constructor() {

    this.bindListeners({
      onRx: rx,
      onTx: tx
    });

    this.state = {
      flashRx: false,
      flashTx: false,
      timeoutIdRx: null,
      timeoutIdTx: null,
      flashDuration: 50
    };

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

}

TransmissionStore.config = {
  stateKey: 'state'
};

module.exports = alt.createStore(TransmissionStore);
