'use strict';

function ConsoleBuffer(options){
  var opts = options || {};
  this._length = 0;
  this._text = '';
  this._bufferSize = opts.bufferSize || 2048;
  this._trimOffset = opts.trimOffset || 256;

  if(this._bufferSize < 1){
    throw new Error('Invalid buffer length!');
  }
  if(this._trimOffset < 0 || this._trimOffset >= this._bufferSize){
    throw new Error('Invalid trim offset length!');
  }
}

ConsoleBuffer.prototype.update = function(evt){
  //assume text events for now
  var text = evt.data || '';
  this._text += text;

  if(this._text.length > this._bufferSize){
    this._text = this._text.substr(this._text.length - (this._bufferSize - this._trimOffset));
  }
  this._length = this._text.length;
};

ConsoleBuffer.prototype.clear = function(){
  this._length = 0;
  this._text = '';
};

ConsoleBuffer.prototype.getConsoleHTML = function(){
  return this._text;
};


module.exports = ConsoleBuffer;
