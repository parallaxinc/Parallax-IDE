'use strict';

const alt = require('../alt');
const _ = require('lodash');

const { rx, tx } = require('../actions/transmission');
const { showDownload } = require('../actions/overlay');
const { clearOutput, output } = require('../actions/console');
const { download, reloadDevices, updateSelected } = require('../actions/device');

const styles = require('../../plugins/sidebar/styles');

class DeviceStore {
  constructor() {

    this.bindListeners({
      onDownload: download,
      onReloadDevices: [reloadDevices, showDownload],
      onUpdateSelected: updateSelected
    });

    this.state = {
      devices: [],
      devicePath: null,
      message: null,
      searching: true,
      selectedDevice: null,
      progress: 0
    };
  }

  onDownload(handlers) {

    function updateProgress(progress){
      this.setState({ progress: progress });
    }

    const { handleSuccess, handleError, handleComplete } = handlers;
    const { workspace, toast, getBoard } = this.getInstance();
    const { selectedDevice } = this.state;

    const name = workspace.filename.deref();
    const source = workspace.current.deref();

    if(!selectedDevice){
      return;
    }

    const board = getBoard(selectedDevice);

    board.removeListener('terminal', output);
    board.removeListener('terminal', rx);

    board.on('progress', updateProgress.bind(this));
    board.on('progress', tx.bind(this));

    board.bootload(selectedDevice)
      .tap(() => clearOutput())
      .then(() => board.on('terminal', output))
      .then(() => board.on('terminal', rx))
      .tap(() => toast.clear())
      .tap(() => handleSuccess(`'${name}' downloaded successfully`))
      .catch(handleError)
      .finally(() => {
        board.removeListener('progress', updateProgress);
        this.setState({ progress: 0 });
        handleComplete();
      });
  }

  onReloadDevices(){

    const { scanBoards, workspace } = this.getInstance();
    const source = workspace.current.deref();

    const scanOpts = {
      reject: [
        /Bluetooth-Incoming-Port/,
        /Bluetooth-Modem/,
        /dev\/cu\./
      ],
      source: source
    };
    this.setState({ devicePath: null, searching: true });
    scanBoards(scanOpts)
    .then((devices) => this.setState({ devices: devices, searching: false }))
    .then(() => this._checkDevices());

  }

  _checkDevices(){
    const { devices } = this.state;
    const noModulesFoundMessage = 'No BASIC Stamps found.';
    const multipleModulesFoundMessage = 'Please select which module to download to.';
    let matchedDevices = [];

    _.forEach(devices, (device) => {
      if (device.match) {
        matchedDevices.push(device);
      }
    });
    if (matchedDevices.length === 0) {
      console.log('devicenot found');
      this.setState({ message: noModulesFoundMessage });
    }
    else if (matchedDevices.length === 1) {
      console.log('one match found');
      this.setState({
        message: null,
        selectedDevice: matchedDevices[0]
      });
      this.onDownload({
        handleSuccess: this._handleSuccess.bind(this),
        handleError: this._handleError.bind(this)
      });
    }
    else {
      console.log('multiple matches found');
      this.setState({ message: multipleModulesFoundMessage });
    }
  }

  _handleError(err){
    // leaving this in for better debugging of errors
    console.log(err);
    const { toast } = this.getInstance();

    toast.show(err.message, { style: styles.errorToast });
  }

  _handleSuccess(msg){
    const { toast } = this.getInstance();

    toast.show(msg, { style: styles.successToast, timeout: 5000 });
  }

  onUpdateSelected(device) {
    this.setState({
      devicePath: device.path,
      selectedDevice: device
    });

    this.onDownload({
      handleSuccess: this._handleSuccess.bind(this),
      handleError: this._handleError.bind(this)
    });
  }

}

DeviceStore.config = {
  stateKey: 'state'
};

module.exports = alt.createStore(DeviceStore);
