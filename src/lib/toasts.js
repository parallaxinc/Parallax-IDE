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

function toasts(api, highlighter){

  function success(msg){
    api.show(msg, { style: styles.successToast, timeout: 5000 });
  }

  function error(err){
    // leaving this in for better debugging of errors
    console.log(err);

    api.show(err.message, { style: styles.errorToast });

    if(typeof highlighter !== 'function'){
      return;
    }

    if(err && err.errorLength){
      highlighter(err.errorPosition, err.errorLength);
    }
  }

  function clear(){
    api.clear();
  }

  return {
    success,
    error,
    clear
  };
}

module.exports = toasts;
