'use strict';

const React = require('react');
const List = require('react-material/components/List');

const styles = {
  projectList: {
    flex: 1,
    marginTop: 10
  }
};

class ProjectsList extends React.Component {
  render(){
    const {
      children
    } = this.props;

    return (
      <List styles={styles.projectList}>
        {children}
      </List>
    );
  }
}

module.exports = ProjectsList;
