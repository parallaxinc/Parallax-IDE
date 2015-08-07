'use strict';

const _ = require('lodash');
const React = require('react');

const styles = {
  progressContainerStyle: {
    width: '100%',
    height: '8px',
    backgroundColor: '#b0d0ef',
    marginTop: 'auto'
  },
  progressBarStyle: {
    height: '100%',
    backgroundColor: '#3a81f0'
  }
};

class ProgressBar extends React.Component {

  render(){
    const {
      percent
    } = this.props;

    const style = _.assign({}, styles.progressBarStyle, { width: `${percent}%` });

    return (
      <div style={styles.progressContainerStyle}>
        <div style={style}></div>
      </div>
    );
  }
}

module.exports = ProgressBar;
