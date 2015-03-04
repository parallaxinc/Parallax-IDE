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

  // TODO: add API in irken for setting filename
  var ourName = '';

  function save(){
    space.saveFile(ourName, space.current, function(err){
      console.log('saved', err);
    });
  }

  function updateName(evt){
    evt.stopPropagation();
    evt.preventDefault();
    ourName = evt.target.value;
  }

  app.view('sidebar', function(el, cb){
    console.log('sidebar render');

    var Component = (
      <Sidebar>
        <FileList>
        {space.directory.map((filename) => <ListItem disableRipple>{filename}</ListItem>).toJS()}
        </FileList>
        <TextField placeHolder="filename" styles={styles.textField} floatingLabel onChange={updateName} />
        <Button raised onClick={save}>Save</Button>
      </Sidebar>
    );

    React.render(Component, el, cb);
  });

  space.changeDir('tmp', cb);
}

module.exports = sidebar;
