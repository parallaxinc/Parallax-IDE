'use strict';

const _ = require('lodash');
const React = require('react');
const Card = require('react-material/components/Card');
const Button = require('react-material/components/Button');
const Select = require('react-select');
const Loader = require('react-loader');

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

  updateSelected(device){
    this.setState({
      devicePath: device.path,
      selectedDevice: device
    });
  }

  reloadDevices(){
    const irken = this.props.irken;
    this.setState({ devicePath: null, searching: true });
    irken.scanBoards()
      .then((devices) => this.setState({ devices: devices, searching: false }));
  }

  componentizeDevice(device, selectedPath){
    const highlight = device.path === selectedPath ? 'active' : 'inactive';
    return (
      <tr style={styles[highlight]} onClick={this.updateSelected.bind(this, device)}>
        <td style={styles.deviceTd}>{device.name}</td>
        <td style={styles.deviceTd}>{device.path}</td>
      </tr>
      );
  }

  render(){
    const { devices, devicePath } = this.state;

    const deviceRows = _.map(devices, (device) => this.componentizeDevice(device, devicePath));

    return (
      <Card styles={[styles.overlay, styles.overlayLarge]}>
        <h3 style={styles.overlayTitle}>Please choose your connected device.</h3>
        <div style={styles.overlayTableContainer}>
          <Button onClick={this.reloadDevices}>Reload Devices</Button>
          <Loader loaded={!this.state.searching}>
            <div style={styles.deviceTableWrapper}>
              <div style={styles.deviceTableScroll}>
                <table style={styles.deviceTable}>
                  <thead>
                    <tr>
                      <th style={styles.deviceTh}>Name</th>
                      <th style={styles.deviceTh}>Path</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deviceRows}
                  </tbody>
                </table>
              </div>
            </div>
          </Loader>
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
