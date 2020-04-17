import React from 'react';
import {
    Typography,
    Button
} from '@material-ui/core';
import { render } from 'react-dom';
import { Stage, Layer, Rect, Text, Image } from 'react-konva';
import Konva from 'konva';
import update from 'immutability-helper'


class URLImage extends React.Component {
  state = {
    image: null
  };

  componentDidMount() {
    this.loadImage();
  }

  componentDidUpdate(oldProps) {
    if (oldProps.src !== this.props.src) {
      this.loadImage();
    }
  }

  componentWillUnmount() {
    this.image.removeEventListener('load', this.handleLoad);
  }

  loadImage() {
    // save to "this" to remove "load" handler on unmount
    this.image = new window.Image();
    this.image.src = this.props.src;
    this.image.addEventListener('load', this.handleLoad);
  }

 handleLoad = () => {
    // after setState react-konva will update canvas and redraw the layer
    // because "image" property is changed
    this.setState({
      image: this.image
    });
    // if you keep same image object during source updates
    // you will have to update layer manually:
    // this.imageNode.getLayer().batchDraw();
  };

  render() {
    return (
      <Image
        x={this.props.x}
        y={this.props.y}
        width={this.props.width}
        height={this.props.height}
        image={this.state.image}
        ref={node => {
          this.imageNode = node;
        }}
      />
    );
  }
}


class RoomHighlight extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Rect
        x={this.props.x}
        y={this.props.y}
        width={this.props.width}
        height={this.props.height}
        fill={"black"}
        opacity={0.25}
        draggable={this.props.draggable}
      />
    );
  }
}


class FloorMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
                    scaleX: window.innerWidth / 2000,
                    scaleY: window.innerHeight / 2000,
                    currentFloorMap: "https://library.truman.edu/about-us/FloorMaps/FirstFloor.jpg",
                    currentRoom: "Room2",
                    highlightedRooms: [],
                 };

    this.stageRef = React.createRef();
    this.layerRef = React.createRef();
    this.floorMapRef = React.createRef();

    this.isDrawing = false;
  }

  newRectangle = (x, y, width, height) => {
    return {
      x: x,
      y: y,
      width: width,
      height: height,
      key: this.state.currentRoom
    } 
  };

  componentDidMount() {
    window.addEventListener("resize", this.handleResize);
  }
  
  componentWillUnmount() {
    window.addEventListener("resize", null);
  }


  handleResize = (event) => {
    this.setState({
      scaleX: window.innerWidth / 2000,
      scaleY: window.innerHeight / 2000,
    })
  }

  handleMouseDown = (event) => {

    this.isDrawing = true;

    var pos = this.stageRef.current.getPointerPosition();
    this.originalX = pos.x
    this.originalY = pos.y

    this.setState(prevState => ({
      highlightedRooms: [...prevState.highlightedRooms, this.newRectangle(this.originalX, this.originalY,
                                       pos.x - this.originalX, pos.y - this.originalY) ]
    }));
  }

  handleMouseUp = () => {
    this.isDrawing = false;
  }

  handleMouseMove = () => {
    if (!this.isDrawing) {
        return;
    }

    var pos = this.stageRef.current.getPointerPosition();

    this.setState((prevState) => ({
      highlightedRooms: update(prevState.highlightedRooms, {$splice: [[-1, 1]]})
    }))

    this.setState(prevState => ({
      highlightedRooms: [...prevState.highlightedRooms, 
                        this.newRectangle(this.originalX, this.originalY,
                                       pos.x - this.originalX, pos.y - this.originalY) ]
    }));
  }


  render() {
    return (
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        scaleX={this.scaleX}
        scaleY={this.scaleY}
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
        onMouseMove={this.handleMouseMove}
        ref={this.stageRef}
      >
        <Layer ref={this.layerRef}>
          <URLImage
            src={this.state.currentFloorMap}
            x={0}
            y={0}
            width={window.innerWidth}
            height={window.innerHeight} />

          {this.state.highlightedRooms.map(({ height, width, x, y , key}) => (
            <RoomHighlight
              key={key}
              height={height}
              width={width}
              x={x}
              y={y}
              draggable={false}
            />
            ))}
        </Layer>
      </Stage>
    );
  }
}

export default FloorMap;