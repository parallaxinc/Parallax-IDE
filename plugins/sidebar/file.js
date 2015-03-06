'use strict';

const React = require('react');
const ListItem = require('react-material/components/ListItem');

function noop(){}

const File = React.createClass({
  openFile: function(filename){
    const space = this.props.workspace;
    space.loadFile(filename, noop);
  },
  render: function(){
    const filename = this.props.filename;

    return (
      <ListItem onClick={() => this.openFile(filename)}>
        {filename}
      </ListItem>
    );
  }
});

module.exports = File;
