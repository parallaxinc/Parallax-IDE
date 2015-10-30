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
  },
  backdrop:{
    display: 'flex',
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 10
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
      <div style={styles.backdrop}>
        <Card style={cardStyle}>
          {children}
        </Card>
      </div>
    );
  }
}

module.exports = Overlay;
