'use strict';

const React = require('react');
const List = require('react-material/components/List');

const FileList = React.createClass({

  componentDidMount: function(){
    app.keypress.register('CTRL_TAB', this.previousFile);
    app.keypress.register('CTRL_SHIFT_TAB', this.nextFile);
  },
  componentWillUnmount: function(){
    app.keypress.register('CTRL_TAB');
    app.keypress.register('CTRL_SHIFT_TAB');
  },
  previousFile: function(){
    this.changeFile(true);
  },
  nextFile: function() {
    this.changeFile(false);
  },
  changeFile: function(moveup) {
    const space = this.props.workspace;
    const filename = space.filename.deref();

    space.directory.forEach(function(x, i) {
      if(x.get('name') === filename) {
        if(i === space.directory.size - 1) {
          i = -1;
        }
        const shift = moveup ? i - 1 : i + 1;
        const switchFile = space.directory.get(shift).get('name');
        space.loadFile(switchFile);
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
