'use strict';

const React = require('react');
const invariant = require('invariant');

const store = require('../store');

const AppBar = require('./appbar');
const SideBar = require('./sidebar');
const Editor = require('./editor');
const Terminal = require('./terminal');
const RxTx = require('./rxtx');

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh'
  },
  appbar: {
    flex: '0 0 56px'
  },
  view: {
    display: 'flex',
    flexDirection: 'row',
    height: '100%'
  },
  sidebar: {
    display: 'flex',
    flex: '0 0 content'
  },
  main: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    justifyContent: 'flex-end'
  },
  editor: {
    flexGrow: 1,
    overflow: 'auto'
  },
  debug: {
    flexBasis: '16em'
  },
  debugstate: {
    flexBasis: '2em'
  },
  overlay: {
    position: 'fixed',
    width: 0,
    zIndex: 9999
  }
};

class Layout extends React.Component {
  componentDidMount(){
    const add = this.props.addMountpoint;
    invariant(add, 'Layout requires addMountpoint during componentDidMount.');
    add('overlay', React.findDOMNode(this._overlay));
  }

  componentWillUnmount(){
    const remove = this.props.removeMountpoint;
    invariant(remove, 'Layout requires removeMountpoint during componentWillUnmount.');
    remove('overlay');
  }

  render(){
    const { workspace, handlers } = this.props.app;
    return (
      <div style={styles.container}>
        <div style={styles.appbar}><AppBar/></div>
        <div style={styles.view}>
          <div style={styles.sidebar}><SideBar workspace={workspace} handlers={handlers}/></div>
          <div style={styles.main}>
            <div style={styles.editor}>
              <Editor handlers={handlers}/>
            </div>
            <div style={styles.debug}>
              <Terminal store={store} handlers={handlers} />
            </div>
            <div style={styles.debugstate}>
              <RxTx handlers={handlers} />
            </div>
          </div>
        </div>
        <div ref={(ref) => this._overlay = ref} style={styles.overlay}></div>
        <div>{this.props.children}</div>
      </div>
    );
  }
}

Layout.propTypes = {
  addMountpoint: React.PropTypes.func.isRequired,
  removeMountpoint: React.PropTypes.func.isRequired
};

module.exports = Layout;
