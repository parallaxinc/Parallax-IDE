'use strict';

const _ = require('lodash');

const alt = require('../alt');
const { clearOutput, output } = require('../actions/console');

class ConsoleStore {
  constructor() {

    this.bindListeners({
      clearAll: clearOutput,
      onOutput: output
    });

    this.state = {
      lastRefresh: 0,
      length: 0,
      lines: [''],
      lineWrap: 256,
      maxLines: 2048,
      pointerLine: 0,
      pointerColumn: 0,
      refreshDelayMillis: 64,
      refreshQueued: null,
      text: '',
      trimCount: 64
    };

  }

  clearAll() {
    const { refreshQueued } = this.state;

    this.setState({
      length: 0,
      text: '',
      lines: [''],
      pointerLine: 0,
      pointerColumn: 0
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
      this.updateText();
      allowEmit = true;
      this.setState({
        lastRefresh: Date.now(),
        refreshQueued: null
      });
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

  addLinefeed(){
    const { lines, pointerLine } = this.state;
    const newLinePos = pointerLine + 1;
    if(lines.length === newLinePos){
      lines[newLinePos] = '';
    }
    this.setState({
      pointerLine: newLinePos,
      pointerColumn: 0
    });
  }

  setCursorHome(){
    this.setState({
      pointerLine: 0,
      pointerColumn: 0
    });
  }

  setCursorLeft(){
    const { pointerColumn } = this.state;
    this.setState({
      pointerColumn: Math.max(0, pointerColumn - 1)
    });
  }

  setCursorRight(){
    const { pointerColumn } = this.state;
    this.setState({
      pointerColumn: Math.min(255, pointerColumn + 1)
    });
  }

  setCursorUp(){
    const { pointerLine } = this.state;
    this.setState({
      pointerLine: Math.max(0, pointerLine - 1)
    });
  }

  setCursorDown(){
    const { lines, pointerLine } = this.state;
    const newLinePos = pointerLine + 1;
    if(lines.length === newLinePos){
      lines[newLinePos] = '';
    }
    this.setState({
      pointerLine: newLinePos
    });
  }

  backspace(){
    const { lines, pointerLine, pointerColumn } = this.state;
    if(pointerColumn > 0){
      const targetLine = lines[pointerLine];
      if(pointerColumn < targetLine.length){
        lines[pointerLine] = targetLine.slice(0, pointerColumn - 1) + targetLine.slice(pointerColumn);
      } else {
        lines[pointerLine] = targetLine.slice(0, pointerColumn - 1);
      }
    } else {
      const prevLineNum = Math.max(0, pointerLine - 1);
      const prevLine = lines[prevLineNum] || '';
      this.setState({
        pointerLine: prevLineNum,
        pointerColumn: prevLine.length
      });
    }
  }

  clearEol(){
    const { lines, pointerLine, pointerColumn } = this.state;
    const line = lines[pointerLine] || '';
    if(pointerColumn < line.length){
      lines[pointerLine] = line.slice(0, pointerColumn);
    }
  }

  clearBelow(){
    const { lines, pointerLine } = this.state;
    const newLines = lines.slice(0, Math.min(pointerLine + 1, lines.length));
    this.setState({
      lines: newLines
    });
  }

  processEvent(evt){
    switch(evt.type){
      case 'text':
        this.addText(evt.data);
        break;
      case 'linefeed':
        this.addLinefeed();
        break;
      case 'cursor-home':
        this.setCursorHome();
        break;
      case 'cursor-left':
        this.setCursorLeft();
        break;
      case 'cursor-right':
        this.setCursorRight();
        break;
      case 'cursor-up':
        this.setCursorUp();
        break;
      case 'cursor-down':
        this.setCursorDown();
        break;
      case 'clear-screen':
        this.clearAll();
        break;
      case 'backspace':
        this.backspace();
        break;
      case 'clear-eol':
        this.clearEol();
        break;
      case 'clear-below':
        this.clearBelow();
        break;
      default:
        console.log('Not yet implemented:', evt);
        break;
    }
  }

  addText(data){
    const { lines, pointerLine, pointerColumn, trimCount, maxLines } = this.state;
    const line = lines[pointerLine] || '';
    if(pointerColumn < line.length){
      const start = line.slice(0, pointerColumn);
      const end = line.slice(pointerColumn);
      lines[pointerLine] = start + data + end;
    }else if(pointerColumn > line.length){
      lines[pointerLine] = _.padRight(line, pointerColumn) + data;
    }else{
      lines[pointerLine] = line + data;
    }

    if(lines.length > maxLines){
      const newLines = lines.slice(trimCount);
      this.setState({
        lines: newLines,
        pointerLine: Math.max(0, pointerLine - trimCount),
        pointerColumn: pointerColumn + data.length
      });
    }else{
      this.setState({
        pointerColumn: pointerColumn + data.length
      });
    }
  }

  updateText(){
    const { lines } = this.state;
    const text = lines.join('\n');

    this.setState({
      text: text,
      length: text.length
    });
  }

}

ConsoleStore.config = {
  stateKey: 'state'
};

module.exports = alt.createStore(ConsoleStore);
