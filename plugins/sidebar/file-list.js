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
  //TODO: rename to FILE UP or FILE DOWN
  listFiles: function() {
    const currentFile = window.app.workspace.file.deref();
    console.log(this.props.children);
    React.Children.forEach(this.props.children, function(ch, i) {
      console.log(i, ch);
      console.log(ch.key);
      console.log(currentFile);
      if(ch.key == currentFile){
        //openFile
      }

    });
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
