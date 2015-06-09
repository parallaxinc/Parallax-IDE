'use strict';

const alt = require('../alt');
const { clearOutput, output } = require('../actions/console');

class ConsoleStore {
  constructor() {

    this.bindListeners({
      onClearOutput: clearOutput,
      onOutput: output
    });

    this.state = {
      bufferSize: 2048,
      lastRefresh: 0,
      length: 0,
      refreshDelayMillis: 64,
      refreshQueued: null,
      text: '',
      trimOffset: 256
    };

  }

  onClearOutput() {
    const { refreshQueued } = this.state;

    this.setState({
      length: 0,
      text: ''
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
    }else{
      this.setState({
        refreshQueued: setTimeout(refreshBuffer, refreshDelayMillis)
      });
    }

    return allowEmit;
  }

  _update(events) {
    if(Array.isArray(events)){
      _.forEach(events, this.processEvent, this);
    }else{
      this.processEvent(events);
    }
  }

  processEvent(evt){
    switch(evt.type){
      case 'text':
        this.addText(evt.data);
      break;
      default:
        console.log('NYI', evt);
      break;
    }
  }

  addText(data){
    const { text, bufferSize, trimOffset } = this.state;
    const newText = text + data;

    if(newText.length > bufferSize){
      var trimmedText = newText.substr(newText.length - (bufferSize - trimOffset));
      this.setState({
        text: trimmedText,
        length: trimmedText.length
      });
    }else{
      this.setState({
        text: newText,
        length: newText.length
      });
    }
  }

}

ConsoleStore.config = {
  stateKey: 'state'
};

module.exports = alt.createStore(ConsoleStore);
