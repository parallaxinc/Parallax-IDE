'use strict';

const _ = require('lodash');
const React = require('react');
const Card = require('react-material/components/Card');
const Button = require('react-material/components/Button');
const Loader = require('react-loader');
const { createContainer } = require('sovereign');

const Progress = require('./progress');
const deviceStore = require('../../src/stores/device');
const { disableAuto, reloadDevices, updateSelected } = require('../../src/actions/device');

const styles = require('./styles');

class DownloadOverlay extends React.Component {

  constructor(){

    this._onCancel = this._onCancel.bind(this);
    this._onReloadDevices = this._onReloadDevices.bind(this);

  }

  componentizeDevice(device, selectedPath){
    const highlight = device.path === selectedPath ? 'active' : 'inactive';
    return (
      <tr style={styles[highlight]} onClick={updateSelected.bind(this, device)}>
        <td style={styles.deviceTd}>{device.name}</td>
        <td style={styles.deviceTd}>{device.version}</td>
        <td style={styles.deviceTd}>{device.path}</td>
      </tr>
      );
  }

  render(){
    const { devices, devicePath, message, progress, searching } = this.props;

    const deviceRows = _.map(devices, (device) => this.componentizeDevice(device, devicePath));

    let bottomBar;
    if(message){
      bottomBar = (
        <div style={styles.overlayUserMessage}>{message}</div>
      );
    } else {
      bottomBar = (
        <Progress percent={progress} />
      );
    }

    return (
      <Card styles={[styles.overlay, styles.overlayLarge, styles.overlayUnpad]}>
        <h3 styles={[styles.overlayTitle, styles.overlayPad]}>Please choose your connected device.</h3>
        <div style={styles.overlayPad}>
          <Loader loaded={!searching}>
            <div style={styles.deviceTableWrapper}>
              <div style={styles.deviceTableScroll}>
                <table style={styles.deviceTable}>
                  <thead>
                    <tr>
                      <th style={styles.deviceTh}>Device</th>
                      <th style={styles.deviceTh}>Version</th>
                      <th style={styles.deviceTh}>Port</th>
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
        <div styles={[styles.overlayDevicesBottom, styles.overlayPad]}>
          <div style={styles.overlayLoadingContainer}>
            <Button onClick={this._onReloadDevices}>Refresh</Button>
          </div>
          <div style={styles.overlayButtonContainer}>
            <Button onClick={this._onCancel}>Cancel</Button>
          </div>
        </div>
        <div style={styles.bottomBar}>
          {bottomBar}
        </div>
      </Card>
    );
  }

  _onCancel(evt){
    const { onCancel } = this.props;

    if(typeof onCancel === 'function'){
      onCancel(evt);
    }
  }

  _onReloadDevices(){
    disableAuto();
    reloadDevices(this.props);
  }

}

module.exports = createContainer(DownloadOverlay, {
  getStores(){
    return {
      deviceStore: deviceStore
    };
  },

  getPropsFromStores() {
    return deviceStore.getState();
  }
});
