'use strict';

const alt = require('../alt');
const { clearOutput, output  } = require('../actions/console');
const ConsoleBuffer = require('../../plugins/editor/console-buffer');

class ConsoleStore {
  constructor() {

    this.bindListeners({
      onClearOutput: clearOutput,
      onOutput: output
    });

    this.state = {
      buffer: new ConsoleBuffer(),
      lastRefresh: 0,
      refreshDelayMillis: 64,
      refreshQueued: null
    };

  }

  onClearOutput() {
    const { buffer, refreshQueued } = this.state;
    buffer.clear();
    if(refreshQueued != null){
      clearInterval(refreshQueued);
      this.setState({ refreshQueued: null });
    }
    this.setState({ lastRefresh: 0 });
  }

  onOutput(evt) {
    const { buffer, lastRefresh, refreshDelayMillis, refreshQueued } = this.state;

    let allowEmit = false;

    buffer.update(evt);

    const refreshBuffer = function() {
      this.setState({
        lastRefresh: Date.now(),
        refreshQueued: null
      });
      allowEmit = true;
    }.bind(this);

    if(refreshQueued != null){
      return false;
    }

    if(lastRefresh < Date.now() - refreshDelayMillis){
      refreshBuffer();
    }
    else{
      this.setState({
        refreshQueued: setTimeout(refreshBuffer, refreshDelayMillis)
      });
    }

    return allowEmit;
  }


}

ConsoleStore.config = {
  stateKey: 'state'
};

module.exports = alt.createStore(ConsoleStore);
