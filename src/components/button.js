'use strict';

const React = require('react');
const ReactStyle = require('react-style');

export default class Button extends React.Component {
    render(){
      console.log('Button2 This>',this);
      const {
        children,
        onClick,
      } = this.props

      return(
        <button onClick={onClick} className='mdl-button'>{children}</button>
      )
    }
}
