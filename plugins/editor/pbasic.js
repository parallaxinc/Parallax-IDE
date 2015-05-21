// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE
"use strict";

module.exports = function(CodeMirror){

  CodeMirror.defineMode("pbasic", function(conf, parserConf) {
    var ERRORCLASS = 'error';

    function wordRegexp(words) {
      return new RegExp("^((" + words.join(")|(") + "))\\b", "i");
    }

    function getWordRange(word, start, end, base){
      var words = [];

      if (base) {
        words.push(word)
      };

      for (var i = start; i < end + 1; i++) {
        words.push(word + i);
      };
      return words;
    }

    var singleOperators = new RegExp("^[\\+\\-\\*/%&\\\\|\\^~<>!]");
    var singleDelimiters = new RegExp('^[\\(\\)\\[\\]\\{\\}@,:`=;\\.]');
    var doubleOperators = new RegExp("^((==)|(<>)|(<=)|(>=)|(<>)|(<<)|(>>)|(//)|(\\*\\*))");
    var doubleDelimiters = new RegExp("^((\\+=)|(\\-=)|(\\*=)|(%=)|(/=)|(&=)|(\\|=)|(\\^=))");
    var tripleDelimiters = new RegExp("^((//=)|(>>=)|(<<=)|(\\*\\*=))");
    var identifiers = new RegExp("^[_A-Za-z][_A-Za-z0-9]*");

    var openingKeywords = ['select','#select','while','if','#if'];
    var middleKeywords = ['else','#else','elseif','case', '#case'];
    var endKeywords = ['next','loop','endselect','#endselect', 'endif', '#endif'];

    var etInstruction = ['DATA','FOR','NEXT','GOTO','GOSUB','RETURN','IF','BRANCH','LOOKUP','LOOKDOWN',
      'RANDOM','READ','WRITE','PAUSE','INPUT','OUTPUT','LOW','HIGH','TOGGLE','REVERSE','SEROUT','SERIN',
      'PULSOUT','PULSIN','COUNT','SHIFTOUT','SHIFTIN','RCTIME','BUTTON','PWM','FREQOUT','DTMFOUT','XOUT',
      'DEBUG','STOP','NAP','SLEEP','END','TO','STEP','THEN','DO','EXIT','LOOP','UNTIL','WHILE','ELSE',
      'ELSEIF','ENDIF','SELECT','CASE','ENDSELECT','ON'];

    var etDirective = ['STAMP', 'PORT', 'PBASIC'];
    var etTargetModule = ['BS1','BS2','BS2E','BS2SX', 'BS2P', 'BS2PE','BS2PX'];
    var etIOFormatter = ['ASC', 'STR','REP', 'SKIP', 'WAITSTR','WAIT','NUM','SNUM']
      .concat(getWordRange('DEC', 1, 5, true))
      .concat(getWordRange('BIN', 1, 16, true))
      .concat(getWordRange('IBIN', 1, 16, true))
      .concat(getWordRange('ISBIN', 1, 16, true))
      .concat(getWordRange('ISHEX', 1, 4, true))
      .concat(getWordRange('IHEX', 1, 4, true))
      .concat(getWordRange('IBIN', 1, 16, true))
      .concat(getWordRange('HEX', 1, 4, true))
      .concat(getWordRange('SHEX', 1, 4, true))
      .concat(getWordRange('SBIN', 1, 16, true))
      .concat(getWordRange('SDEC', 1, 5, true));

    var etVariable = ['INA', 'INB', 'INC', 'IND', 'OUTA', 'OUTB', 'OUTC', 'OUTD',
      'DIRA', 'DIRB', 'DIRC', 'DIRD', 'INL', 'INH', 'OUTL', 'OUTH', 'DIRL', 'DIRH',
      'INS', 'OUTS', 'DIRS']
      .concat(getWordRange('B', 0, 25))
      .concat(getWordRange('DIR', 0, 15))
      .concat(getWordRange('W', 0, 12))
      .concat(getWordRange('OUT', 0, 15))
      .concat(getWordRange('IN', 0, 16));

    var etConstant = ['CLS','HOME','BELL','BKSP','TAB','CR','UNITON','UNITOFF','UNITSOFF',
      'LIGHTSON','DIM','BRIGHT','LSBFIRST','MSBFIRST','MSBPRE','LSBPRE','MSBPOST','LSBPOST',
      'DEBUGIN','CRSRXY','CRSRLF','CRSRRT','CRSRUP','CRSRDN','LF','CLREOL','CLRDN','CRSRX','CRSRY'];

    var etCCDirective = ['#DEFINE', '#ERROR', '#IF', '#THEN', '#ELSE', '#ENDIF', '#SELECT',
      '#CASE', '#ENDSELECT'];

    var wordOperators = wordRegexp(['and', 'or', 'not', 'xor']);

    var stringPrefixes = '"';

    var opening = wordRegexp(openingKeywords);
    var middle = wordRegexp(middleKeywords);
    var closing = wordRegexp(endKeywords);
    var etdirective = wordRegexp(etDirective);
    var ettargetmodule = wordRegexp(etTargetModule);
    var etioformatter = wordRegexp(etIOFormatter);
    var etvariable = wordRegexp(etVariable);
    var etccdirective = wordRegexp(etCCDirective);
    var etconstant = wordRegexp(etConstant);
    var etinstruction = wordRegexp(etInstruction);
    var doubleClosing = wordRegexp(['END']);
    var doOpening = wordRegexp(['DO']);

    var indentInfo = null;

    function indent(_stream, state) {
      state.currentIndent++;
    }

    function dedent(_stream, state) {
      state.currentIndent--;
    }
    // tokenizers
    function tokenBase(stream, state) {
      if (stream.eatSpace()) {
        return null;
      }

      var ch = stream.peek();

      // Handle Comments
      if (ch === "'") {
        stream.skipToEnd();
        return 'comment';
      }

      // Handle Number Literals
      if (stream.match(/^((&H)|(&O))?[0-9\.a-f]/i, false)) {
        var floatLiteral = false;
        // Floats
        if (stream.match(/^\d*\.\d+F?/i)) { floatLiteral = true; }
        else if (stream.match(/^\d+\.\d*F?/)) { floatLiteral = true; }
        else if (stream.match(/^\.\d+F?/)) { floatLiteral = true; }

        if (floatLiteral) {
          // Float literals may be "imaginary"
          stream.eat(/J/i);
          return 'number';
        }
        // Integers
        var intLiteral = false;
        // Hex
        if (stream.match(/^&H[0-9a-f]+/i)) { intLiteral = true; }
        // Octal
        else if (stream.match(/^&O[0-7]+/i)) { intLiteral = true; }
        // Decimal
        else if (stream.match(/^[1-9]\d*F?/)) {
          // Decimal literals may be "imaginary"
          stream.eat(/J/i);
          // TODO - Can you have imaginary longs?
          intLiteral = true;
        }
        // Zero by itself with no other piece of number.
        else if (stream.match(/^0(?![\dx])/i)) { intLiteral = true; }
        if (intLiteral) {
          // Integer literals may be "long"
          stream.eat(/L/i);
          return 'number';
        }
      }

      // Handle Strings
      if (stream.match(stringPrefixes)) {
        state.tokenize = tokenStringFactory(stream.current());
        return state.tokenize(stream, state);
      }

      // Handle operators and Delimiters
      if (stream.match(tripleDelimiters) || stream.match(doubleDelimiters)) {
        return null;
      }



      if (stream.match(doubleOperators)
        || stream.match(singleOperators)
        || stream.match(wordOperators)) {
        return 'operator';
      }
      if (stream.match(singleDelimiters)) {
        return null;
      }

      if (stream.match(etdirective)) {
        return 'etDirective';
      }
      if (stream.match(ettargetmodule)) {
        return 'etTargetModule';
      }
      if (stream.match(etvariable)) {
        return 'etVariable';
      }
      if (stream.match(etioformatter)) {
        return 'etIOFormatter';
      }
      if (stream.match(etccdirective)) {
        return 'etCCDirective';
      }
      if (stream.match(etconstant)) {
        return 'etConstant';
      }
      if (stream.match(etinstruction)) {
        return 'etInstruction';
      }
      if (stream.match(doOpening)) {
        indent(stream,state);
        state.doInCurrentLine = true;
        return 'keyword';
      }
      if (stream.match(opening)) {
        if (! state.doInCurrentLine)
          indent(stream,state);
        else
          state.doInCurrentLine = false;
        return 'keyword';
      }
      if (stream.match(middle)) {
        return 'keyword';
      }

      if (stream.match(doubleClosing)) {
        dedent(stream,state);
        dedent(stream,state);
        return 'keyword';
      }
      if (stream.match(closing)) {
        dedent(stream,state);
        return 'keyword';
      }

      if (stream.match(identifiers)) {
        return 'variable';
      }



      // Handle non-detected items
      stream.next();
      return ERRORCLASS;
    }

    function tokenStringFactory(delimiter) {
      var singleline = delimiter.length == 1;
      var OUTCLASS = 'string';

      return function(stream, state) {
        while (!stream.eol()) {
          stream.eatWhile(/[^'"]/);
          if (stream.match(delimiter)) {
            state.tokenize = tokenBase;
            return OUTCLASS;
          } else {
            stream.eat(/['"]/);
          }
        }
        if (singleline) {
          if (parserConf.singleLineStringErrors) {
            return ERRORCLASS;
          } else {
            state.tokenize = tokenBase;
          }
        }
        return OUTCLASS;
      };
    }

    function tokenLexer(stream, state) {
      var style = state.tokenize(stream, state);
      var current = stream.current();

      // Handle '.' connected identifiers
      if (current === '.') {
        style = state.tokenize(stream, state);
        current = stream.current();
        if (style === 'variable') {
          return 'variable';
        } else {
          return ERRORCLASS;
        }
      }


      var delimiter_index = '[({'.indexOf(current);
      if (delimiter_index !== -1) {
        indent(stream, state );
      }
      if (indentInfo === 'dedent') {
        if (dedent(stream, state)) {
          return ERRORCLASS;
        }
      }
      delimiter_index = '])}'.indexOf(current);
      if (delimiter_index !== -1) {
        if (dedent(stream, state)) {
          return ERRORCLASS;
        }
      }

      return style;
    }

    var external = {
      electricChars:"dDpPtTfFeE ",
      startState: function() {
        return {
          tokenize: tokenBase,
          lastToken: null,
          currentIndent: 0,
          nextLineIndent: 0,
          doInCurrentLine: false
        };
      },

      token: function(stream, state) {
        if (stream.sol()) {
          state.currentIndent += state.nextLineIndent;
          state.nextLineIndent = 0;
          state.doInCurrentLine = 0;
        }
        var style = tokenLexer(stream, state);

        state.lastToken = {style:style, content: stream.current()};

        return style;
      },

      indent: function(state, textAfter) {
        var trueText = textAfter.replace(/^\s+|\s+$/g, '') ;
        if (trueText.match(closing) || trueText.match(doubleClosing) || trueText.match(middle)) return conf.indentUnit*(state.currentIndent-1);
        if(state.currentIndent < 0) return 0;
        return state.currentIndent * conf.indentUnit;
      }

    };
    return external;
  });

  CodeMirror.defineMIME("text/pbasic", "pbasic");

}

