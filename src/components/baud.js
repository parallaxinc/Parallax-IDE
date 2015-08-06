'use strict';

const React = require('react');

const styles = {
  baud: {
    float: 'left',
    padding: '3px 0px 0px 10px',
    margin: 0
  },
  baudRate: {
    paddingLeft: 8
  }
};

class Baud extends React.Component {

  render() {
    const baudRate = 115200;

    return (
      <span style={styles.baud}>
        BAUD <span style={styles.baudRate}>{baudRate}</span>
      </span>
    );
  }
}

module.exports = Baud;
