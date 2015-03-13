'use strict';

const StyleSheet = require('react-style');

const styles = {
  sideNav: StyleSheet.create({
    zIndex: 5,
    width: '13rem'
  }),
  chooser: StyleSheet.create({
    zIndex: 6,
    width: '100%',
    maxWidth: '30rem',
    margin: 'auto',
    display: 'flex',
    flexDirection: 'column'
  }),
  textField: {
    containerStyling: StyleSheet.create({
      width: '100%'
    })
  },
  createButton: StyleSheet.create({
    marginLeft: '10px'
  }),
  buttonGroup: {
    alignSelf: 'flex-end',
    marginTop: 'auto'
  },
  deleteButton: {
    border: 0,
    background: 'none',
    padding: 0,
    float: 'right',
    position: 'relative',
    zIndex: 7
  },
  buttonIcon: StyleSheet.create({
    display: 'inline-block',
    padding: 0,
    width: '30px',
    verticalAlign: 'middle',
    pointerEvents: 'none',
  })
};

module.exports = styles;
