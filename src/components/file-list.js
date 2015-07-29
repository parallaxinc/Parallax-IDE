'use strict';

const React = require('react');
const List = require('react-material/components/List');

class FileList extends React.Component {
  render(){
    const {
      children
    } = this.props;

    return (
      <List>
        {children}
      </List>
    );
  }
}

module.exports = FileList;
