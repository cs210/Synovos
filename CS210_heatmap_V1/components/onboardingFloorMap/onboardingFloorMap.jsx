import React from 'react';
import {
    Typography,
    Button
} from '@material-ui/core';
import { render } from 'react-dom';
import { Stage, Layer, Rect, Text, Image } from 'react-konva';
import Konva from 'konva';
import FloorMap from './floormap'

class OnboardingFloorMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
      <Button
        variant="contained"
        onClick={this.handleImageUpload}>
          Upload Image
      </Button>
      <FloorMap/>
      </div>
    );
  }
}

export default OnboardingFloorMap;
