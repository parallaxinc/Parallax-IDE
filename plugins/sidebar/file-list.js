'use strict';

const React = require('react');
const List = require('react-material/components/List');

const FileList = React.createClass({

  componentDidMount: function(){
    app.keypress.register('CTRL_TAB', this.nextFile);
    app.keypress.register('CTRL_SHIFT_TAB', this.previousFile);
  },
  componentWillUnmount: function(){
    app.keypress.unregister('CTRL_TAB');
    app.keypress.unregister('CTRL_SHIFT_TAB');
  },
  previousFile: function(){
    this.changeFile({ direction: 'prev' });
  },
  nextFile: function() {
    this.changeFile({ direction: 'next' });
  },
  changeFile: function(move) {
    const space = this.props.workspace;
    const filename = space.filename.deref();

    space.directory.forEach(function(x, i) {
      if(x.get('name') === filename) {
        if(i === space.directory.size - 1) {
          i = -1;
        }
        const shift = move.direction === 'prev' ? i - 1 : i + 1;
        const switchFile = space.directory.getIn([shift, 'name']);
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
