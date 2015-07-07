'use strict';

const red = '#da2100';
const blue = 'rgb(44, 131, 216)';
const grey = '#666666';

const styles = {
  bar: {
    margin: 0,
    height: '25px',
    backgroundColor: '#CFD8DC'
  },
  baud: {
    float: 'left',
    padding: '3px 0px 0px 10px',
    margin: 0
  },
  baudRate: {
    paddingLeft: 8
  },
  indicator: {
    backgroundColor: grey,
    height: 10,
    width: 10,
    borderRadius: '100%',
    margin: '0px 10px',
    display: 'inline-block'
  },
  rxtx: {
    float: 'right',
    paddingTop: 3
  },
  rx: {
    backgroundColor: blue
  },
  tx: {
    backgroundColor: red
  },
  transmit: {
    margin: 0,
    height: '32px',
    backgroundColor: 'rgba(255,203,0,.1)'
  },
  transmitInput: {
    border: '0px',
    backgroundColor: 'transparent',
    outline: 'none',
    resize: 'none',
    width: '100%',
    padding: '5px 10px',
    fontSize: 'inherit',
    fontFamily: 'inherit',
    boxSizing: 'border-box'
  }
};

module.exports = styles;
