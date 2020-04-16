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


class OnboardingFloorMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {buildingName: '',
                  floorName: '',
                  roomName: '',
                  jsonData: {},
                  rectange: null,
                  image: null,
                 };

    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleMouseUp = this.handleMouseUp.bind(this)
    this.handleMouseMove = this.handleMouseMove.bind(this)
    // this.handleImageUpload = this.handleImageUpload.bind(this)

    this.stageRef = React.createRef();
    this.layerRef = React.createRef();
    this.floorMapRef = React.createRef();

    this.isDrawing = false;


    // this.image = new Image();
    // this.image.src = '../../images/GatesF0.png'
    // this.setState({
    //   image: this.image
    // });

  }

  handleMouseDown(event) {
    console.log(event)
    this.isDrawing = true;
    var pos = this.stageRef.current.getPointerPosition();
    this.oldX = pos.x
    this.oldY = pos.y

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
  }

  handleMouseUp() {
    this.isDrawing = false;
  }

  handleMouseMove() {
    if (!this.isDrawing) {
        return;
    }

    // var pos = this.stageRef.current.getPointerPosition();
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
    // // this.rectangle.width = pos.x - this.rectangle.x 
    // // this.rectangle.height = pos.y - this.rectangle.y
    this.layerRef.current.draw();
    console.log(this.rectangle)
  }


  // handleImageUpload() {

  // }


  render() {
    return (
      <div>
      <Button variant="contained" onClick={this.handleImageUpload}>Upload Image</Button>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
        onMouseMove={this.handleMouseMove}
        ref={this.stageRef}
      >

        <Layer ref={this.layerRef}>
        <URLImage
          src="https://library.truman.edu/about-us/FloorMaps/FirstFloor.jpg"
          x={0}
          y={0}
          width={window.innerWidth}
          height={window.innerHeight} />
        </Layer>
      </Stage>
      </div>
    );
  }
}

export default OnboardingFloorMap;
