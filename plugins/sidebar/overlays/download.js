'use strict';

const _ = require('lodash');
const React = require('react');
const through = require('through2');
const Card = require('react-material/components/Card');
const Button = require('react-material/components/Button');
const Loader = require('react-loader');
const Progress = require('./progress');

const DeviceActions = require('../../../src/actions/DeviceActions.js');
const DeviceStore = require('../../../src/stores/DeviceStore.js');

const { createContainer } = require('sovereign');

const styles = require('../styles');

class DownloadOverlay extends React.Component {

  constructor(){

    this._onAccept = this._onAccept.bind(this);
    this._onCancel = this._onCancel.bind(this);
    this._onReloadDevices = this._onReloadDevices.bind(this);
    this._onUpdateSelected = this._onUpdateSelected.bind(this);

  }

  componentDidMount(){
    this._onReloadDevices();
  }

  componentizeDevice(device, selectedPath){
    const highlight = device.path === selectedPath ? 'active' : 'inactive';
    return (
      <tr style={styles[highlight]} onClick={this._onUpdateSelected.bind(this, device)}>
        <td style={styles.deviceTd}>{device.name}</td>
        <td style={styles.deviceTd}>{device.path}</td>
      </tr>
      );
  }

  render(){
    const { devices, devicePath } = this.props;

    const deviceRows = _.map(devices, (device) => this.componentizeDevice(device, devicePath));

    return (
      <Card styles={[styles.overlay, styles.overlayLarge]}>
        <h3 style={styles.overlayTitle}>Please choose your connected device.</h3>
        <div>
          <Loader loaded={!this.props.searching}>
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
        <div>
        </div>
        <div style={styles.overlayDevicesBottom}>
          <div style={styles.overlayLoadingContainer}>
            <Button onClick={this._onReloadDevices}>Reload Devices</Button>
            <Progress percent={this.props.progress} />
          </div>
          <div style={styles.overlayButtonContainer}>
            <Button onClick={this._onAccept}>Download</Button>
            <Button onClick={this._onCancel}>Cancel</Button>
          </div>
        </div>
      </Card>
    );
  }

  _onAccept(){
    DeviceActions.download(this.props.handleSuccess,
                          this.props.handleError);
  }

  _onCancel(evt){
    if(typeof this.props.onCancel === 'function'){
      this.props.onCancel(evt);
    }
  }

  _onReloadDevices(){
    DeviceActions.reloadDevices(this.props);
  }

  _onUpdateSelected(device){
    DeviceActions.updateSelected(device);
  }
}

const DownloadOverlayContainer = createContainer(DownloadOverlay, {
  getStores(){
    return {
      DeviceStore: DeviceStore
    };
  },

  getPropsFromStores() {
    return DeviceStore.getState();
  }
});

module.exports = DownloadOverlayContainer;
