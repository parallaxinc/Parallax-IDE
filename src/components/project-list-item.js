'use strict';

const React = require('react');
const ListItem = require('react-material/components/ListItem');

class Project extends React.Component {
  render(){
    const {
      onClick,
      children
    } = this.props;

    const liStyle = {
      listStyleType: 'none',
      padding: "14px 16px 15px"
    }

    return (
      <li styles={liStyle} icon="folder" onClick={onClick}>
        {children}
      </li>
    );
  }
}

module.exports = Project;
