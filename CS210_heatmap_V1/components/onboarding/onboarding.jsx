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

class Onboarding extends React.Component {
  constructor(props) {
    /*
    TODO: Should probably check that at least one sensor was added to the json
    */
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
                  showFloorMapOnboarding: false,
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
    event.preventDefault();
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
    this.setState({jsonData: this.state.jsonData}, this.updateOptions);
  }

  handleFinishedWithJsonPart = () => {
    this.setState({showFloorMapOnboarding: true});
  }

  handleFinishedWithAllOnboarding = (event) => {
    console.log(this.state.jsonData)
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
          let roomPayload = {
            "name": room,
            "sensors": [],
          }
          for (const sensor in this.state.jsonData[building][floor][room]) {
            let sensorPayload = {
              "sensorType": sensor,
            }
            roomPayload["sensors"].push(sensorPayload)
          }
          floorPayload["rooms"].push(roomPayload)
        }
        buildingPayload["floors"].push(floorPayload)
      }
      let buildingUploadResponse = axios.post(
        "/buildings/", buildingPayload,
        { withCredentials: true });
    }
    // TODO: Upload the room position
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

  render() {
    return (
      <React.Fragment>
        { this.state.showFloorMapOnboarding ?
          <OnboardingFloorMap 
            json={this.state.jsonData}
            onFloorMapUpload={this.handleFloorMapUpload}
            onFinishOnboarding={this.handleFinishedWithAllOnboarding}
          />
        :
        <Grid container justify="center" alignItems="center" direction="column" spacing={5}>
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
          <Autocomplete
            freeSolo
            options={this.state.sensorOptions}
            renderInput={params => (
              <TextField {...params} label="Sensor" margin="normal" variant="outlined" />
            )}
            onInputChange={this.handleSensorChange}
            value={this.state.sensorName}
            style = {{width: 300}}
          />
          <div align="center">
            <Button variant="contained" type="submit" value="Submit">Add Sensor</Button>
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
