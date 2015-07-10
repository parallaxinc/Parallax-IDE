'use strict';

const _ = require('lodash');

const alt = require('../alt');

const { rx, tx } = require('../actions/transmission');
const { hideDownload, showDownload } = require('../actions/overlay');
const { clearOutput, output } = require('../actions/console');
const { enableAuto, disableAuto, reloadDevices, transmitInput, updateSelected } = require('../actions/device');

class DeviceStore {
  constructor() {

    this.bindListeners({
      onReloadDevices: [reloadDevices, showDownload],
      onDisableAuto: disableAuto,
      onEnableAuto: enableAuto,
      onTransmitInput: transmitInput,
      onUpdateSelected: updateSelected
    });

    this.state = {
      auto: true,
      connection: null,
      devices: [],
      devicePath: null,
      message: null,
      progress: 0,
      searching: true,
      selectedDevice: null,
      transmitText: 'hi'
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

  onEnableAuto(){
    this.setState({ auto: true });
  }

  onReloadDevices(){

    const { scanBoards, workspace } = this.getInstance();
    const { auto } = this.state;
    const source = workspace.current.deref();

    const scanOpts = {
      reject: [
        /Bluetooth-Incoming-Port/,
        /Bluetooth-Modem/,
        /dev\/cu\./
      ],
      source: source
    };

    this.setState({
      devicePath: null,
      message: null,
      searching: true
    });

    scanBoards(scanOpts)
      .then((devices) => this.setState({ devices: devices, searching: false }))
      .then(() => {
        if(auto) {
          this._checkDevices();
        }
    });
  }

  onTransmitInput(input) {

    const { keyCode } = input.nativeEvent;
    this._updateTransmitText(keyCode);

    const { selectedDevice } = this.state;
    const { getBoard } = this.getInstance();

    const board = getBoard(selectedDevice);

    board.write(keyCode)
      .catch((err) => this._handleError(err));
  }

  onUpdateSelected(device) {

    this.setState({
      devicePath: device.path,
      selectedDevice: device,
      message: null
    });

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

  }

  _download() {

    function updateProgress(progress){
      this.setState({ progress: progress });
    }

    const { workspace, getBoard } = this.getInstance();
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
      .tap(() => this._handleClear())
      .tap(() => this._watchConnection(board))
      .tap(() => this._handleSuccess(`'${name}' downloaded successfully`))
      .catch((err) => this._handleError(err))
      .finally(() => {
        board.removeListener('progress', updateProgress);
        this.setState({ progress: 0 });
        hideDownload();
      });
  }

  _updateTransmitText(keyCode) {

    const key = String.fromCharCode(keyCode);
    const { transmitText } = this.state;

    let updatedTransmitText = null;
    const ignorePress = [16, 17, 18, 20];

    if ((keyCode >= 32 && keyCode <= 127) ||
        (keyCode >= 160 && keyCode <= 255)) {
      updatedTransmitText = transmitText + key;
    } else if (keyCode === 8) {
      updatedTransmitText = transmitText.slice(0, -1);
    } else if (keyCode === 10 || keyCode === 13) {
      updatedTransmitText = transmitText + '\n';
    } else if (ignorePress.indexOf(keyCode) > -1) {
      return;
    } else {
      updatedTransmitText = transmitText + ' ';
    }

    this.setState({ transmitText: updatedTransmitText });

  }

  _watchConnection(board) {

    const connection = setInterval(() => {
      if(!board.isOpen()) {
        clearInterval(connection);
        this.setState({ connection: null });
      }
    }, 1000);

    this.setState({
      connection: connection,
      transmitText: ''
    });
  }

  _handleClear(){
    const { toasts } = this.getInstance();

    toasts.clear();
  }

  _handleError(err){
    const { toasts } = this.getInstance();

    toasts.error(err);
  }

  _handleSuccess(msg){
    const { toasts } = this.getInstance();

    toasts.success(msg);
  }

}

DeviceStore.config = {
  stateKey: 'state'
};

module.exports = alt.createStore(DeviceStore);
