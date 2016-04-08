'use strict';

const React = require('react');
const ReactStyle = require('react-style');

export default class Button extends React.Component {
    render(){
      const {
        children,
        onClick,
      } = this.props

      return(
        <button onClick={onClick} className="parallax-button">{children}</button>
      )
    }
}
