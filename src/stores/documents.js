'use strict';

/* NOT IMPLEMENTING A FLUX STORE */

const CodeMirror = require('codemirror');

class DocumentsStore {
  constructor(editor){
    this._editor = editor;

    this._documents = {};
  }

  focus(){
    this._editor.focus();
  }

  create(filename, text){
    const mode = 'pbasic';

    this._documents[filename] = CodeMirror.Doc(text, mode);

    return this.swap(filename);
  }

  swap(filename) {
    const doc = this._documents[filename];

    if(!doc){
      return;
    }

    this._editor.swapDoc(doc);
    return doc;
  }
}

module.exports = DocumentsStore;
