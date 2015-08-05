'use strict';

const React = require('react');

const styles = {
  transmit: {
    margin: 0,
    height: '32px',
    backgroundColor: 'white',
    boxShadow: 'inset 0px 5px 10px -5px rgba(0, 0, 0, 0.26)'
  },
  transmitInput: {
    border: '0px',
    backgroundColor: 'transparent',
    outline: 'none',
    resize: 'none',
    width: '100%',
    padding: '5px 10px',
    fontSize: 'inherit',
    fontFamily: 'inherit',
    boxSizing: 'border-box'
  }
};

const ignore = [16, 17, 18, 20];

class TransmitPane extends React.Component {

  constructor(...args){
    super(...args);

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handlePaste = this.handlePaste.bind(this);
  }

  handleKeyDown(event) {
    const { onChange } = this.props;

    const { keyCode } = event.nativeEvent;

    if (ignore.indexOf(keyCode) > -1) {
      return;
    }

    if (keyCode < 32 || (keyCode > 127 && keyCode < 160)) {
      // TODO: pass the whole event?
      onChange(keyCode);
    }
  }

  handleKeyPress(event) {
    const { onChange } = this.props;

    const { keyCode } = event.nativeEvent;

    if ((keyCode >= 32 && keyCode <= 127) ||
        (keyCode >= 160 && keyCode <= 255)) {
      // TODO: pass the whole event?
      onChange(keyCode);
    }
  }

  handlePaste(event) {
    const { onChange } = this.props;

    const { clipboardData } = event;
    const data = clipboardData.getData('text/plain');

    onChange(data);
  }

  shouldComponentUpdate(nextProps){
    const { connected, text } = this.props;
    return (connected !== nextProps.connected || text !== nextProps.text);
  }

  render() {
    const { connected, text } = this.props;
    return (
      <div style={styles.transmit}>
        <textarea
          style={styles.transmitInput}
          name='transmitInput'
          value={text}
          onKeyDown={this.handleKeyDown}
          onKeyPress={this.handleKeyPress}
          onPaste={this.handlePaste}
          rows='1'
          disabled={!connected} />
        <br />
      </div>
    );
  }
}

TransmitPane.propTypes = {
  connected: React.PropTypes.bool.isRequired,
  text: React.PropTypes.string.isRequired
};

module.exports = TransmitPane;
