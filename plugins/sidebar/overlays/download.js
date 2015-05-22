'use strict';

const _ = require('lodash');
const React = require('react');
const through = require('through2');
const Card = require('react-material/components/Card');
const Button = require('react-material/components/Button');
const Select = require('react-select');
const Loader = require('react-loader');
const Progress = require('./progress');

require('react-select/dist/default.css');

const styles = require('../styles');

class DownloadOverlay extends React.Component {
  constructor(){
    this.state = {
      devicePath: null,
      searching: false,
      selectedDevice: null,
      devices: [],
      progress: 0
    };

    this.onAccept = this.onAccept.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.reloadDevices = this.reloadDevices.bind(this);
    this.updateSelected = this.updateSelected.bind(this);
    this.updateProgress = this.updateProgress.bind(this);
  }

  componentDidMount(){
    this.reloadDevices();
  }

  onAccept(evt){
    this.download(this.state.selectedDevice);
  }

  onCancel(evt){
    if(typeof this.props.onCancel === 'function'){
      this.props.onCancel(evt);
    }
  }

  download(device){

    const { irken, handleError, handleSuccess } = this.props;

    const { toast, workspace, logger, overlay } = irken;

    const name = workspace.filename.deref();
    const source = workspace.current.deref();

    if(!device){
      return;
    }

    const board = irken.getBoard(device);

    board.removeListener('terminal', logger);

    board.on('progress', this.updateProgress);

    board.compile(source)
      .tap(() => logger.clear())
      .then((memory) => board.bootload(memory))
      .then(() => board.on('terminal', logger))
      .tap(() => toast.clear())
      .tap(() => handleSuccess(`'${name}' downloaded successfully`))
      .catch(handleError)
      .finally(() => {
        overlay.hide();
        board.removeListener('progress', this.updateProgress);
        this.setState({ progress: 0 });
      });

  }

  updateProgress(progress){
    this.setState({ progress: progress});
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
        <div>
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
        <div>
        </div>
        <div style={styles.overlayDevicesBottom}>
          <div style={styles.overlayLoadingContainer}>
            <Button onClick={this.reloadDevices}>Reload Devices</Button>
            <Progress setComplete={this.state.progress} />
          </div>
          <div style={styles.overlayButtonContainer}>
            <Button onClick={this.onAccept}>Download</Button>
            <Button onClick={this.onCancel}>Cancel</Button>
          </div>
        </div>
      </Card>
    );
  }
}

module.exports = DownloadOverlay;
