'use strict';

const alt = require('../alt');
const { clearOutput, output } = require('../actions/console');
//const ConsoleBuffer = require('../../plugins/editor/console-buffer');

class ConsoleStore {
  constructor(options) {

    this.opts = options || {};

    this.bindListeners({
      onClearOutput: clearOutput,
      onOutput: output
    });

    this.state = {
      bufferSize: this.opts.bufferSize || 2048,
      lastRefresh: 0,
      length: 0,
      refreshDelayMillis: 64,
      refreshQueued: null,
      text: '',
      trimOffset: this.opts.trimOffset || 256
    };

    if(this.state.bufferSize < 1){
      throw new Error('Invalid buffer length!');
    }
    if(this.state.trimOffset < 0 || this.state.trimOffset >= this.state.bufferSize){
      throw new Error('Invalid trim offset length!');
    }

  }

  onClearOutput() {
    const { refreshQueued } = this.state;

    this.setState({
      length: 0, text: ''
    });

    if(refreshQueued != null){
      clearInterval(refreshQueued);
      this.setState({ refreshQueued: null });
    }
    this.setState({ lastRefresh: 0 });
  }

  onOutput(terminalMsg) {
    const { lastRefresh, refreshDelayMillis, refreshQueued } = this.state;

    let allowEmit = false;

    this._update(terminalMsg);

    const refreshBuffer = () => {
      this.setState({
        lastRefresh: Date.now(),
        refreshQueued: null
      });
      allowEmit = true;
    };

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

  _update(terminalMsg) {
    //assume text events from terminalMsg for now
    const { text, bufferSize, trimOffset } = this.state;
    const currentText = terminalMsg.data || '';
    this.setState({ text: text + currentText });

    if(text.length > bufferSize){
      this.setState({ text: text.substr(
        text.length - (bufferSize - trimOffset)
      )});
    }
    this.setState({ length: text.length });
  }

}

ConsoleStore.config = {
  stateKey: 'state'
};

module.exports = alt.createStore(ConsoleStore);
