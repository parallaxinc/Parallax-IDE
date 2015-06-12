'use strict';

const red = '#da2100';
const green = '#159600';
const blue = 'blue';

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
    backgroundColor: green,
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
  }
};

module.exports = styles;
