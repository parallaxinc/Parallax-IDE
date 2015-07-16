'use strict';

/* NOT IMPLEMENTING A FLUX STORE */

const CodeMirror = require('codemirror');

class DocumentsStore {
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

  swap(filename) {
    this._filename = filename;

    const doc = this._documents[filename];

    if(!doc){
      return;
    }

    this._editor.swapDoc(doc);
    return doc;
  }
}

module.exports = DocumentsStore;
