import React from 'react';
import {
    Typography,
    Button
} from '@material-ui/core';
import { render } from 'react-dom';
import { Stage, Layer, Rect, Text, Image } from 'react-konva';
import Konva from 'konva';


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

    this.state = {
      color: 'green'
    }
  }

  handleClick = () => {
    this.setState({
      color: Konva.Util.getRandomColor()
    })
  }

  render() {
    return (
      <Rect
        x={this.props.x}
        y={this.props.y}
        width={this.props.width}
        height={this.props.height}
        fill={this.state.color}
        onClick={this.handleClick}
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
                    highlightedRooms: [
                      {
                        x: 250,
                        y: 25,
                        width: 50,
                        height: 100,
                      }
                    ]
                 };

    this.stageRef = React.createRef();
    this.layerRef = React.createRef();
    this.floorMapRef = React.createRef();

    this.isDrawing = false;
  }

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
    this.oldX = pos.x
    this.oldY = pos.y

    var newRectangle = new Konva.Rect({   
      x: this.oldX,
      y: this.oldY,
      width: 0,
      height: 0,
      fill: 'black',
      stroke: 'black',
      strokeWidth: 4,
      opacity: 0.25,
    });
    this.layerRef.current.add(newRectangle);
    this.rectangle = newRectangle;
  }

  handleMouseUp = () => {
    this.isDrawing = false;
  }

  handleMouseMove = () => {
    if (!this.isDrawing) {
        return;
    }

    var pos = this.stageRef.current.getPointerPosition();

    this.rectangle.destroy()

    var newRectangle = new Konva.Rect({   
      x: this.oldX,
      y: this.oldY,
      width: pos.x - this.oldX,
      height: pos.y - this.oldY,
      fill: 'black',
      stroke: 'black',
      strokeWidth: 4,
      opacity: 0.25,
    });
    this.layerRef.current.add(newRectangle);
    this.rectangle = newRectangle;
    this.layerRef.current.draw();
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

          {this.state.highlightedRooms.map(({ height, width, x, y }, key) => (
            <RoomHighlight
              key={key}
              height={height}
              width={width}
              x={x}
              y={y}
            />
            ))}
        </Layer>
      </Stage>
    );
  }
}

export default FloorMap;