'use strict';

const React = require('react');
const { Menu, MainButton } = require('react-mfb-iceddev');

class FileOperationList extends React.Component {
  render(){
    const {
      children
    } = this.props;

    return (
      <Menu effect="zoomin" method="click" position="bl">
        <MainButton iconResting="ion-plus-round" iconActive="ion-close-round" />
        {children}
      </Menu>
    );
  }
}

module.exports = FileOperationList;
