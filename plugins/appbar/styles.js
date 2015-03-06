'use strict';

const ReactStyle = require('react-style');

const styles = {
  sideNav: ReactStyle({
    zIndex: 5,
    width: '13rem'
  }),
  chooser: ReactStyle({
    zIndex: 6,
    width: '100%',
    maxWidth: '30rem',
    margin: 'auto',
    display: 'flex',
    flexDirection: 'column'
  }),
  textField: {
    containerStyling: ReactStyle({
      width: '100%'
    })
  },
  createButton: ReactStyle({
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
  buttonIcon: ReactStyle({
    display: 'inline-block',
    padding: 0,
    width: '30px',
    verticalAlign: 'middle',
    pointerEvents: 'none',
  })
};

module.exports = styles;
