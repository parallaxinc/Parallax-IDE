'use strict';

const _ = require('lodash');
const React = require('react');
const { createContainer } = require('sovereign');

const Scroller = require('../lib/scroller');

const TransmitPane = require('../components/transmit-pane');

const red = '#da2100';
const blue = 'rgb(44, 131, 216)';
const grey = '#666666';

const styles = {
  bar: {
    margin: 0,
    height: '25px',
    backgroundColor: '#CFD8DC'
  },
  outputConsole: {
    height: '200px',
    boxShadow: 'inset 0 5px 10px -5px rgba(0, 0, 0, 0.26)',
    backgroundColor: 'white',
    padding: '10px',
    margin: '0',
    overflow: 'auto',
    whiteSpace: 'pre-wrap'
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
    paddingTop: 3
  },
  rx: {
    backgroundColor: blue
  },
  tx: {
    backgroundColor: red
  }
};

class TermnialView extends React.Component {

  _updateIndicators(props){
    const { flashRx, flashTx } = props;
    console.log('_updateIndicators', props);
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

  componentWillReceiveProps(nextProps){
    const { lines } = nextProps;
    this.scroller.setLines(lines);
    this.scroller.requestRefresh();

    this._updateIndicators(nextProps);
  }

  componentDidMount() {
    const outputElement = React.findDOMNode(this.outputConsole);
    this.scroller = new Scroller(outputElement);
    outputElement.addEventListener('scroll', this.scroller.scroll, false);

    const parent = React.findDOMNode(this.rxtx);
    const tx = this.tx = document.createElement('span');
    const rx = this.rx = document.createElement('span');
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
  }

  componentWillUnmount() {
    const parent = React.findDOMNode(this.rxtx);
    parent.removeChild(this.tx);
    parent.removeChild(this.rx);
    this.tx = null;
    this.rx = null;
  }

  shouldComponentUpdate(nextProps){
    const { connected, text } = this.props;
    return (connected !== nextProps.connected || text !== nextProps.text);
  }

  render(){
    const {
      handlers,
      connected,
      text
    } = this.props;

    const {
      transmitInput
    } = handlers;

    return (
      <div>
        <TransmitPane connected={connected} text={text} onChange={transmitInput} />
        <pre ref={(ref) => this.outputConsole = ref} style={styles.outputConsole} />
        <div style={styles.bar}>
          <span ref={(ref) => this.rxtx = ref} style={styles.rxtx} />
        </div>
      </div>
    );
  }
}

module.exports = createContainer(TermnialView, {
  getStores({ store, consoleStore }){
    return {
      store,
      consoleStore
    };
  },

  getPropsFromStores({ store, consoleStore }){
    const { lines } = consoleStore.getState();
    const { transmission, device } = store.getState();
    const { flashRx, flashTx, text } = transmission;
    const { connected } = device;

    return {
      lines,
      flashRx,
      flashTx,
      connected,
      text
    };
  }
});
