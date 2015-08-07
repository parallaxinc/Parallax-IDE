'use strict';

const red = '#da2100';
const green = '#159600';

const styles = {
  errorToast: {
    backgroundColor: red
  },
  successToast: {
    backgroundColor: green
  }
};

function notifications({ workspace, toast }, opts, done){

  const {
    SAVE_FILE_SUCCESS,
    SAVE_FILE_FAILURE,
    DELETE_FILE_SUCCESS,
    DELETE_FILE_FAILURE,
    CHANGE_FILE_FAILURE,
    DELETE_DIRECTORY_FAILURE,
    CHANGE_DIRECTORY_FAILURE
  } = workspace.STATUS_CONSTANTS;

  workspace.subscribe(() => {
    const { status, notification } = workspace.getState();

    switch(status){
      case SAVE_FILE_SUCCESS:
      case DELETE_FILE_SUCCESS:
        toast.show(notification, { style: styles.successToast, timeout: 5000 });
        break;
      case SAVE_FILE_FAILURE:
      case DELETE_FILE_FAILURE:
      case CHANGE_FILE_FAILURE:
      case DELETE_DIRECTORY_FAILURE:
      case CHANGE_DIRECTORY_FAILURE:
        toast.show(notification, { style: styles.errorToast });
        break;
    }
  });

  done();
}

module.exports = notifications;
