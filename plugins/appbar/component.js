'use strict';

const React = require('react');
const Card = require('react-material/components/Card');
const List = require('react-material/components/List');
const ListItem = require('react-material/components/ListItem');
const AppBar = require('react-material/components/AppBar');
const Overlay = require('react-material/components/Overlay');
const SideNavigation = require('react-material/components/SideNavigation');
const Button = require('react-material/components/Button');
const TextField = require('react-material/components/TextField');
const Icon = require('react-material/components/Icon');

const IconButton = require('./icon-button');
const styles = require('./styles');

const TopBar = React.createClass({
  getInitialState: function(){
    return {
      show: false,
      chooserType: '',
      projectName: ''
    };
  },
  showSidebar: function(){
    this.setState({
      show: true
    });
  },
  hideSidebar: function(){
    this.setState({
      show: false,
      chooserType: ''
    });
  },
  showNewChooser: function(){
    this.setState({
      chooserType: 'new'
    });
  },
  showOpenChooser: function(){
    this.setState({
      chooserType: 'open'
    });
  },
  hideChooser: function(){
    this.setState({
      chooserType: ''
    });
  },
  updateName: function(evt){
    evt.stopPropagation();
    evt.preventDefault();

    this.setState({
      projectName: evt.target.value
    });
  },
  openDir: function(name){
    this.setState({
      projectName: name
    }, this.changeProject);
  },
  deleteDir: function(name, evt){
    const space = this.props.app.workspace;

    evt.stopPropagation();
    evt.preventDefault();

    space.deleteDir(name, function(){
      console.log('dir deleted', name);
    });
  },
  changeProject: function(){
    const space = this.props.app.workspace;

    space.changeDir(this.state.projectName, () => {
      this.props.app.userConfig.set('cwd', this.state.projectName);
      // TODO: handle error
      this.setState({ projectName: '' }, this.hideSidebar)
    });
  },
  renderChooser: function(){
    const space = this.props.app.workspace;

    if(!this.state.chooserType){
      return null;
    }

    if(this.state.chooserType === 'new'){
      return (
        <Card styles={styles.chooser} title="New Project">
          <TextField
            placeHolder="Enter Project Name"
            floatingLabel
            styles={styles.textField}
            value={this.state.projectName}
            onChange={this.updateName} />
          <div style={styles.buttonGroup}>
            <Button raised onClick={this.hideChooser}>Cancel</Button>
            <Button raised styles={styles.createButton} onClick={this.changeProject}>Create Project</Button>
          </div>
        </Card>
      )
    }

    if(this.state.chooserType === 'open'){
      return (
        <Card styles={styles.chooser} title="Open Project">
          <List>
            {space.projects.map((dirname) => (
              <ListItem icon="folder" key={dirname} onClick={() => this.openDir(dirname)}>
                {dirname}
                {
                  dirname !== space.cwd.deref().substr(1)
                  ? <IconButton icon="delete" onClick={(evt) => this.deleteDir(dirname, evt)} />
                  : ''
                }
              </ListItem>
            )).toJS()}
          </List>
        </Card>
      );
    }
  },
  render: function(){
    const { title } = this.props;
    const { show } = this.state;

    return (
      <div>
        <AppBar title={title} onNavButtonClick={this.showSidebar} />
        <Overlay show={show} onClick={this.hideSidebar} />
        <SideNavigation show={show} styles={styles.sideNav}>
          <List>
            <ListItem icon onClick={this.showNewChooser}><Icon icon="folder" /> New Project</ListItem>
            <ListItem icon onClick={this.showOpenChooser}><Icon icon="folder-open" /> Open Project</ListItem>
          </List>
        </SideNavigation>
        {this.renderChooser()}
      </div>
    );
  }
});

module.exports = TopBar;
