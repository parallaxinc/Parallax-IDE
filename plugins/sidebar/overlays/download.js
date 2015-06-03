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

const connectToStores = require('../../../src/connect-to-stores');

const styles = require('../styles');

class DownloadOverlay extends React.Component {

  constructor(){
    //this.state = {
      //devicePath: null,
      //searching: false,
      //selectedDevice: null,
      //devices: [],
      //progress: 0
    //};

    this._onAccept = this._onAccept.bind(this);
    this._onCancel = this._onCancel.bind(this);
    this._onReloadDevices = this._onReloadDevices.bind(this);
    this._onUpdateSelected = this._onUpdateSelected.bind(this);
  }

  componentDidMount(){
    this._onReloadDevices();
  }

  //download(device){

    //const { irken, handleError, handleSuccess } = this.props;

    //const { toast, workspace, logger, overlay } = irken;

    //const name = workspace.filename.deref();
    //const source = workspace.current.deref();

    //if(!device){
      //return;
    //}

    //const board = irken.getBoard(device);

    //board.removeListener('terminal', logger);

    //board.on('progress', this.updateProgress);

    //board.compile(source)
      //.tap(() => logger.clear())
      //.then((memory) => board.bootload(memory))
      //.then(() => board.on('terminal', logger))
      //.tap(() => toast.clear())
      //.tap(() => handleSuccess(`'${name}' downloaded successfully`))
      //.catch(handleError)
      //.finally(() => {
        //overlay.hide();
        //board.removeListener('progress', this.updateProgress);
        //this.setState({ progress: 0 });
      //});

  //}

  //updateProgress(progress){
    //this.setState({ progress: progress});
  //}

  //updateSelected(device){
    //this.setState({
      //devicePath: device.path,
      //selectedDevice: device
    //});
  //}


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
    //this.download(this.state.selectedDevice);
    DeviceActions.download();
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

DownloadOverlay = connectToStores(DownloadOverlay, {
  getStores(props){
    return {
      DeviceStore: DeviceStore
    };
  },

  getPropsFromStores(props) {
    console.log('devicestoregetstate', DeviceStore.getState());
    return _.assign(DeviceStore.getState());
  }
});

module.exports = DownloadOverlay;
