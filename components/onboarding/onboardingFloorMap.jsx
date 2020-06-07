import React from 'react';
import {
    Typography,
    Button,
    Grid,
    Fade
} from '@material-ui/core';
import { render } from 'react-dom';
import { Stage, Layer, Rect, Text, Image } from 'react-konva';
import Konva from 'konva';
import FloorMap from './floormap'
import PropTypes from 'prop-types';
import Papa from 'papaparse';
import Input from '@material-ui/core/Input';


class UploadFloorMapStep extends React.Component {
  render() {
    if (this.props.currentStep !== "uploadFloorMap") {
      return null
    }

    return(
      <Grid container direction="column" justify="center" alignItems="center" spacing={5}>
        <Grid item>
          <Typography variant="h6">
            {`For building ${this.props.currentBuilding} upload the floormap for ${this.props.currentFloor}.`}
          </Typography>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            onClick={this.props.onSubmit}>
              Upload Image
          </Button>
        </Grid>
      </Grid>
    )
  }
}

UploadFloorMapStep.propTypes = {
    currentStep: PropTypes.string.isRequired,
    currentBuilding: PropTypes.string.isRequired,
    currentFloor: PropTypes.string.isRequired,
    onSubmit: PropTypes.func.isRequired,
}



class SelectRoomStep extends React.Component {
  render() {
    if (this.props.currentStep !== "selectRoom") {
      return null
    }

    return(
      <Grid container direction="column" spacing={5}>
        <Grid item>
          <Grid container justify = "center">
          <Typography variant="h6">
            {`Click and drag to select the room ${this.props.currentRoom}.`}
          </Typography>
          </Grid>
        </Grid>
        <Grid item >
          <FloorMap
            mode={"onboarding"}
            currentFloorMap={this.props.currentFloorMapPicture}
            currentRoom={this.props.currentRoom}
            onRoomSelect={this.props.handleRoomSelect}
            rooms={this.props.rooms}
          />
        </Grid>
      </Grid>
    )
  }
}

SelectRoomStep.propTypes = {
    currentStep: PropTypes.string.isRequired,
    currentRoom: PropTypes.string.isRequired,
    currentFloorMapPicture: PropTypes.string.isRequired,
    handleRoomSelect: PropTypes.func.isRequired,
    rooms: PropTypes.arrayOf(PropTypes.object).isRequired
}


class FinishSelectRoomStep extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      resetKey: ""
    };
  }

  handleReset = (event) => {
    this.setState({
      resetKey: this.state.resetKey + "0"
    });
  }

  render() {
    if (this.props.currentStep !== "finishSelectRoom") {
      return null
    }

    return(
      <Grid container direction="column" spacing={5}>
        <Grid container direction="row" justify="space-between" item>
          <Grid item>
            <Typography variant="h6">
              {`Adjust the location of room ${this.props.currentRoom}.`}
            </Typography>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              onClick={this.handleReset}>
                Reset
            </Button>
            <Button
              variant="contained"
              onClick={() => {this.child.getRooms()}}>
                Finished
            </Button>
          </Grid>
        </Grid>
        <Grid item>
          <FloorMap
            key={this.state.resetKey}
            ref={Ref => this.child=Ref }
            mode={"adjusting"}
            currentFloorMap={this.props.currentFloorMapPicture}
            rooms={this.props.rooms}
            onRoomSelectFinish={this.props.onRoomSelectFinish}
          />
        </Grid>
      </Grid>
    )
  }
}

FinishSelectRoomStep.propTypes = {
    currentStep: PropTypes.string.isRequired,
    currentRoom: PropTypes.string.isRequired,
    currentFloorMapPicture: PropTypes.string.isRequired,
    rooms: PropTypes.arrayOf(PropTypes.object).isRequired,
    onRoomSelectFinish: PropTypes.func.isRequired,
}


class UploadRoomDataStep extends React.Component {
  constructor() {
    super();
    this.state = {
      temperature_csvfile: undefined,
      temperature_data: undefined,
      co2_csvfile: undefined,
      co2_data: undefined,
    };
  }

  importTemperatureCSV = (event) => {
    const csvfile = event.target.files[0];
    this.setState({
      temperature_csvfile: csvfile
    });
    Papa.parse(csvfile, {
      complete: (result) => {
          let data = result.data.slice(2)
          this.setState({
            temperature_data: data
          });
        },
    });
  };


  importCo2CSV = (event) => {
    const csvfile = event.target.files[0];
    this.setState({
      co2_csvfile: csvfile
    });
    Papa.parse(csvfile, {
      complete: (result) => {
          let data = result.data.slice(1)
          this.setState({
            co2_data: data
          });
        },
    });
  };


  onUploadClick = (event) => {
    this.props.onUploadData(this.state.temperature_data, this.state.co2_data)
  }


  render() {
    if (this.props.currentStep !== "uploadRoomData") {
      return null
    }

    return(
      <React.Fragment>
        <Typography variant="h6">
          {`Import CSV temparature data for room  ${this.props.currentRoom}.`}
        </Typography>
        <Input
          type="file"
          ref={input => {
            this.filesInput = input;
          }}
          name="file"
          placeholder={null}
          onChange={this.importTemperatureCSV}
        />
        <p />
        <Typography variant="h6">
          {`Import CSV CO2 data for room  ${this.props.currentRoom}.`}
        </Typography>
        <Input
          type="file"
          ref={input => {
            this.filesInput = input;
          }}
          name="file"
          placeholder={null}
          onChange={this.importCo2CSV}
        />
        <p />
        <Button
          variant="contained"
          onClick={this.onUploadClick}>
          Continue
        </Button>
      </React.Fragment>
    );
  }
}



class ThankYouStep extends React.Component {
  render() {
    if (this.props.currentStep !== "thankYou") {
      return null
    }

    return(
      <React.Fragment>
        <Typography variant="h5">
          {`Thank You! Your building information has been uploaded.`}
        </Typography>
      </React.Fragment>
    )
  }
}


ThankYouStep.propTypes = {
    currentStep: PropTypes.string.isRequired,
}



class OnboardingFloorMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentRoomsIdx: 0,
      currentFloorMapPicture: "", 
      currentStep: "uploadFloorMap",
    };

    this.rooms = []

    for (const building in props.json) {
      for (const floor in props.json[building]) {
        for (const room in props.json[building][floor]) {
          this.rooms.push([building, floor, room, props.json[building][floor][room]])
        }
      }
    }

    // This is different from the rooms above, used more for the heatmap stuff....
    this.oldRooms = []
  }

  handleImageUpload = (event) => {
    var pwd;
    while(pwd == null) pwd = prompt('Please enter the url to your floormap image.')
    this.setState({currentFloorMapPicture: pwd})
    this.props.onFloorMapUpload(this.rooms[this.state.currentRoomsIdx][0], this.rooms[this.state.currentRoomsIdx][1], pwd)
    this.nextStep()
  }


  nextStep = () => {
    if (this.state.currentStep === "uploadFloorMap") {
      this.setState({currentStep: "selectRoom"})
    } else if (this.state.currentStep === "selectRoom") {
      this.setState({currentStep: "finishSelectRoom"})
    } else if (this.state.currentStep === "finishSelectRoom") {
      this.setState({currentStep: "uploadRoomData"})
    } else if (this.state.currentStep === "uploadRoomData") {
      let oldBuildingandFloor = [this.rooms[this.state.currentRoomsIdx][0], this.rooms[this.state.currentRoomsIdx][1]]

      // Check if we are done
      if (this.state.currentRoomsIdx + 1 === this.rooms.length) {
        this.setState({currentStep: "thankYou"}, this.props.onFinishOnboarding)
      } else {
        this.setState({currentRoomsIdx: this.state.currentRoomsIdx + 1}, function() {
          if (oldBuildingandFloor[0] != this.rooms[this.state.currentRoomsIdx][0] || oldBuildingandFloor[1] != this.rooms[this.state.currentRoomsIdx][1]) {
            this.setState({currentStep: "uploadFloorMap"})
            this.oldRooms = []
          } else {
            this.setState({currentStep: "selectRoom"})
          }
        })
      }
    }
  }


  handleRoomSelect = (event, room) => {
    this.oldRooms.push({
        x: room.x,
        y: room.y,
        width: room.width,
        height: room.height,
        key: this.rooms[this.state.currentRoomsIdx][2],
        opacity: 0.25,
        fill: "green",
        draggable: true,
        text: this.rooms[this.state.currentRoomsIdx][2],
    })
    
    this.nextStep()
  }


  handleRoomSelectFinish = (event, room) => {
    this.props.onRoomSelect(this.rooms[this.state.currentRoomsIdx][0], this.rooms[this.state.currentRoomsIdx][1], this.rooms[this.state.currentRoomsIdx][2], 
      {
        x: room.x,
        y: room.y,
        width: room.width,
        height: room.height,
      })

    this.oldRooms.pop()
    this.oldRooms.push({
        x: room.x,
        y: room.y,
        width: room.width,
        height: room.height,
        key: this.rooms[this.state.currentRoomsIdx][2],
        opacity: 0.25,
        fill: "black",
        draggable: false,
        text: this.rooms[this.state.currentRoomsIdx][2],
    })

    this.nextStep()
  }


  handleRoomUploadData = (temparature_data, co2_data) => {
    this.props.onRoomUploadData(this.rooms[this.state.currentRoomsIdx][0],
                                this.rooms[this.state.currentRoomsIdx][1],
                                this.rooms[this.state.currentRoomsIdx][2],
                                temparature_data, co2_data)
    this.nextStep()
  }


  render() {
    return (
      <React.Fragment>

      <UploadFloorMapStep
        currentStep={this.state.currentStep}
        currentBuilding={this.rooms[this.state.currentRoomsIdx][0]}
        currentFloor={this.rooms[this.state.currentRoomsIdx][1]}
        onSubmit={this.handleImageUpload}
      />

      <SelectRoomStep
        currentStep={this.state.currentStep}
        currentRoom={this.rooms[this.state.currentRoomsIdx][2]}
        currentFloorMapPicture={this.state.currentFloorMapPicture}
        handleRoomSelect={this.handleRoomSelect}
        rooms={this.oldRooms}
      />

      <FinishSelectRoomStep
        currentStep={this.state.currentStep}
        currentRoom={this.rooms[this.state.currentRoomsIdx][2]}
        currentFloorMapPicture={this.state.currentFloorMapPicture}
        rooms={this.oldRooms}
        onRoomSelectFinish={this.handleRoomSelectFinish}
      />

      <UploadRoomDataStep
        currentStep={this.state.currentStep}
        currentRoom={this.rooms[this.state.currentRoomsIdx][2]}
        onUploadData={this.handleRoomUploadData}
      />

      <ThankYouStep
        currentStep={this.state.currentStep}
      />

      </React.Fragment>
    )
  }
}

export default OnboardingFloorMap;
