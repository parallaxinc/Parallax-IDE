'use strict';

const React = require('react');

const cm = require('../code-mirror');

class Editor extends React.Component {

  componentDidMount(){
    const container = React.findDOMNode(this);
    const { handleInput } = this.props.handlers;
    container.style.display = 'flex';
    container.style.flex = '1';
    container.style.flexDirection = 'column';
    container.setAttribute('id', 'editorContainer');

    container.appendChild(cm.getWrapperElement());

    cm.on('change', handleInput);
  }

  componentWillUnmount(){
    const container = React.findDOMNode(this);
    container.removeAll();
  }


  shouldComponentUpdate(){
    return false;
  }

  render(){

    return (
      <div />
    );
  }

}

module.exports = Editor;
