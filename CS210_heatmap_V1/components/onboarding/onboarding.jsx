import React from 'react';
import {
    Typography,
} from '@material-ui/core';

class Onboarding extends React.Component {
  constructor(props) {
    super(props);
    this.state = {buildingName: '', floorName: '', roomName: '', sensorName:'', jsonData:{}};

    this.handleBuildingChange = this.handleBuildingChange.bind(this);
    this.handleFloorChange = this.handleFloorChange.bind(this);
    this.handleRoomChange = this.handleRoomChange.bind(this);
    this.handleSensorChange = this.handleSensorChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }


  handleBuildingChange(event) {
    this.setState({buildingName: event.target.value});
  }

  handleFloorChange(event) {
    this.setState({floorName: event.target.value});
  }

  handleRoomChange(event) {
    this.setState({roomName: event.target.value});
  }

  handleSensorChange(event) {
    this.setState({sensorName: event.target.value});
  }

  handleSubmit(event) {
    // Do the creation of the object
    if (this.state.buildingName != "") {
      this.state.jsonData[this.state.buildingName] = this.state.jsonData[this.state.buildingName] || {};
      if (this.state.floorName != "") {
        this.state.jsonData[this.state.buildingName][this.state.floorName] = this.state.jsonData[this.state.buildingName][this.state.floorName] || {};
        if (this.state.roomName != "") {
          console.log(this.state.jsonData[this.state.buildingName][this.state.floorName][this.state.roomName])
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
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div>
          <label>
            Building:
            <input type="text" value={this.state.buildingName} onChange={this.handleBuildingChange} />
          </label>
        </div>
        <div>
          <label>
            Floor:
            <input type="text" value={this.state.floorName} onChange={this.handleFloorChange} />
          </label>
        </div>
        <div>
          <label>
            Room:
            <input type="text" value={this.state.roomName} onChange={this.handleRoomChange} />
          </label>
        </div>
        <div>
          <label>
            Sensor:
            <input type="text" value={this.state.sensorName} onChange={this.handleSensorChange} />
          </label>
        </div>
        <input type="submit" value="Submit" />
        <div> {JSON.stringify(this.state.jsonData)}
        </div>
      </form>
    );
  }
}

export default Onboarding;
