'use strict';

const alt = require('../alt');

const DeviceActions = require('../actions/DeviceActions.js');

class DeviceStore {
  constructor() {
    this.bindActions(DeviceActions);

    this.state = {
      devices: [],
      devicePath: null,
      searching: false,
      selectedDevice: null,
      progress: 0
    };
  }

  onDownload(arr) {
    // TODO: don't need to pass device
    // TODO: do not pass in props, get them from the bound instance from index.js
    const [ device, props ] = arr;
    const { irken, handleError, handleSuccess } = props;
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

  onReloadDevices(obj){
    // TODO: change setting state to use setState, not on this.
    const props = obj;
    const irken = props.irken;
    const scanOpts = {
      reject: [
        /Bluetooth-Incoming-Port/,
        /Bluetooth-Modem/,
        /dev\/cu\./
      ]
    };
    this.setState({ devicePath: null, searching: true });
    irken.scanBoards(scanOpts)
      .then((devices) => this.setState({ devices: devices, searching: false }));
  }

  onUpdateProgress(progress){
    this.setState({ progress: progress });
  }

  // TODO: don't pass device, just grab the currently selected device
  onUpdateSelected(device) {
    this.setState({
      devicePath: device.path,
      selectedDevice: device
    });
  }
};

DeviceStore.config = {
  stateKey: 'state'
};

module.exports = alt.createStore(DeviceStore);
