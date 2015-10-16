'use strict';

const _ = require('lodash');
const React = require('react');

const defaultStyle = {
  boxShadow: '0 2px 2px 0 rgba(0,0,0,.14),0 3px 1px -2px rgba(0,0,0,.2),0 1px 5px 0 rgba(0,0,0,.12)',
  backgroundColor: 'white',
  padding: '16px',
  borderRadius: '2px'
};

class Card extends React.Component {
  render(){
    const {
      style = {},
      children
    } = this.props;

    const styles = _.assign({}, defaultStyle, style);

    return (
      <div style={styles}>
        {children}
      </div>
    );
  }
}

module.exports = Card;
