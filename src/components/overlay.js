'use strict';

const _ = require('lodash');
const React = require('react');
const Card = require('react-material/components/Card');

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
      children
    } = this.props;

    const style = _.assign({}, styles.overlay);
    if(large){
      _.assign(style, styles.overlayLarge);
    }

    return (
      <Card styles={style}>
        {children}
      </Card>
    );
  }
}

module.exports = Overlay;
