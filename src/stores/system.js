'use strict';

const alt = require('../alt');

const { print } = require('../actions/system');

class SystemStore {
  constructor() {

    this.bindListeners({
      onPrint: print
    });

  }

  onPrint() {
    window.print();
  }

}

SystemStore.config = {
  stateKey: 'state'
};

module.exports = alt.createStore(SystemStore);
