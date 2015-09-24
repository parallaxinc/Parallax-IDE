'use strict';

/*
  RxTx indicators were made a separate plugin for performance reasons

  They also don't use React
 */

const _ = require('lodash');

const consoleStore = require('../console-store');

const red = '#da2100';
const blue = 'rgb(44, 131, 216)';
const grey = '#666666';

const styles = {
  bar: {
    margin: '0',
    height: '25px',
    backgroundColor: '#CFD8DC'
  },
  indicator: {
    backgroundColor: grey,
    height: '10px',
    width: '10px',
    borderRadius: '100%',
    margin: '0px 10px',
    display: 'inline-block'
  },
  rxtx: {
    float: 'right',
    paddingTop: '3px'
  },
  echo: {
    display: 'inline-block',
    paddingTop: '3px',
    paddingLeft: '16px'
  },
  echoOn: {
    color: '#000000'
  },
  echoOff: {
    color: '#888888'
  },
  rx: {
    backgroundColor: blue
  },
  tx: {
    backgroundColor: red
  }
};

function applyStyles(el, stylesToApply){
  _.forEach(stylesToApply, (style, name) => el.style[name] = style);
}

function rxtxBar(app, opts, done){

  let bottomBar;
  let rx;
  let tx;
  let echoContainer, echoLabel;

  function onConsoleChange(){
    const { rxtx, echo } = consoleStore.getState();
    const { flashRx, flashTx } = rxtx;

    if(flashRx){
      rx.style.backgroundColor = styles.rx.backgroundColor;
    } else {
      rx.style.backgroundColor = styles.indicator.backgroundColor;
    }

    if(flashTx){
      tx.style.backgroundColor = styles.tx.backgroundColor;
    } else {
      tx.style.backgroundColor = styles.indicator.backgroundColor;
    }

    if(echo){
      applyStyles(echoContainer, styles.echoOn);
      echoLabel.nodeValue = 'Echo On';
    }else{
      applyStyles(echoContainer, styles.echoOff);
      echoLabel.nodeValue = 'Echo Off';
    }
  }

  app.view('editor', function(el, cb){

    if(!bottomBar){
      bottomBar = document.createElement('div');
      applyStyles(bottomBar, styles.bar);

      echoContainer = document.createElement('span');
      applyStyles(echoContainer, styles.echo);
      applyStyles(echoContainer, styles.echoOff);
      bottomBar.appendChild(echoContainer);

      echoLabel = document.createTextNode('Echo Off');
      echoContainer.appendChild(echoLabel);

      const rxtxContainer = document.createElement('span');
      applyStyles(rxtxContainer, styles.rxtx);
      bottomBar.appendChild(rxtxContainer);

      tx = document.createElement('span');
      rx = document.createElement('span');
      const txLabel = document.createTextNode('TX');
      const rxLabel = document.createTextNode(' RX');
      rxtxContainer.appendChild(txLabel);
      rxtxContainer.appendChild(tx);
      rxtxContainer.appendChild(rxLabel);
      rxtxContainer.appendChild(rx);
      applyStyles(tx, styles.indicator);
      applyStyles(rx, styles.indicator);

      el.appendChild(bottomBar);

      consoleStore.subscribe(onConsoleChange);
    }

    cb();
  });

  done();
}

module.exports = rxtxBar;
