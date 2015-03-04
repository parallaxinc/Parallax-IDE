'use strict';

var React = require('react');
var ReactStyle = require('react-style');
var Card = require('react-material/components/Card');
var List = require('react-material/components/List');
var ListItem = require('react-material/components/ListItem');

var Sidebar = React.createClass({
  render: function(){
    return (
      <Card styles={ReactStyle({margin: 0, height: 'auto', width: '100%'})}>
        <List>
          <ListItem disableRipple>hello.js</ListItem>
          <ListItem disableRipple>world.js</ListItem>
          <ListItem disableRipple>hello.js</ListItem>
        </List>
      </Card>
    );
  }
});

function sidebar(app, opts, cb){
  app.view('sidebar', function(el, cb){
    console.log('sidebar render');
    React.render(<Sidebar />, el, cb);
  });

  cb();
}

module.exports = sidebar;
