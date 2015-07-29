'use strict';

const React = require('react');
const { ChildButton } = require('react-mfb-iceddev');

class FileOperationListItem extends React.Component {
  render(){
    const {
      onClick,
      icon,
      label
    } = this.props;

    return (
      <ChildButton onClick={onClick} icon={icon} label={label} />
    );
  }
}

module.exports = FileOperationListItem;
