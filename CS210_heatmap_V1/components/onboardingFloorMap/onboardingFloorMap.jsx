import React from 'react';
import {
    Typography,
    Button
} from '@material-ui/core';
import { render } from 'react-dom';
import { Stage, Layer, Rect, Text } from 'react-konva';
import Konva from 'konva';


class ColoredRect extends React.Component {
  state = {
    color: 'green'
  };
  handleClick = () => {
    this.setState({
      color: Konva.Util.getRandomColor()
    });
  };
  render() {
    return (
      <Rect
        x={20}
        y={20}
        width={50}
        height={50}
        fill={this.state.color}
        shadowBlur={5}
        onClick={this.handleClick}
      />
    );
  }
}

class OnboardingFloorMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {buildingName: '',
                  floorName: '',
                  roomName: '',
                  jsonData: {},
                  rectange: null,
                 };

    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleMouseUp = this.handleMouseUp.bind(this)
    this.handleMouseMove = this.handleMouseMove.bind(this)

    this.stageRef = React.createRef();
    this.layerRef = React.createRef();
    this._drawing = false;
  }

  handleMouseDown(event) {
    this._drawing = true;
    var pos = this.stageRef.current.getPointerPosition();
    this.rectangle = new Konva.Rect({   
      x: pos.x,
      y: pos.y,
      width: 50,
      height: 50,
      fill: 'black',
      stroke: 'black',
      strokeWidth: 4
    });
    this.layerRef.current.add(this.rectangle);

    this.oldX = pos.x
    this.oldY = pos.y
  }

  handleMouseUp() {
    this._drawing = false;
  }

  handleMouseMove() {
    if (!this._drawing) {
        return;
    }

    var pos = this.stageRef.current.getPointerPosition();
    console.log(this.oldX)
    console.log(pos[0])
    var newRectangle = new Konva.Rect({   
      x: this.oldX,
      y: this.oldY,
      width: pos[0] - this.oldX,
      height: pos[1] - this.oldY,
      fill: 'black',
      stroke: 'black',
      strokeWidth: 4
    });
    this.layerRef.current.remove(this.rectangle);
    this.layerRef.current.add(newRectangle);
    this.rectangle = newRectangle;
    // this.rectangle.width = pos.x - this.rectangle.x 
    // this.rectangle.height = pos.y - this.rectangle.y
    this.layerRef.current.draw();
  }


  render() {
    return (
      <div>
      <Button variant="contained" onClick={this.handleImageUpload}>Upload Image</Button>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onContentMousedown={this.handleMouseDown}
        onContentMousemove={this.handleMouseMove}
        onContentMouseup={this.handleMouseUp}
        ref={this.stageRef}
      >

        <Layer ref={this.layerRef}>
        </Layer>
      </Stage>
      </div>
    );
  }
}

export default OnboardingFloorMap;
