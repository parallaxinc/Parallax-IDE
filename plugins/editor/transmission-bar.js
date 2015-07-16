'use strict';

const React = require('react');

const Indicators = require('./indicators');
const styles = require('./styles');

class TransmissionBar extends React.Component {

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <div style={styles.bar}>
        <Indicators />
      </div>
    );
  }
}

module.exports = TransmissionBar;
