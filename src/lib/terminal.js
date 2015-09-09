'use strict';

const _ = require('lodash');

const TAB_WIDTH = 8;

class Terminal {
  constructor() {
    this.state = {
      lastRefresh: 0,
      lines: [''],
      lineWrap: 256,
      lineOffset: 0,
      maxLines: 10000,
      pointerLine: 0,
      pointerColumn: 0,
      refreshDelayMillis: 64,
      refreshQueued: null,
      trimCount: 64
    };

    this.queue = this.queue.bind(this);
  }

  queue(cb){
    this.state.lastRefresh = Date.now();
    this.state.refreshQueued = null;
    cb();
  }

  clearAll(){
    const { refreshQueued } = this.state;

    this.state.lines = [''];
    this.state.lineOffset = 0;
    this.state.pointerLine = 0;
    this.state.pointerColumn = 0;

    if(refreshQueued != null){
      clearInterval(refreshQueued);
      this.state.refreshQueued = null;
    }
    this.state.lastRefresh = 0;
  }

  refreshBuffer(msg, cb) {
    const { lastRefresh, refreshDelayMillis, refreshQueued } = this.state;

    this._update(msg);

    if(refreshQueued != null){
      return;
    }

    // TODO: remove zalgo
    if(lastRefresh < Date.now() - refreshDelayMillis){
      this.queue(cb);
    } else {
      this.state.refreshQueued = setTimeout(this.queue, refreshDelayMillis, cb);
    }
  }

  _update(events) {
    if(Array.isArray(events)){
      _.forEach(events, this.processEvent, this);
    }else{
      this.processEvent(events);
    }
  }

  setCursorPosition(line, col){
    const { lines } = this.state;
    for(let ix = lines.length; ix <= line; ix++){
      lines[ix] = '';
    }
    this.state.pointerLine = Math.max(0, line);
    this.state.pointerColumn = Math.min(255, Math.max(0, col));
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
      this.state.pointerColumn = pointerColumn - 1;
    } else {
      const prevLineNum = Math.max(0, pointerLine - 1);
      const prevLine = lines[prevLineNum] || '';
      this.state.pointerLine = prevLineNum;
      this.state.pointerColumn = prevLine.length;
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
    this.state.lines = newLines;
  }

  tab(){
    const { pointerColumn } = this.state;
    const tabColumn = Math.floor(pointerColumn / TAB_WIDTH);
    this.state.pointerColumn = (tabColumn + 1) * TAB_WIDTH;
  }

  processEvent(evt){
    const { pointerLine, pointerColumn } = this.state;
    switch(evt.type){
      case 'text':
        this.addText(evt.data);
        break;
      case 'linefeed':
        this.setCursorPosition(pointerLine + 1, 0);
        break;
      case 'cursor-home':
        this.setCursorPosition(0, 0);
        break;
      case 'cursor-position':
        this.setCursorPosition(evt.data[1], evt.data[0]);
        break;
      case 'cursor-position-x':
        this.setCursorPosition(pointerLine, evt.data[0]);
        break;
      case 'cursor-position-y':
        this.setCursorPosition(evt.data[0], pointerColumn);
        break;
      case 'cursor-left':
        this.setCursorPosition(pointerLine, pointerColumn - 1);
        break;
      case 'cursor-right':
        this.setCursorPosition(pointerLine, pointerColumn + 1);
        break;
      case 'cursor-up':
        this.setCursorPosition(pointerLine - 1, pointerColumn);
        break;
      case 'cursor-down':
        this.setCursorPosition(pointerLine + 1, pointerColumn);
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
      case 'tab':
        this.tab();
        break;
      default:
        console.log('Not yet implemented:', evt);
        break;
    }
  }

  addText(newText){
    const { lines, lineWrap, trimCount, maxLines } = this.state;

    let { pointerColumn, pointerLine } = this.state;

    while(newText.length > 0){
      let oldLine = lines[pointerLine] || '';
      let initial = _.padRight(oldLine.slice(0, pointerColumn), pointerColumn);

      let insert = newText.slice(0, Math.max(lineWrap - initial.length, 0));

      let remainder = oldLine.slice(insert.length + initial.length);

      let leftOver = newText.slice(insert.length);

      lines[pointerLine] = initial + insert + remainder;

      newText = leftOver;
      if(newText.length > 0){
        pointerLine++;
        pointerColumn = 0;
      }else{
        pointerColumn = initial.length + insert.length;
      }
    }

    if(lines.length > maxLines){
      const newLines = lines.slice(trimCount);
      this.state.lines = newLines;
      this.state.lineOffset = this.state.lineOffset + trimCount;
      this.state.pointerLine = Math.max(0, pointerLine - trimCount);
      this.state.pointerColumn = pointerColumn;
    } else {
      this.state.pointerLine = pointerLine;
      this.state.pointerColumn = pointerColumn;
    }
  }

  getLines(){
    return this.state.lines;
  }

  getOffset(){
    return this.state.lineOffset;
  }

}

module.exports = Terminal;
