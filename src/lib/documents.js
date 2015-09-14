'use strict';

const CodeMirror = require('codemirror');

class Documents {
  constructor(editor){
    this._editor = editor;

    this._filename = null;
    this._documents = {};
  }

  focus(){
    this._editor.focus();
  }

  update(text){
    if(!this._filename){
      return;
    }

    return this.create(this._filename, text);
  }

  create(filename, text){
    const mode = 'pbasic';

    this._documents[filename] = CodeMirror.Doc(text, mode);

    return this.swap(filename);
  }

  remove(filename){
    // TODO: remove something?
    delete this._documents[filename];
  }

  swap(filename) {
    this._filename = filename;

    const doc = this._documents[filename];

    if(!doc){
      return;
    }

    this._editor.swapDoc(doc);
    return doc;
  }

  replace(filename){
    this._documents[filename] = this._editor.getDoc();
  }
}

module.exports = Documents;
