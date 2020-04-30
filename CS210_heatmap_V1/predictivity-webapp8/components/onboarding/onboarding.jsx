import React from 'react';
import {
    Typography,
    TextField
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';


class Onboarding extends React.Component {
  constructor(props) {
    super(props);
    this.state = {buildingName: '',
                  floorName: '',
                  roomName: '',
                  sensorName: '',
                  jsonData: {},
                  buildingOptions: [],
                  floorOptions: [],
                  roomOptions: [],
                  sensorOptions: [],
                 };

    this.handleBuildingChange = this.handleBuildingChange.bind(this);
    this.handleFloorChange = this.handleFloorChange.bind(this);
    this.handleRoomChange = this.handleRoomChange.bind(this);
    this.handleSensorChange = this.handleSensorChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateOptions = this.updateOptions.bind(this)

  }


  updateOptions() {
    this.setState({buildingOptions: Object.keys(this.state.jsonData)});
    if (this.state.buildingName != "") {
      this.setState({floorOptions: this.state.jsonData[this.state.buildingName] == undefined ? [] : Object.keys(this.state.jsonData[this.state.buildingName])});
      if (this.state.floorName != "") {
        this.setState({roomOptions: (this.state.jsonData[this.state.buildingName] != undefined && this.state.jsonData[this.state.buildingName][this.state.floorName] != undefined) ? Object.keys(this.state.jsonData[this.state.buildingName][this.state.floorName]) : []});
        if (this.state.roomName != "") {
          this.setState({sensorOptions: (this.state.jsonData[this.state.buildingName] != undefined && this.state.jsonData[this.state.buildingName][this.state.floorName] != undefined && this.state.jsonData[this.state.buildingName][this.state.floorName][this.state.roomName] != undefined) ? this.state.jsonData[this.state.buildingName][this.state.floorName][this.state.roomName] : []});
        }
      }
    }
  }

  handleBuildingChange(event, value) {
    this.setState({buildingName: value}, () => { this.updateOptions(); });
  }

  handleFloorChange(event, value) {
    this.setState({floorName: value}, () => { this.updateOptions(); });
  }

  handleRoomChange(event, value) {
    this.setState({roomName: value}, () => { this.updateOptions(); });
  }

  handleSensorChange(event, value) {
    this.setState({sensorName: value}, () => { this.updateOptions(); });
  }

  handleSubmit(event) {
    // Do the creation of the object
    if (this.state.buildingName != "") {
      this.state.jsonData[this.state.buildingName] = this.state.jsonData[this.state.buildingName] != undefined ? this.state.jsonData[this.state.buildingName] : {};
      if (this.state.floorName != "") {
        this.state.jsonData[this.state.buildingName][this.state.floorName] = this.state.jsonData[this.state.buildingName] != undefined && this.state.jsonData[this.state.buildingName][this.state.floorName] != undefined ? this.state.jsonData[this.state.buildingName][this.state.floorName] : {};
        if (this.state.roomName != "") {
          if (this.state.jsonData[this.state.buildingName][this.state.floorName][this.state.roomName] == undefined) {
            this.state.jsonData[this.state.buildingName][this.state.floorName][this.state.roomName] = new Set();
          }
          this.state.jsonData[this.state.buildingName][this.state.floorName][this.state.roomName] = new Set(this.state.jsonData[this.state.buildingName][this.state.floorName][this.state.roomName])
          if (this.state.sensorName != ""){
            this.state.jsonData[this.state.buildingName][this.state.floorName][this.state.roomName].add(this.state.sensorName)
          }
          this.state.jsonData[this.state.buildingName][this.state.floorName][this.state.roomName] = Array.from(this.state.jsonData[this.state.buildingName][this.state.floorName][this.state.roomName])
        }
      }
    }
    console.log(this.state.jsonData);
    this.setState({jsonData: this.state.jsonData});
    this.updateOptions();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div style={{ width: 300 }}>
        <Autocomplete
          freeSolo
          options={this.state.buildingOptions}
          renderInput={params => (
            <TextField {...params} label="Building" margin="normal" variant="outlined" />
          )}
          onInputChange={this.handleBuildingChange}
          value={this.state.buildingName}
        />
        </div>
        <div style={{ width: 300 }}>
        <Autocomplete
          freeSolo
          options={this.state.floorOptions}
          renderInput={params => (
            <TextField {...params} label="Floor" margin="normal" variant="outlined" />
          )}
          onInputChange={this.handleFloorChange}
          value={this.state.floorName}
        />
        </div>
        <div style={{ width: 300 }}>
        <Autocomplete
          freeSolo
          options={this.state.roomOptions}
          renderInput={params => (
            <TextField {...params} label="Room" margin="normal" variant="outlined" />
          )}
          onInputChange={this.handleRoomChange}
          value={this.state.roomName}
        />
        </div>
        <div style={{ width: 300 }}>
        <Autocomplete
          freeSolo
          options={this.state.sensorOptions}
          renderInput={params => (
            <TextField {...params} label="Sensor" margin="normal" variant="outlined" />
          )}
          onInputChange={this.handleSensorChange}
          value={this.state.sensorName}
        />
        </div>
        <input type="submit" value="Submit" />
        <div> {JSON.stringify(this.state.jsonData)}
        </div>
      </form>
    );
  }
}

export default Onboarding;
