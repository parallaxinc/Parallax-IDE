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

  //pre-bind functions and throttle expansion
  this.refresh = this._renderVisible.bind(this);
  this.scroll = this._onScroll.bind(this);
  this.expandTop = _.throttle(this._expandTop.bind(this), 150, {
    leading: true,
    trailing: true
  });
  this.expandBottom = _.throttle(this._expandBottom.bind(this), 150, {
    leading: true,
    trailing: true
  });
}

Scroller.prototype._generateContent = function(){
  const visible = this.visibleCount;
  return _(this.lines)
    .slice(this.startPosition - this.lineOffset, this.endPosition - this.lineOffset)
    .thru(function(array){
      if(array.length < visible){
        // pad whitespace at top of array
        return _(new Array(visible - array.length))
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
};

Scroller.prototype.setLines = function(newLines, offset) {
  this.lines = newLines;
  this.lineOffset = offset;
  if(this.sticky){
    this.startPosition = Math.max(this.lineOffset, this.lineCount() - this.visibleCount);
    this.endPosition = this.lineCount();
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
  this.startPosition = Math.max(0, this.lineCount() - this.visibleCount);
  this.endPosition = Math.max(0, this.lineCount());
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
    const top = this.console.scrollTop;
    if(this.sticky){
      this.startPosition = Math.max(this.lineOffset, this.lineCount() - this.visibleCount);
      this.endPosition = this.lineCount();
    }
    this.console.innerHTML = this._generateContent();
    if(this.jumpToBottom){
      this.console.scrollTop = 2000;
      this.jumpToBottom = false;
    }else if(!this.sticky && this.startPosition > this.lineOffset && top === this.lineOffset){
      //cover the situation where the window was fully scrolled faster than expand could keep up and locked to the top
      requestAnimationFrame(this.expandTop);
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
  if(this.sticky){
    if(scrollTop + height < scrollHeight - 30){
      this.sticky = false;
    }
  }else{
    if(scrollTop < 15 && this.startPosition > this.lineOffset){
      this.expandTop();
    }else if(scrollTop + height > scrollHeight - 30){
      if(this.endPosition < this.lineCount() - 2){
        this.expandBottom();
      }else{
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
