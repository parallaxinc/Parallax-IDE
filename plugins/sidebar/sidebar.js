'use strict';

const React = require('react');
const Card = require('react-material/components/Card');

const styles = require('./styles');

const Sidebar = React.createClass({
  render: function(){
    return (
      <Card styles={styles.card}>
        {this.props.children}
      </Card>
    );
  }
});

module.exports = Sidebar;
