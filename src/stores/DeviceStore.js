'use strict';

const alt = require('../alt');

const DeviceActions = require('../actions/DeviceActions.js');

class DeviceStore {
  constructor() {

    this.bindActions(DeviceActions);

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

    const { workspace, toast, logger, overlay, getBoard } = this.getInstance();

    const [ handleSuccess, handleError ] = handlers;
    const device = this.state.selectedDevice;

    const name = workspace.filename.deref();
    const source = workspace.current.deref();

    if(!device){
      return;
    }

    const board = getBoard(device);

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

  onReloadDevices(obj){
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
