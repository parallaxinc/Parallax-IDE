'use strict';

const React = require('react');
const List = require('react-material/components/List');

const FileList = React.createClass({
  render: function(){
    return (
      <List>
        {this.props.children}
      </List>
    );
  }
});

module.exports = FileList;
