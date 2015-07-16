'use strict';

const _ = require('lodash');
const React = require('react');
const { createContainer } = require('sovereign');

const styles = require('./styles');
const transmissionStore = require('../../src/stores/transmission');

class Indicators extends React.Component {

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
    console.log('componentDidMount', tx, rx, tx.style);
  }

  componentWillUnmount() {
    console.log('componentWillUnmount');
    var parent = React.findDOMNode(this);
    parent.removeChild(this.tx);
    parent.removeChild(this.rx);
    this.tx = null;
    this.rx = null;
  }

  shouldComponentUpdate(nextProps) {
    const { flashRx, flashTx } = this.props;
    if(this.rx != null && nextProps.flashRx !== flashRx){
      if(nextProps.flashRx){
        this.rx.style.backgroundColor = styles.rx.backgroundColor;
      }else{
        this.rx.style.backgroundColor = styles.indicator.backgroundColor;
      }
    }
    if(this.tx != null && nextProps.flashTx !== flashTx){
      if(nextProps.flashTx){
        this.tx.style.backgroundColor = styles.tx.backgroundColor;
      }else{
        this.tx.style.backgroundColor = styles.indicator.backgroundColor;
      }
    }
    return false;
  }

  render() {
    // const { flashRx, flashTx } = this.props;

    // let indicatorRx = [styles.indicator];
    // let indicatorTx = [styles.indicator];
    // if(flashRx) {
    //   indicatorRx.push(styles.rx);
    // }
    // if(flashTx) {
    //   indicatorTx.push(styles.tx);
    // }
    //TX<span styles={indicatorTx} /> RX<span styles={indicatorRx} />
    return (
      <span style={styles.rxtx}>
      </span>
    );
  }
}

module.exports = createContainer(Indicators, {
  getStores(){
    return {
      deviceStore: transmissionStore
    };
  },

  getPropsFromStores() {
    return transmissionStore.getState();
  }
});
