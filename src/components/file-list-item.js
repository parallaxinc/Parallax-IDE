'use strict';

const React = require('react');
const ListItem = require('react-material/components/ListItem');

const red = '#da2100';
const green = '#159600';
const styles = {
  fileTempIndicator: {
    backgroundColor: green,
    height: 10,
    width: 10,
    borderRadius: '100%',
    marginRight: 5,
    display: 'inline-block'
  },
  fileHasTemp: {
    backgroundColor: red
  }
};

class FileListItem extends React.Component {
  render(){
    const {
      filename,
      temp,
      onClick
    } = this.props;

    const liStyle = {
      listStyleType: 'none',
      padding: "14px 16px 15px"
    }

    const tempStyles = [styles.fileTempIndicator];
    if(temp){
      tempStyles.push(styles.fileHasTemp);
    }

    return (
      <li styles={liStyle} onClick={onClick}>
        <span styles={tempStyles} /> {filename}
      </li>
    );
  }
}

module.exports = FileListItem;
