'use strict';

const _ = require('lodash');
const React = require('react');

const styles = require('./styles');
const transmissionStore = require('../../src/stores/transmission');

class Indicators extends React.Component {

  constructor(){
    this._updateIndicators = this._updateIndicators.bind(this);
  }

  _updateIndicators(){
    const { flashRx, flashTx } = transmissionStore.getState();
    if(flashRx){
      this.rx.style.backgroundColor = styles.rx.backgroundColor;
    } else {
      this.rx.style.backgroundColor = styles.indicator.backgroundColor;
    }
    if(flashTx){
      this.tx.style.backgroundColor = styles.tx.backgroundColor;
    } else {
      this.tx.style.backgroundColor = styles.indicator.backgroundColor;
    }
  }

  componentDidMount() {
    var parent = React.findDOMNode(this);
    var tx = this.tx = document.createElement('span');
    var rx = this.rx = document.createElement('span');
    this.txLabel = document.createTextNode('TX');
    this.rxLabel = document.createTextNode(' RX');
    parent.appendChild(this.txLabel);
    parent.appendChild(tx);
    parent.appendChild(this.rxLabel);
    parent.appendChild(rx);
    _.forEach(styles.indicator, function(style, name){
      tx.style[name] = style;
      rx.style[name] = style;
    });

    transmissionStore.listen(this._updateIndicators);
  }

  componentWillUnmount() {
    var parent = React.findDOMNode(this);
    parent.removeChild(this.tx);
    parent.removeChild(this.rx);
    this.tx = null;
    this.rx = null;
    transmissionStore.unlisten(this._updateIndicators);
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <span style={styles.rxtx}></span>
    );
  }
}

module.exports = Indicators;
