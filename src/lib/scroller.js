'use strict';

const _ = require('lodash');

function generateContent(lines, start, end, minLength) {
  return _(lines)
    .slice(start, end)
    .thru(function(array){
      if(array.length < minLength){
        // pad whitespace at top of array
        return _(new Array(minLength - array.length))
          .fill('\u2009')
          .concat(array)
          .value();
      }else{
        return array;
      }
    })
    .map(function(line){
      if(line.length === 0){
        // insert a blank space to prevent pre omitting a trailing newline,
        // even though pre/pre-nowrap/pre-line are specified.
        return '\u2009';
      }
      return line;
    })
    .join('\n');
}

function Scroller(consoleElement) {
  this.lines = [];
  this.visibleCount = 50;
  this.startPosition = 0;
  this.endPosition = 0;
  this.animateRequest = null;
  this.sticky = true;
  this.jumpToBottom = true;
  this.dirty = false;
  this.console = consoleElement;

  //pre-bind functions and throttle expansion
  this.refresh = this._renderVisible.bind(this);
  this.scroll = this._onScroll.bind(this);
  this.expandTop = _.throttle(this._expandTop.bind(this), 150, {
    leading: true,
    trailing: true
  });
}

Scroller.prototype.setLines = function(newLines) {
  const len = newLines.length;
  this.lines = newLines;
  if(this.sticky){
    this.startPosition = Math.max(0, len - this.visibleCount);
    this.endPosition = len;
  }else if(len === 1 && newLines[0].length === 0){
    // ^^ `lines` is reset to an array with one empty line. ugh.

    // handle the reset case when lines is replaced with an empty array
    // we don't have a direct event that can call this
    this.reset();
  }else if(len < this.startPosition){
    // handle buffer trim, where number of lines will go from 2048 to ~1900
    this.startPosition = Math.max(0, len - this.visibleCount);
    this.endPosition = len;
  }
  this.dirty = true;
};

Scroller.prototype.reset = function(){
  this.startPosition = Math.max(0, this.lines.length - this.visibleCount);
  this.endPosition = Math.max(0, this.lines.length);
  this.jumpToBottom = true;
  this.sticky = true;
  this.dirty = true;
};

Scroller.prototype.requestRefresh = function(){
  if(this.console){
    this.animateRequest = requestAnimationFrame(this.refresh);
  }
};

Scroller.prototype._renderVisible = function(){
  this.animateRequest = null;
  if(this.dirty && this.console){
    const top = this.console.scrollTop;
    if(this.sticky){
      this.startPosition = Math.max(0, this.lines.length - this.visibleCount);
      this.endPosition = this.lines.length;
    }
    this.console.innerHTML = generateContent(this.lines, this.startPosition, this.endPosition, this.visibleCount);
    if(this.jumpToBottom){
      this.console.scrollTop = 2000;
      this.jumpToBottom = false;
    }else if(!this.sticky && this.startPosition > 0 && top === 0){
      //cover the situation where the window was fully scrolled faster than expand could keep up and locked to the top
      requestAnimationFrame(this.expandTop);
    }
    this.dirty = false;
  }
};

Scroller.prototype._expandTop = function(){
  this.startPosition = Math.max(0, this.startPosition - this.visibleCount);
  if(this.console){
    this.sticky = false;
    const scrollHeight = this.console.scrollHeight;
    const scrollTop = this.console.scrollTop;

    // do an inline scroll to avoid potential scroll interleaving
    this.console.innerHTML = generateContent(this.lines, this.startPosition, this.endPosition, this.visibleCount);
    const newScrollHeight = this.console.scrollHeight;
    this.console.scrollTop = scrollTop + newScrollHeight - scrollHeight;

    const oldEndPos = this.endPosition;
    this.endPosition = Math.min(this.endPosition, this.startPosition + (this.visibleCount * 2));

    this.dirty = oldEndPos !== this.endPosition;
    if(this.dirty && !this.animateRequest){
      this.animateRequest = requestAnimationFrame(this.refresh);
    }
  }
};

Scroller.prototype._expandBottom = function(){
  this.startPosition = Math.max(0, this.startPosition + this.visibleCount);
  this.endPosition = Math.min(this.lines.length, this.endPosition + this.visibleCount);
  if(this.console){
    this.sticky = false;
    const scrollHeight = this.console.scrollHeight;
    const scrollTop = this.console.scrollTop;

    // do an inline scroll to avoid potential scroll interleaving
    this.console.innerHTML = generateContent(this.lines, this.startPosition, this.endPosition, this.visibleCount);
    const newScrollHeight = this.console.scrollHeight;
    this.console.scrollTop = scrollTop + newScrollHeight - scrollHeight;

    this.endPosition = Math.min(this.endPosition, this.startPosition + (this.visibleCount * 2));
    this.dirty = false;
  }
};

Scroller.prototype._onScroll = function(){
  if(this.jumpToBottom){
    // do nothing, prepare to jump
    return;
  }
  const height = this.console.offsetHeight;
  const scrollHeight = this.console.scrollHeight;
  const scrollTop = this.console.scrollTop;
  if(this.sticky){
    if(scrollTop + height < scrollHeight - 30){
      this.sticky = false;
    }
  }else{
    if(scrollTop < 15 && this.startPosition > 0){
      this.expandTop();
    }else if(scrollTop + height > scrollHeight - 30){
      this.jumpToBottom = true;
      this.sticky = true;
      this.dirty = true;
    }
  }

  if(this.dirty && !this.animateRequest){
    this.animateRequest = requestAnimationFrame(this.refresh);
  }
};

module.exports = Scroller;
