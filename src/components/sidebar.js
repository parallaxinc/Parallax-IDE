'use strict';

const React = require('react');

const Card = require('./card');

const styles = {
  card: {
    margin: 0,
    height: 'auto',
    width: '100%',
    display: 'flex',
    flexDirection: 'column'
  }
};

class Sidebar extends React.Component {
  render(){
    const {
      children
    } = this.props;

    return (
      <Card style={styles.card}>
        {children}
      </Card>
    );
  }
}

module.exports = Sidebar;
