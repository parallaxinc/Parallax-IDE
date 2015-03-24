'use strict';

const React = require('react');
const ListItem = require('react-material/components/ListItem');

const IconButton = require('./icon-button');

class Project extends React.Component {

  constructor(){
    this.onClick = this.onClick.bind(this);
    this.onDelete = this.onDelete.bind(this);
  }

  onClick(evt){
    if(typeof this.props.onSelect === 'function'){
      this.props.onSelect(this.props.name, evt);
    }
  }

  onDelete(evt){
    if(typeof this.props.onDelete === 'function'){
      this.props.onDelete(this.props.name, evt);
    }
  }

  render(){
    const { name, current } = this.props;

    let icon;
    if(!current){
      icon = (
        <IconButton icon="delete" onClick={this.onDelete} />
      );
    }

    return (
      <ListItem icon="folder" key={name} onClick={this.onClick}>
        {name} {icon}
      </ListItem>
    );
  }
}

module.exports = Project;
