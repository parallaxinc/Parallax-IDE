'use strict';

const React = require('react');
const { createContainer } = require('sovereign');

const Scroller = require('../lib/scroller');

const TransmitPane = require('../components/transmit-pane');

const styles = {
  outputConsole: {
    height: '200px',
    boxShadow: 'inset 0 5px 10px -5px rgba(0, 0, 0, 0.26)',
    backgroundColor: 'white',
    padding: '10px',
    margin: '0',
    overflow: 'auto',
    whiteSpace: 'pre'
  }
};

class TermnialView extends React.Component {

  componentWillReceiveProps(nextProps){
    const { output, offset } = nextProps;
    this.scroller.setLines(output, offset);
    this.scroller.requestRefresh();
  }

  componentDidMount() {
    const outputElement = React.findDOMNode(this.outputConsole);
    this.scroller = new Scroller(outputElement);
    outputElement.addEventListener('scroll', this.scroller.scroll, false);
  }

  componentWillUnmount() {
    const outputElement = React.findDOMNode(this.outputConsole);
    outputElement.removeEventListener('scroll', this.scroller.scroll, false);
  }

  shouldComponentUpdate(nextProps){
    const { connected, input } = this.props;
    return (connected !== nextProps.connected || input !== nextProps.input);
  }

  render(){
    const {
      handlers,
      connected,
      input
    } = this.props;

    const {
      transmitInput
    } = handlers;

    return (
      <div>
        <TransmitPane connected={connected} text={input} onChange={transmitInput} />
        <pre ref={(ref) => this.outputConsole = ref} style={styles.outputConsole} />
      </div>
    );
  }
}

module.exports = createContainer(TermnialView, {
  getStores({ store }){
    return {
      store
    };
  },

  getPropsFromStores({ store }){
    const { transmission, device } = store.getState();
    const { input, output, offset } = transmission;
    const { connected } = device;

    return {
      connected,
      input,
      output,
      offset
    };
  }
});
