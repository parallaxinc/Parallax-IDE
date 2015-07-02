'use strict';

const React = require('react');
const List = require('react-material/components/List');

const styles = require('./styles');

class ProjectsList extends React.Component {

  render(){
    return (
      <List styles={styles.projectList}>
        {this.props.children}
      </List>
    );
  }
}

module.exports = ProjectsList;
