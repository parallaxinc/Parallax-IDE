'use strict';

const React = require('react');

class Progress extends React.Component {

  render(){

    const { setComplete } = this.props;

    const barStyle = {
      width: setComplete,
      height: '100%',
      backgroundColor: '#3a81f0'
    }
    const barContainerStyle = {
      width: '100%',
      height: '8px',
      backgroundColor: '#b0d0ef',
      position: 'absolute',
      bottom: 0,
      left: 0
    }

    return (
        <div style={barContainerStyle}>
          <div style={barStyle}></div>
        </div>
    );
  }
}

module.exports = Progress;
