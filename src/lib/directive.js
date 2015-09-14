'use strict';

function device(type){
  return `'{$STAMP ${type}}`;
}

function pbasic(ver){
  return `'{$PBASIC ${ver}}`;
}

function directive(board, language){
  return `${device(board)}\n${pbasic(language)}\n\n`;
}

module.exports = directive;
