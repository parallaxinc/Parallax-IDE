'use strict';

const React = require('react');

const IconButton = require('./icon-button');

class DeleteButton extends React.Component {
  render(){
    const {
      onClick
    } = this.props;

    return (
      <IconButton icon="delete" onClick={onClick} />
    );
  }
}

module.exports = DeleteButton;
