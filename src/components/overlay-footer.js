'use strict';

const _ = require('lodash');
const React = require('react');

const styles = {
  overlayButtonContainer: {
    marginTop: 'auto',
    marginLeft: 'auto',
    height: '40px'
  }
};

class OverlayFooter extends React.Component {
  render(){
    const {
      children,
      style
    } = this.props;

    const footerStyle = _.assign({}, styles.overlayButtonContainer, style);

    return (
      <div style={footerStyle}>
        {children}
      </div>
    );
  }
}

module.exports = OverlayFooter;
