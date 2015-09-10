'use strict';

const _ = require('lodash');

function Scroller(consoleElement) {
  this.lines = [];
  this.lineOffset = 0;
  this.visibleCount = 50;
  this.startPosition = 0;
  this.endPosition = 0;
  this.animateRequest = null;
  this.sticky = true;
  this.jumpToBottom = true;
  this.dirty = false;
  this.console = consoleElement;
  this.expandDistance = 200;

  //pre-bind functions
  this.refresh = this._renderVisible.bind(this);
  this.scroll = this._onScroll.bind(this);
  this.expandTop = this._expandTop.bind(this);
  this.expandBottom = this._expandBottom.bind(this);
}

Scroller.prototype._generateContent = function(){
  return _(this.lines)
    .slice(this.startPosition - this.lineOffset, this.endPosition - this.lineOffset)
    .map(function(line){
      if(line.length === 0){
        // insert a blank space to prevent pre omitting a trailing newline,
        // even though pre/pre-nowrap/pre-line are specified.
        return '\u2009';
      }
      return line;
    })
    .join('\n');
};

Scroller.prototype.setLines = function(newLines, offset) {
  this.lines = newLines;
  this.lineOffset = offset;
  if(this.sticky){
    this.endPosition = this.lineCount();
    this.startPosition = Math.max(this.lineOffset, this.endPosition - this.visibleCount);
    if(this.endPosition <= this.visibleCount * 2){
      // follow text during initial lines (console can show up to twice the visibleCount when expanding)
      this.jumpToBottom = true;
    }
  }else if(newLines.length === 1 && newLines[0].length === 0){
    // ^^ `lines` is reset to an array with one empty line. ugh.

    // handle the reset case when lines is replaced with an empty array
    // we don't have a direct event that can call this
    this.reset();
  }else if(this.lineOffset > this.startPosition){
    // when buffer trims and we are now below the trimmed area, move up by difference
    const lineDiff = this.lineOffset - this.startPosition;
    this.startPosition += lineDiff;
    this.endPosition += lineDiff;
  }
  this.dirty = true;
};

Scroller.prototype.lineCount = function(){
  return this.lines.length + this.lineOffset;
};

Scroller.prototype.reset = function(){
  this.endPosition = Math.max(0, this.lineCount());
  this.startPosition = Math.max(0, this.endPosition - this.visibleCount);
  this.lineOffset = 0;
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
    if(this.sticky){
      this.endPosition = this.lineCount();
      this.startPosition = Math.max(this.lineOffset, this.endPosition - this.visibleCount);
    }
    this.console.innerHTML = this._generateContent();
    if(this.jumpToBottom){
      this.console.scrollTop = 4000;
      this.jumpToBottom = false;
    }
    this.dirty = false;
  }
};

Scroller.prototype._expandTop = function(){
  this.startPosition = Math.max(this.lineOffset, this.startPosition - this.visibleCount);
  if(this.console){
    this.sticky = false;
    const scrollHeight = this.console.scrollHeight;
    const scrollTop = this.console.scrollTop;

    // do an inline scroll to avoid potential scroll interleaving
    this.console.innerHTML = this._generateContent();
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
  this.endPosition = Math.min(this.lineCount(), this.endPosition + this.visibleCount);
  if(this.console){
    // add the new content to the bottom, then get scroll position to remove content
    this.console.innerHTML = this._generateContent();
    const scrollHeight = this.console.scrollHeight;
    const scrollTop = this.console.scrollTop;

    // update start position and render
    this.startPosition = Math.max(this.lineOffset, Math.min(this.lineCount() - (this.visibleCount * 2), this.endPosition - (this.visibleCount * 2)));
    this.console.innerHTML = this._generateContent();

    // use difference to scroll offset
    const newScrollHeight = this.console.scrollHeight;
    this.console.scrollTop = scrollTop - (scrollHeight - newScrollHeight);

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
  const nearTop = scrollTop < this.expandDistance;
  const nearBottom = scrollTop + height > scrollHeight - this.expandDistance;
  const nearSticky = scrollTop + height > scrollHeight - 10;

  if(this.sticky){
    if(!nearSticky){
      this.sticky = false;
    }
  }else{
    if(nearTop && this.startPosition > this.lineOffset){
      this.expandTop();
    }else if(nearBottom){
      if(this.endPosition < this.lineCount() - 2){
        this.expandBottom();
      }else if(nearSticky){
        this.jumpToBottom = true;
        this.sticky = true;
        this.dirty = true;
      }
    }
  }

  

  if(this.dirty && !this.animateRequest){
    this.animateRequest = requestAnimationFrame(this.refresh);
  }
};

module.exports = Scroller;
