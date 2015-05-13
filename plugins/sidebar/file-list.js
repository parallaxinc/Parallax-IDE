'use strict';

const React = require('react');
const List = require('react-material/components/List');

const FileList = React.createClass({

  componentDidMount: function(){
    window.addEventListener('listFiles', this.listFiles);
  },
  componentWillUnmount: function(){
    window.removeEventListener('listFiles', this.listFiles);
  },
  listFiles: function() {
    console.log(this.props.children);
  },
  render: function(){
    return (
      <List>
        {this.props.children}
      </List>
    );
  }
});

module.exports = FileList;
