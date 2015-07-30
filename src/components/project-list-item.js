'use strict';

const React = require('react');
const ListItem = require('react-material/components/ListItem');

class Project extends React.Component {
  render(){
    const {
      onClick,
      children
    } = this.props;

    return (
      <ListItem icon="folder" onClick={onClick}>
        {children}
      </ListItem>
    );
  }
}

module.exports = Project;
