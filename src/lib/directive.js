'use strict';

function device(type){
  return `'{$STAMP ${type}}`;
}

function pbasic(ver){
  return `'{$PBASIC ${ver}}`;
}

function directive(board, language){
  return `${device(board)}\r${pbasic(language)}\r\r`;
}

module.exports = directive;