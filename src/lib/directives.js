'use strict';

function device(type){
  return `'{$STAMP ${type}}`;
}

function pbasic(ver){
  return `'{$PBASIC ${ver}}`;
}

const directives = {
  boards: {
    bs2: device('BS2')
  },
  languages: {
    pbasic2_5: pbasic(2.5)
  }
};

module.exports = directives;