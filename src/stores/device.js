'use strict';

const alt = require('../alt');
const _ = require('lodash');

const { rx, tx } = require('../actions/transmission');
const { hideDownload, showDownload } = require('../actions/overlay');
const { clearOutput, output } = require('../actions/console');
const { disableAuto, reloadDevices, updateSelected } = require('../actions/device');
const { handleSuccess, handleError } = require('../actions/file');

class DeviceStore {
  constructor() {

    this.bindListeners({
      onReloadDevices: [reloadDevices, showDownload],
      onDisableAuto: disableAuto,
      onUpdateSelected: updateSelected
    });

    this.state = {
      auto: true,
      devices: [],
      devicePath: null,
      message: null,
      searching: true,
      selectedDevice: null,
      progress: 0
    };

    this.messages = {
      none: 'No BASIC Stamps found.',
      noneMatched: 'No matching BASIC Stamps found.',
      multiple: 'Please select which module to download to.'
    };
  }

  onDisableAuto() {
    this.setState({ auto: false });
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

  onUpdateSelected(device) {

    this.setState({
      devicePath: device.path,
      selectedDevice: device
    });

    if(!device.name) {
      return;
    }

    this._download();
  }

  _checkDevices(){
    const { auto, devices } = this.state;
    const { none, noneMatched, multiple } = this.messages;
    let matchedDevices = [];
    let exists = false;

    _.forEach(devices, (device) => {
      if (device.match) {
        matchedDevices.push(device);
      }
      if (device.name) {
        exists = true;
      }
    });

    if (!exists) {

      this.setState({ message: none });

    } else if (matchedDevices.length === 0) {

      //TODO: setup for part 4 of auto download issue
      this.setState({ message: noneMatched });

    } else if(matchedDevices.length === 1) {

      this.setState({
        message: null,
        selectedDevice: matchedDevices[0]
      });

      if (auto) {
        this._download();
      }

    } else {

      this.setState({ message: multiple });

    }

    this.setState({ auto: true });

  }

  _download() {

    function updateProgress(progress){
      this.setState({ progress: progress });
    }

    const { workspace, toast, getBoard } = this.getInstance();
    const { selectedDevice } = this.state;

    const name = workspace.filename.deref();

    if(!selectedDevice){
      return;
    }

    const board = getBoard(selectedDevice);

    board.removeListener('terminal', output);
    board.removeListener('terminal', rx);

    board.on('progress', updateProgress.bind(this));
    board.on('progress', tx.bind(this));

    board.bootload(selectedDevice.program)
      .tap(() => clearOutput())
      .then(() => board.on('terminal', output))
      .then(() => board.on('terminal', rx))
      .tap(() => toast.clear())
      .tap(() => handleSuccess(`'${name}' downloaded successfully`))
      .catch(handleError)
      .finally(() => {
        board.removeListener('progress', updateProgress);
        this.setState({ progress: 0 });
        hideDownload();
      });
  }

}

DeviceStore.config = {
  stateKey: 'state'
};

module.exports = alt.createStore(DeviceStore);
