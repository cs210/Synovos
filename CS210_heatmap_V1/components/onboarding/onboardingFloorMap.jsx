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
      currentRoomIdx: 0,
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
  }

  handleRoomSelect = (event) => {
    let oldBuildingandFloor = [this.rooms[this.state.currentRoomIdx][0], this.rooms[this.state.currentRoomIdx][1]]
    this.setState({currentRoomIdx: this.state.currentRoomIdx != this.rooms.length - 1 ? this.state.currentRoomIdx + 1 : null}, function() {
      if (this.state.currentRoomIdx == null) {
        return
      }
      if (oldBuildingandFloor[0] != this.rooms[this.state.currentRoomIdx][0] || oldBuildingandFloor[1] != this.rooms[this.state.currentRoomIdx][1]) {
        this.setState({isPromptFloorMap: true})
      }
    })
  }

  render() {
    return (
      <Grid container justify="center" alignItems="center" direction="column" spacing={5}>
        { this.state.currentRoomIdx != null 
          ?
            <Grid container item>
              <Grid container item justify="center" alignItems="center" direction="row" spacing={5}>
                <Grid item>
                  {this.state.isPromptFloorMap ?
                    <Typography variant="h6">
                      {`For building ${this.rooms[this.state.currentRoomIdx][0]} upload the floormap for ${this.rooms[this.state.currentRoomIdx][1]}.`}
                    </Typography>
                    : 
                    <Typography variant="h6">
                      {`For building ${this.rooms[this.state.currentRoomIdx][0]}, floor ${this.rooms[this.state.currentRoomIdx][1]}, select the room ${this.rooms[this.state.currentRoomIdx][2]} on the floor map.`}
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

              <Grid item>
              { !this.state.isPromptFloorMap &&
                <FloorMap
                  currentFloorMap={this.state.currentFloorMapPicture}
                  currentRoom={this.rooms[this.state.currentRoomIdx]}
                  onRoomSelectFinish={this.handleRoomSelect}
                />
              }
              </Grid>
            </Grid>
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
