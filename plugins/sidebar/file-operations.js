'use strict';

const React = require('react');
const Button = require('react-material/components/Button');
const TextField = require('react-material/components/TextField');

const styles = require('./styles');

const FileOperations = React.createClass({
  getInitialState: function(){
    // workaround to async updating that causes the cursor in the textfile to jump
    return {
      dontJump: true
    }
  },
  saveFile: function(){
    const space = this.props.workspace;
    // TODO: these should transparently accept cursors for all non-function params
    space.saveFile(space.filename.deref(), space.current, function(err){
      console.log('saved', err);
    });
  },
  newFile: function(){
    const space = this.props.workspace;
    space.filename.update(() => '');
    space.current.update(() => '');
  },
  deleteFile: function(){
    const space = this.props.workspace;
    space.deleteFile(space.filename, function(err){
      console.log('deleted', err);
    });
  },
  updateName: function(evt){
    const space = this.props.workspace;
    evt.stopPropagation();
    evt.preventDefault();
    space.filename.update(function(){
      return evt.target.value;
    });
    // set the state to cause a render causing cursor to not jump
    this.setState({ dontJump: !this.state.dontJump });
  },
  render: function(){
    const space = this.props.workspace;

    return (
      <div style={styles.fileOperations}>
        <Button raised onClick={this.newFile}>New File</Button>
        <TextField
          value={space.filename.deref()}
          placeHolder="filename"
          styles={styles.textField}
          floatingLabel
          onChange={this.updateName} />
        <Button raised onClick={this.saveFile}>Save File</Button>
        <Button raised onClick={this.deleteFile} styles={styles.button}>Delete File</Button>
      </div>
    );
  }
});

module.exports = FileOperations;
