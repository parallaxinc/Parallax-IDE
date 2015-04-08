'use strict';

const React = require('react');
const ListItem = require('react-material/components/ListItem');

const styles = require('./styles');

const File = React.createClass({
  openFile: function(filename){
    const space = this.props.workspace;
    space.loadFile(filename);
  },
  render: function(){
    const { filename, temp } = this.props;

    let tempStyles = [styles.fileTempIndicator];
    if(temp){
      tempStyles.push(styles.fileHasTemp);
    }

    return (
      <ListItem onClick={() => this.openFile(filename)}>
        <span styles={tempStyles} /> {filename}
      </ListItem>
    );
  }
});

module.exports = File;
