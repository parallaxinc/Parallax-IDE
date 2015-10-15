'use strict';

const _ = require('lodash');
const React = require('react');

const Card = require('./card');

const styles = {
  overlay: {
    width: 400,
    height: 200,
    margin: '100px auto 0',
    display: 'flex',
    flexDirection: 'column'
  },
  overlayLarge: {
    height: 400
  }
};

class Overlay extends React.Component {
  render(){
    const {
      large,
      children,
      style
    } = this.props;

    const cardStyle = _.assign({}, styles.overlay, style);
    if(large){
      _.assign(cardStyle, styles.overlayLarge);
    }

    return (
      <Card style={cardStyle}>
        {children}
      </Card>
    );
  }
}

module.exports = Overlay;
