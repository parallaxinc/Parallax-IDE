'use strict';

var React = require('react');
var ReactStyle = require('react-style');
var Card = require('react-material/components/Card');
var List = require('react-material/components/List');
var ListItem = require('react-material/components/ListItem');
var Button = require('react-material/components/Button');
var TextField = require('react-material/components/TextField');

var styles = {
  card: ReactStyle({
    margin: 0,
    height: 'auto',
    width: '100%',
    display: 'flex',
    flexDirection: 'column'
  }),
  textField: {
    containerStyling: ReactStyle({
      width: '100%',
      marginTop: 'auto'
    })
  }
};

var FileList = React.createClass({
  render: function(){
    return (
      <List>
        {this.props.children}
      </List>
    );
  }
});

var Sidebar = React.createClass({
  render: function(){
    return (
      <Card styles={styles.card}>
        {this.props.children}
      </Card>
    );
  }
});

function sidebar(app, opts, cb){

  var space = app.workspace;

  function save(){
    // TODO: these should transparently accept cursors for all non-function params
    space.saveFile(space.filename.deref(), space.current, function(err){
      console.log('saved', err);
    });
  }

  function updateName(evt){
    evt.stopPropagation();
    evt.preventDefault();
    space.filename.update(function(){
      return evt.target.value;
    });
  }

  app.view('sidebar', function(el, cb){
    console.log('sidebar render');

    var Component = (
      <Sidebar>
        <FileList>
          <ListItem icon="folder" disableRipple>{space.cwd.deref()}</ListItem>
          {space.directory.map((filename) => <ListItem key={filename}>{filename}</ListItem>).toJS()}
        </FileList>
        <TextField
          value={space.filename.deref()}
          placeHolder="filename"
          styles={styles.textField}
          floatingLabel
          onChange={updateName} />
        <Button raised onClick={save}>Save</Button>
      </Sidebar>
    );

    React.render(Component, el, cb);
  });

  var cwd = app.userConfig.get('cwd') || 'new-project';

  space.changeDir(cwd, cb);
}

module.exports = sidebar;
