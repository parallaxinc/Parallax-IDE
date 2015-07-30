'use strict';

const React = require('react');

const styles = {
  overlayButtonContainer: {
    marginLeft: 'auto',
    height: '40px'
  }
};

class OverlayFooter extends React.Component {
  render(){
    const {
      children
    } = this.props;

    return (
      <div style={styles.overlayButtonContainer}>
        {children}
      </div>
    );
  }
}

module.exports = OverlayFooter;
