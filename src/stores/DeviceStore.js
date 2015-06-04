'use strict';

const alt = require('../alt');

const deviceActions = require('../actions/DeviceActions.js');

class DeviceStore {
  constructor() {

    this.bindListeners({
      onDownload: deviceActions.download,
      onReloadDevices: deviceActions.reloadDevices,
      onUpdateSelected: deviceActions.updateSelected
    });

    this.state = {
      devices: [],
      devicePath: null,
      searching: true,
      selectedDevice: null,
      progress: 0
    };

  }

  onDownload(handlers) {

    function updateProgress(progress){
      this.setState({ progress: progress });
    }

    const { handleSuccess, handleError } = handlers;
    const { workspace, toast, logger, overlay, getBoard } = this.getInstance();
    const { selectedDevice } = this.state;

    const name = workspace.filename.deref();
    const source = workspace.current.deref();

    if(!selectedDevice){
      return;
    }

    const board = getBoard(selectedDevice);

    board.removeListener('terminal', logger);

    board.on('progress', updateProgress.bind(this));

    board.compile(source)
      .tap(() => logger.clear())
      .then((memory) => board.bootload(memory))
      .then(() => board.on('terminal', logger))
      .tap(() => toast.clear())
      .tap(() => handleSuccess(`'${name}' downloaded successfully`))
      .catch(handleError)
      .finally(() => {
        overlay.hide();
        board.removeListener('progress', updateProgress);
        this.setState({ progress: 0 });
      });

  }

  onReloadDevices(){

    const { scanBoards } = this.getInstance();

    const scanOpts = {
      reject: [
        /Bluetooth-Incoming-Port/,
        /Bluetooth-Modem/,
        /dev\/cu\./
      ]
    };
    this.setState({ devicePath: null, searching: true });
    scanBoards(scanOpts)
      .then((devices) => this.setState({ devices: devices, searching: false }));
  }

  onUpdateSelected(device) {
    this.setState({
      devicePath: device.path,
      selectedDevice: device
    });
  }
}

DeviceStore.config = {
  stateKey: 'state'
};

module.exports = alt.createStore(DeviceStore);
