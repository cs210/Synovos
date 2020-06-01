import React from 'react';
import {
    Typography,
    TextField,
    Button,
    Grid
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import OnboardingFloorMap from './onboardingFloorMap';
import axios from "axios";
import mongoose from 'mongoose';

class Onboarding extends React.Component {
  constructor(props) {
    super(props);
    this.state = {buildingName: '',
                  floorName: '',
                  roomName: '',
                  jsonData: {},
                  buildingOptions: [],
                  floorOptions: [],
                  roomOptions: [],
                  showFloorMapOnboarding: false,
                 };

    this.handleBuildingChange = this.handleBuildingChange.bind(this);
    this.handleFloorChange = this.handleFloorChange.bind(this);
    this.handleRoomChange = this.handleRoomChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateOptions = this.updateOptions.bind(this)

  }


  updateOptions() {
    this.setState({buildingOptions: Object.keys(this.state.jsonData)});
    if (this.state.buildingName != "") {
      this.setState({floorOptions: this.state.jsonData[this.state.buildingName] == undefined ? [] : Object.keys(this.state.jsonData[this.state.buildingName])});
      if (this.state.floorName != "") {
        this.setState({roomOptions: (this.state.jsonData[this.state.buildingName] != undefined && this.state.jsonData[this.state.buildingName][this.state.floorName] != undefined) ? Object.keys(this.state.jsonData[this.state.buildingName][this.state.floorName]) : []});
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


  handleSubmit(event) {
    event.preventDefault();
    // Do the creation of the object
    if (this.state.buildingName != "") {
      this.state.jsonData[this.state.buildingName] = this.state.jsonData[this.state.buildingName] != undefined ? this.state.jsonData[this.state.buildingName] : {};
      if (this.state.floorName != "") {
        this.state.jsonData[this.state.buildingName][this.state.floorName] = this.state.jsonData[this.state.buildingName] != undefined && this.state.jsonData[this.state.buildingName][this.state.floorName] != undefined ? this.state.jsonData[this.state.buildingName][this.state.floorName] : {};
        if (this.state.roomName != "") {
          if (this.state.jsonData[this.state.buildingName][this.state.floorName][this.state.roomName] == undefined) {
            this.state.jsonData[this.state.buildingName][this.state.floorName][this.state.roomName] = {};
          }
        }
      }
    }
    this.setState({jsonData: this.state.jsonData}, this.updateOptions);
  }

  handleFinishedWithJsonPart = () => {
    if (Object.keys(this.state.jsonData).length !== 0) {
      this.setState({showFloorMapOnboarding: true});
    }
  }

  datesAreOnSameDay = (first, second) => {
      return first.getFullYear() === second.getFullYear() &&
             first.getMonth() === second.getMonth() &&
             first.getDate() === second.getDate()
  }


  processSensorData = (data, room_id, sensor_type) => {
    let entries = []
    let currentTime = new Date(Date.parse(data[0][0]))
    let currentEntry = {
      "sensor_type": sensor_type,
      "room_id": room_id,
      "date": currentTime,
      "readings": [],
    }

    for (let row of data) {
      let time = new Date(Date.parse(row[0]))

      if (this.datesAreOnSameDay(time, currentTime)) {
        let reading = {
          "time": time,
          "data": parseFloat(row[2])
        }    
        currentEntry["readings"].push(reading)
      } else {
        entries.push(currentEntry)
        currentTime = time
        currentEntry = {
          "sensor_type": sensor_type,
          "room_id": room_id,
          "date": time,
          "readings": [],
        }
      }
    }

    return entries

  }


  handleFinishedWithAllOnboarding = (event) => {
    for (const building in this.state.jsonData) {
      let buildingPayload = {
        "name": building,
        "floors": [],
      }
      for (const floor in this.state.jsonData[building]) {
        let floorPayload = {
          "name": floor,
          "img_url": this.state.jsonData[building][floor].img_url,
          "rooms": [],
        }
        for (const room in this.state.jsonData[building][floor]) {
          if (room == "img_url") {
            continue
          }

          let room_id = mongoose.Types.ObjectId()

          let roomPayload = {
            "name": room,
            "_id": room_id,
            "location": this.state.jsonData[building][floor][room].location
          }

          if (this.state.jsonData[building][floor][room].temperature_data !== undefined) {
            for (let sensorPayload of this.processSensorData(this.state.jsonData[building][floor][room].temperature_data, room_id, "Temperature")) {
              let sensorUploadResponse = axios.post(
                "/sensorData/", sensorPayload,
                { withCredentials: true });
            }
          }

          if (this.state.jsonData[building][floor][room].co2_data !== undefined) {
            for (let sensorPayload of this.processSensorData(this.state.jsonData[building][floor][room].co2_data, room_id, "CO2")) {
              let sensorUploadResponse = axios.post(
                "/sensorData/", sensorPayload,
                { withCredentials: true });
            }
          }


          floorPayload["rooms"].push(roomPayload)
        }
        buildingPayload["floors"].push(floorPayload)
      }
      let buildingUploadResponse = axios.post(
        "/buildings/", buildingPayload,
        { withCredentials: true });
    }
  }

  handleFloorMapUpload = (building, floor, floorMapUrl) => {
    this.setState(prevState => ({
      ...prevState,
      jsonData: {
        ...prevState.jsonData,
        [building]: {
          ...prevState.jsonData[building],
          [floor]: {
            ...prevState.jsonData[building][floor],
            img_url: floorMapUrl,
          }
        }
      }
    }))
  }

  handleRoomSelect = (building, floor, room, location) => {
    this.setState(prevState => ({
      ...prevState,
      jsonData: {
        ...prevState.jsonData,
        [building]: {
          ...prevState.jsonData[building],
          [floor]: {
            ...prevState.jsonData[building][floor],
            [room]: {
              location: location,
              ...prevState.jsonData[building][room],
            }
          }
        }
      }
    }))
  }

  handleRoomUploadData = (building, floor, room, temperature_data, co2_data) => {
    this.setState(prevState => ({
      ...prevState,
      jsonData: {
        ...prevState.jsonData,
        [building]: {
          ...prevState.jsonData[building],
          [floor]: {
            ...prevState.jsonData[building][floor],
            [room]: {
              temperature_data: temperature_data,
              co2_data: co2_data,
              location: prevState.jsonData[building][floor][room].location,
            }
          }
        }
      }
    }))
  }

  render() {
    return (
      <React.Fragment>
        { this.state.showFloorMapOnboarding ?
          <OnboardingFloorMap 
            json={this.state.jsonData}
            onFloorMapUpload={this.handleFloorMapUpload}
            onFinishOnboarding={this.handleFinishedWithAllOnboarding}
            onRoomSelect={this.handleRoomSelect}
            onRoomUploadData={this.handleRoomUploadData}
          />
        :
        <Grid container alignItems="center" direction="column" spacing={5}>
        <Grid item>
        <form onSubmit={this.handleSubmit}>
          <Autocomplete
            freeSolo
            options={this.state.buildingOptions}
            renderInput={params => (
              <TextField {...params} label="Building" margin="normal" variant="outlined"/>
            )}
            onInputChange={this.handleBuildingChange}
            value={this.state.buildingName}
            style = {{width: 300}}
          />
          <Autocomplete
            freeSolo
            options={this.state.floorOptions}
            renderInput={params => (
              <TextField {...params} label="Floor" margin="normal" variant="outlined"/>
            )}
            onInputChange={this.handleFloorChange}
            value={this.state.floorName}
            style = {{width: 300}}
          />
          <Autocomplete
            freeSolo
            options={this.state.roomOptions}
            renderInput={params => (
              <TextField {...params} label="Room" margin="normal" variant="outlined" />
            )}
            onInputChange={this.handleRoomChange}
            value={this.state.roomName}
            style = {{width: 300}}
          />
          <div align="center">
            <Button variant="contained" type="submit" value="Submit">Add Room</Button>
          </div>
        </form>
        </Grid>
        <Grid item>
        <Button variant="contained" color="primary" onClick={this.handleFinishedWithJsonPart}>Finished</Button>
        </Grid>
        <Grid item>
        <Typography>
          {JSON.stringify(this.state.jsonData)}
        </Typography>
        </Grid>
        </Grid>
        }
      </React.Fragment>
    );
  }
}

export default Onboarding;
