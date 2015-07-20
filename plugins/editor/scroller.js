'use strict';

var _ = require('lodash');

function generateContent(lines, start, minLength) {
  return _(lines)
    .slice(start)
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

var Scroller = function() {
  this.lines = [];
  this.minVisible = 30;
  this.startPosition = 0;
  this.animateRequest = null;
  this.sticky = true;
  this.jumpToBottom = true;
  this.dirty = false;
  this.console = null;
  this.refresh = this.renderVisible.bind(this);
  this.scroll = this.onScroll.bind(this);
  this.expand = _.throttle(this._expand.bind(this), 100, {
    leading: true,
    trailing: false
  });
};

Scroller.prototype.setLines = function(newLines) {
  var len = newLines.length;
  if(this.sticky){
    this.startPosition = Math.max(0, len - this.minVisible);
  }
  this.lines = newLines;
  this.dirty = true;
};

Scroller.prototype.reset = function(clearLines){
  this.visibleCount = this.minVisible;
  this.sticky = true;
  this.dirty = true;
  if(clearLines){
    this.lines = [];
    this.startPosition = 0;
  }
  if(this.console){
    this.animateRequest = requestAnimationFrame(this.refresh);
  }
};

Scroller.prototype.requestRefresh = function(){
  if(this.console){
    this.animateRequest = requestAnimationFrame(this.refresh);
  }
};

Scroller.prototype.renderVisible = function(){
  this.animateRequest = null;
  if(this.dirty && this.console){
    if(this.sticky){
      this.startPosition = Math.max(0, this.lines.length - this.minVisible);
    }
    this.console.innerHTML = generateContent(this.lines, this.startPosition, this.minVisible);
    if(this.jumpToBottom){
      this.console.scrollTop = 350000;
      this.jumpToBottom = false;
    }
    this.dirty = false;
  }
};

Scroller.prototype._expand = function(){
  this.startPosition = Math.max(0, this.startPosition - this.minVisible);
  this.sticky = false;
  if(this.console){
    var scrollHeight = this.console.scrollHeight;
    var scrollTop = this.console.scrollTop;

    // do an inline scroll to avoid potential scroll interleaving
    this.console.innerHTML = generateContent(this.lines, this.startPosition, this.minVisible);
    var newScrollHeight = this.console.scrollHeight;
    this.console.scrollTop = scrollTop + newScrollHeight - scrollHeight;

    this.dirty = false;
  }
  if(!this.animateRequest){
    this.animateRequest = requestAnimationFrame(this.refresh);
  }
};

Scroller.prototype.onScroll = function(){
  var height = this.console.offsetHeight;
  var scrollHeight = this.console.scrollHeight;
  var scrollTop = this.console.scrollTop;
  if(scrollTop < 15 && this.startPosition > 0){
    this.expand();
  }else if(scrollTop + height > scrollHeight - 15){
    if(!this.sticky){
      this.jumpToBottom = true;
      this.sticky = true;
      this.dirty = true;
    }
  }

  if(this.dirty){
    this.animateRequest = requestAnimationFrame(this.refresh);
  }
};

Scroller.prototype.setConsole = function(console){
  this.console = console;
};

module.exports = Scroller;
