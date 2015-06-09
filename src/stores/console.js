'use strict';

const _ = require('lodash');

const alt = require('../alt');
const { clearOutput, output } = require('../actions/console');

class ConsoleStore {
  constructor() {

    this.bindListeners({
      onClearOutput: clearOutput,
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

  onClearOutput() {
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

  processEvent(evt){
    const { lines, pointerLine, pointerColumn } = this.state;
    switch(evt.type){
      case 'text':
        this.addText(evt.data);
      break;
      case 'linefeed':
        this.setState({
          pointerLine: pointerLine + 1,
          pointerColumn: 0
        });
      break;
      case 'cursor-home':
        this.setState({
          pointerLine: 0,
          pointerColumn: 0
        });
      break;
      case 'cursor-left':
        this.setState({
          pointerColumn: Math.max(0, pointerColumn - 1)
        });
      break;
      case 'cursor-right':
        this.setState({
          pointerColumn: Math.min(255, pointerColumn + 1)
        });
      break;
      case 'cursor-up':
        this.setState({
          pointerLine: Math.max(0, pointerLine - 1)
        });
      break;
      case 'cursor-down':
        var newLen = pointerLine + 1;
        if(lines.length <= newLen){
          _.fill(lines, '', lines.length, newLen);
        }
        this.setState({
          pointerLine: newLen
        });
      break;
      case 'clear-screen':
        this.onClearOutput();
      break;
      case 'backspace':
        if(pointerColumn > 0){
          var targetLine = lines[pointerLine];
          if(pointerColumn < targetLine.length){
            lines[pointerLine] = targetLine.slice(0, pointerColumn - 1) + targetLine.slice(pointerColumn);
          }else{
            lines[pointerLine] = targetLine.slice(0, pointerColumn - 1);
          }
        }else{
          var prevLineNum = Math.max(0, pointerLine - 1);
          var prevLine = lines[prevLineNum] || '';
          this.setState({
            pointerLine: prevLineNum,
            pointerColumn: prevLine.length
          });
        }
      break;
      case 'clear-eol':
        var line = lines[pointerLine] || '';
        if(pointerColumn < line.length){
          lines[pointerLine] = line.slice(0, pointerColumn);
        }
      break;
      case 'clear-below':
        var newLines = lines.slice(0, Math.min(pointerLine + 1, lines.length));
        this.setState({
          lines: newLines
        });
      break;
      default:
        console.log('Not yet implemented:', evt);
      break;
    }
  }

  addText(data){
    const { lines, pointerLine, pointerColumn, trimCount, maxLines } = this.state;
    var line = lines[pointerLine] || '';
    if(pointerColumn < line.length){
      var start = line.slice(0, pointerColumn);
      var end = line.slice(pointerColumn);
      lines[pointerLine] = start + data + end;
    }else if(pointerColumn > line.length){
      lines[pointerLine] = _.padRight(line, pointerColumn) + data;
    }else{
      lines[pointerLine] = line + data;
    }

    if(lines.length > maxLines){
      var newLines = lines.slice(trimCount);
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
    var text = _.reduce(lines, function(result, line){
      return result + '\n' + line;
    }, '');

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
