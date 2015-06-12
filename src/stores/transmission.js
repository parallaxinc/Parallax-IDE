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
      flashDuration: 30
    };

  }

  onRx() {
      this.setState({flashRx: true});

      setTimeout(() => {
        this.setState({ flashRx: false});
      }, this.state.flashDuration);
  }

  onTx() {
    this.setState({flashTx: true});

    setTimeout(() => {
      this.setState({ flashTx: false});
    }, this.state.flashDuration);
  }

}

TransmissionStore.config = {
  stateKey: 'state'
};

module.exports = alt.createStore(TransmissionStore);
