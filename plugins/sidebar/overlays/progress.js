'use strict';

const React = require('react');

var styles = require('../styles.js');

class Progress extends React.Component {

  render(){

    var percent = {width: this.props.percent + '%'};

    return (
      <div style={styles.progressContainerStyle}>
        <div styles={[styles.progressBarStyle, setComplete]}></div>
      </div>
    );
  }
}

module.exports = Progress;
