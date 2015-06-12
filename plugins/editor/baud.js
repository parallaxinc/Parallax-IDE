'use strict';

const React = require('react');

const styles = require('./styles');

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
