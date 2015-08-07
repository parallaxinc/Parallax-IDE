'use strict';

const React = require('react');

const styles = {
  overlayTitle: {
    margin: 0
  }
};

class OverlayTitle extends React.Component {
  render(){
    const {
      children
    } = this.props;

    return (
      <h3 style={styles.overlayTitle}>{children}</h3>
    );
  }
}

module.exports = OverlayTitle;
