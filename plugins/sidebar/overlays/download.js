'use strict';

const _ = require('lodash');
const React = require('react');
const Card = require('react-material/components/Card');
const Button = require('react-material/components/Button');
const Select = require('react-select');

require('react-select/dist/default.css');

const styles = require('../styles');

class DownloadOverlay extends React.Component {
  constructor(){
    this.state = {
      devicePath: null,
      searching: false,
      selectedDevice: null,
      devices: []
    };

    this.onAccept = this.onAccept.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.reloadDevices = this.reloadDevices.bind(this);
    this.updateSelected = this.updateSelected.bind(this);
  }

  componentDidMount(){
    this.reloadDevices();
  }

  onAccept(evt){
    if(typeof this.props.onAccept === 'function'){
      this.props.onAccept(this.state.selectedDevice, evt);
    }
  }

  onCancel(evt){
    if(typeof this.props.onCancel === 'function'){
      this.props.onCancel(evt);
    }
  }

  updateSelected(devicePath){
    var device = _.find(this.state.devices, { path: devicePath });
    this.setState({
      devicePath: devicePath,
      selectedDevice: device
    });
  }

  reloadDevices(){
    const irken = this.props.irken;
    this.setState({ devicePath: null, searching: true });
    irken.scanBoards()
      .then((devices) => this.setState({ devices: devices, searching: false }));
  }

  buildDeviceLabel(device){
    if(device.name){
      return `${device.name} - ${device.path}`;
    }else{
      return device.path;
    }
  }

  createDeviceList(devices){
    var self = this;
    return devices.map(function(device){
      return {
        value: device.path,
        label: self.buildDeviceLabel(device)
      };
    });
  }

  render(){
    const devices = this.createDeviceList(this.state.devices);
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
            options={devices} />
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
