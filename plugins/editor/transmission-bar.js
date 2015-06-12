'use strict';

const React = require('react');

const styles = require('./styles');

class TransmissionBar extends React.Component {

  render() {
    const baudRate = 115200;
    const { rx, tx } = this.props;

    let indicatorRx = [styles.indicator];
    let indicatorTx = [styles.indicator];
    if(rx) {
      indicatorRx.push(styles.rx);
    }
    if(tx) {
      indicatorTx.push(styles.tx);
    }

    return (
      <div style={styles.bar}>
        <span style={styles.baud}>
          BAUD <span style={styles.baudRate}>{baudRate}</span>
        </span>
        <span style={styles.rxtx}>
          TX<span styles={indicatorTx} />RX<span styles={indicatorRx} />
        </span>
      </div>
    );
  }
}

module.exports = TransmissionBar;
