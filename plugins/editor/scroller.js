'use strict';

function generateContent(lines, num) {
  return lines.slice(-num).join('\n');
}

var Scroller = function() {
  this.lines = [];
  this.minVisible = 30;
  this.visibleCount = this.minVisible;
  this.sticky = true;
  this.dirty = false;
  this.console = null;
  this.refresh = this.renderVisible.bind(this);
  this.scroll = this.onScroll.bind(this);
};

Scroller.prototype.setLines = function(lines) {
  if(this.sticky){
    this.visibleCount = this.minVisible;
  }else{
    //keep sticky position within view
    this.visibleCount += Math.max(0, lines.length - this.lines.length);
  }
  this.lines = lines;
  this.dirty = true;
};

Scroller.prototype.renderVisible = function(){
  if(this.dirty && this.console){
    this.console.innerHTML = generateContent(this.lines, this.visibleCount);
    if(this.sticky){
      this.console.scrollTop = 350000;
    }
    this.dirty = false;
  }
};

Scroller.prototype.onScroll = function(){
  var height = this.console.offsetHeight;
  var scrollHeight = this.console.scrollHeight;
  var scrollTop = this.console.scrollTop;
  if(scrollTop < 30 && this.visibleCount < this.lines.length){
    this.visibleCount += this.minVisible;
    this.sticky = false;
    this.dirty = true;
  }else if(scrollTop + height > scrollHeight - 30){
    if(!this.sticky){
      this.sticky = true;
      this.dirty = true;
    }
  }else{
    this.sicky = false;
  }

  if(this.dirty){
    requestAnimationFrame(this.refresh);
  }
};

Scroller.prototype.setConsole = function(console){
  this.console = console;
};

module.exports = Scroller;
