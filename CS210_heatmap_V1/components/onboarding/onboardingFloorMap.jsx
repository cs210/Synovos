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

class OnboardingFloorMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentRoomsIdx: 0,
      currentFloorMapPicture: null,
      isPromptFloorMap: true,
    };

    this.rooms = []

    for (const building in props.json) {
      for (const floor in props.json[building]) {
        for (const room in props.json[building][floor]) {
          this.rooms.push([building, floor, room])
        }
      }
    }
  }

  handleImageUpload = (event) => {
    var pwd;
    while(pwd == null) pwd = prompt('Please enter the url to your floormap image.')
    this.setState({currentFloorMapPicture: pwd})
    this.setState({isPromptFloorMap: false})
    this.props.onFloorMapUpload(this.rooms[this.state.currentRoomsIdx][0], this.rooms[this.state.currentRoomsIdx][1], pwd)
  }

  handleRoomSelect = (event, room) => {
    this.props.onRoomSelect(this.rooms[this.state.currentRoomsIdx][0], this.rooms[this.state.currentRoomsIdx][1], this.rooms[this.state.currentRoomsIdx][2], 
      {
        x: room.x,
        y: room.y,
        width: room.width,
        height: room.height,
      })
    let oldBuildingandFloor = [this.rooms[this.state.currentRoomsIdx][0], this.rooms[this.state.currentRoomsIdx][1]]
    this.setState({currentRoomsIdx: this.state.currentRoomsIdx != this.rooms.length - 1 ? this.state.currentRoomsIdx + 1 : null}, function() {
      if (this.state.currentRoomsIdx == null) {
        this.props.onFinishOnboarding()
        return
      }
      if (oldBuildingandFloor[0] != this.rooms[this.state.currentRoomsIdx][0] || oldBuildingandFloor[1] != this.rooms[this.state.currentRoomsIdx][1]) {
        this.setState({isPromptFloorMap: true})
      }
    })
  }

  render() {
    return (
      <Grid container direction="column" spacing={5}>
        { this.state.currentRoomsIdx != null 
          ?
            <div>
            <Grid container item>
              <Grid container item justify="center" alignItems="center" direction="row" spacing={5}>
                <Grid item>
                  {this.state.isPromptFloorMap ?
                    <Typography variant="h6">
                      {`For building ${this.rooms[this.state.currentRoomsIdx][0]} upload the floormap for ${this.rooms[this.state.currentRoomsIdx][1]}.`}
                    </Typography>
                    : 
                    <Typography variant="h6">
                      {`For building ${this.rooms[this.state.currentRoomsIdx][0]}, floor ${this.rooms[this.state.currentRoomsIdx][1]}, select the room ${this.rooms[this.state.currentRoomsIdx][2]} on the floor map.`}
                    </Typography>
                  }
                </Grid>
                <Grid item>
                  {
                    this.state.isPromptFloorMap &&
                    <Button
                      variant="contained"
                      onClick={this.handleImageUpload}>
                        Upload Image
                    </Button>
                  }
                </Grid>
              </Grid>
            </Grid>

            <Grid item>
            { !this.state.isPromptFloorMap &&
              <FloorMap
                mode={"onboarding"}
                currentFloorMap={this.state.currentFloorMapPicture}
                currentRoom={this.rooms[this.state.currentRoomsIdx][2]}
                onRoomSelectFinish={this.handleRoomSelect}
              />
            }
            </Grid>
          </div>
        :
          <Grid item> 
            <Typography variant="h3"> Thank You! </Typography>
          </Grid>
        }
      </Grid>
    );
  }
}

export default OnboardingFloorMap;
