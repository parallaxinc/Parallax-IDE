'use strict';

const React = require('react');

const styles = require('./styles');

class Indicators extends React.Component {

  render() {
    const { flashRx, flashTx } = this.props;

    let indicatorRx = [styles.indicator];
    let indicatorTx = [styles.indicator];
    if(flashRx) {
      indicatorRx.push(styles.rx);
    }
    if(flashTx) {
      indicatorTx.push(styles.tx);
    }

    return (
      <span style={styles.rxtx}>
        TX<span styles={indicatorTx} />RX<span styles={indicatorRx} />
      </span>
    );
  }
}

module.exports = Indicators;
