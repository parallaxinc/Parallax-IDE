'use strict';

const React = require('react');
const Card = require('react-material/components/Card');
const Button = require('react-material/components/Button');
const Select = require('react-select');

const Serialport = require('browser-serialport');

require('react-select/dist/default.css');

const styles = require('../styles');

class DownloadOverlay extends React.Component {
  constructor(){
    this.state = {
      devicePath: null,
      options: []
    };

    this.onAccept = this.onAccept.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.reloadDevices = this.reloadDevices.bind(this);
    this.updateSelected = this.updateSelected.bind(this);
    this.getDevices = this.getDevices.bind(this);
  }

  componentDidMount(){
    this.getDevices();
  }

  onAccept(evt){
    if(typeof this.props.onAccept === 'function'){
      this.props.onAccept(this.state.devicePath, evt);
    }
  }

  onCancel(evt){
    if(typeof this.props.onCancel === 'function'){
      this.props.onCancel(evt);
    }
  }

  updateSelected(devicePath){
    this.setState({
      devicePath: devicePath
    });
  }

  reloadDevices(){
    this.setState({ devicePath: null }, this.getDevices());
  }

  getDevices(){
    Serialport.list((err, devices) => {
      let options = devices.map(function(device){
        return {
          value: device.comName,
          label: device.comName
        };
      });

      this.setState({
        options: options
      });
    });
  }

  render(){
    return (
      <Card styles={styles.overlay}>
        <h3 style={styles.overlayTitle}>Please choose your connected device.</h3>
        <div style={styles.overlaySelectContainer}>
          <Select
            ref={(ref) => this._select = ref}
            name="device-select"
            placeholder="Device..."
            value={this.state.devicePath}
            searchable={false}
            clearable={false}
            onChange={this.updateSelected}
            options={this.state.options} />
          <Button onClick={this.reloadDevices}>Reload Devices</Button>
        </div>
        <div style={styles.overlayButtonContainer}>
          <Button onClick={this.onAccept}>Download</Button>
          <Button onClick={this.onCancel}>Cancel</Button>
        </div>
      </Card>
    );
  }
}

module.exports = DownloadOverlay;
