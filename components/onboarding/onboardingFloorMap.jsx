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
  render() {
    if (this.props.currentStep !== "finishSelectRoom") {
      return null
    }

    return(
      <Grid container direction="column" spacing={5}>
        <Grid item>
            <Typography variant="h6">
              {`Adjust the location of room ${this.props.currentRoom}.`}
            </Typography>
            <Button
              variant="contained"
              onClick={() => {this.child.getRooms()}}>
                Finished
            </Button>
        </Grid>
        <Grid item>
          <FloorMap
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
          this.rooms.push([building, floor, room])
        }
      }
    }

    // This is different from the rooms above, used more for the heatmap stuff....
    this.oldRooms = []
  }

  handleImageUpload = (event) => {
    var pwd;
    while(pwd == null) pwd = prompt('Please enter the url to your floormap image.')
    this.setState({currentFloorMapPicture: pwd, currentStep: "selectRoom"})
    this.props.onFloorMapUpload(this.rooms[this.state.currentRoomsIdx][0], this.rooms[this.state.currentRoomsIdx][1], pwd)
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
    this.setState({currentStep: "finishSelectRoom"})
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

    let oldBuildingandFloor = [this.rooms[this.state.currentRoomsIdx][0], this.rooms[this.state.currentRoomsIdx][1]]

    if (this.state.currentRoomsIdx === this.rooms.length - 1) {
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

      <ThankYouStep
        currentStep={this.state.currentStep}
      />

      </React.Fragment>
    )
  }
}

export default OnboardingFloorMap;
