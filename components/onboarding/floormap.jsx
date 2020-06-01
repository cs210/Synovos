import React from 'react';
import {
    Typography,
    Button
} from '@material-ui/core';
import { render } from 'react-dom';
import { Stage, Layer, Rect, Text, Image, Label, Group, Transformer } from 'react-konva';
import Konva from 'konva';
import update from 'immutability-helper'
import PropTypes from 'prop-types';


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
    this.shapeRef = React.createRef();
    this.trRef = React.createRef();

  }

  componentDidMount() {
    if (this.props.draggable) {
      this.trRef.current.setNode(this.shapeRef.current);
      this.trRef.current.getLayer().batchDraw();
    }
  }


  render() {
    return (
      <Group
      draggable={this.props.draggable}
      onDragEnd={this.props.onDragEnd}
      >
      <Rect
        ref={this.shapeRef}
        x={this.props.x}
        y={this.props.y}
        width={this.props.width}
        height={this.props.height}
        fill={this.props.fill}
        opacity={this.props.opacity}
        stroke = "black"
        strokeWidth= {1}
        onTransformEnd={e => {
          console.log("Transforming is finishedd!!!");
          const node = this.shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          node.scaleX(1);
          node.scaleY(1);
          this.props.onTransformEnd({target: {
            attrs: {
              x: node.x(),
              y: node.y(),
              width: Math.max(5, node.width() * scaleX),
              height: Math.max(node.height() * scaleY)}}})
        }}
      />
      <Text 
        x={this.props.x + (this.props.width * .20)}
        y={this.props.y + (this.props.height * .20)}
        fontStyle="bold"
        text={this.props.text}/>

      {this.props.draggable && <Transformer
          keepRatio={false}
          ref={this.trRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
      /> }
      </Group>
    );
  }
}


class FloorMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
                    stageWidth: 200,
                    stageHeight: props.mode == "heatmap" ? 400 : 600,
                    rooms: this.props.rooms,
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
      key: this.props.currentRoom,
      fill: "black",
      opacity: 0.25,
      text: "",
      draggable: false,
    }
  };

  componentDidMount() {
    this.checkSize();
    window.addEventListener("resize", this.checkSize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.checkSize);
  }


  checkSize = () => {
    const width = this.container.offsetWidth
    const height = this.container.offsetHeight
    this.setState({
      stageWidth: width,
      stageHeight: height
    });
  };


  handleMouseDown = (event) => {
    if (this.props.mode == "onboarding") {
      this.isDrawing = true;

      var pos = this.stageRef.current.getPointerPosition();
      this.originalX = pos.x
      this.originalY = pos.y

      this.setState(prevState => ({
        rooms: [...prevState.rooms, this.newRectangle(this.originalX / this.state.stageWidth, this.originalY / this.state.stageHeight,
                                         (pos.x - this.originalX) / this.state.stageWidth, (pos.y - this.originalY)) / this.state.stageHeight ]
      }));
    }
  }

  getRooms = (event) => {
    this.props.onRoomSelectFinish(event, this.state.rooms[this.state.rooms.length - 1])
  }

  handleMouseUp = (event) => {
    if (this.props.mode == "onboarding") {
      this.isDrawing = false;
      this.props.onRoomSelect(event, this.state.rooms[this.state.rooms.length - 1])
    }
  }

  handleMouseMove = (event) => {
    if (this.props.mode == "onboarding") {
      if (!this.isDrawing) {
          return;
      }

      var pos = this.stageRef.current.getPointerPosition();

      this.setState((prevState) => ({
        rooms: update(prevState.rooms, {$splice: [[-1, 1]]})
      }))

      this.setState(prevState => ({
        rooms: [...prevState.rooms,
                          this.newRectangle(this.originalX / this.state.stageWidth, this.originalY / this.state.stageHeight,
                                         ((pos.x - this.originalX) > 3 ? (pos.x - this.originalX) : 3) / this.state.stageWidth, ((pos.y - this.originalY) > 3 ? (pos.y - this.originalY) : 3) / this.state.stageHeight) ]
      }));
    }
  }


  render() {
    let whichRooms = this.props.mode == "heatmap" ? this.props.rooms : this.state.rooms
    return (
      <div
        ref={node => {
          this.container = node;
        }}
      >
      <Stage
        width={this.state.stageWidth}
        height={this.state.stageHeight}
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
        onMouseMove={this.handleMouseMove}
        ref={this.stageRef}
      >
        <Layer ref={this.layerRef}>
          <URLImage
            src={this.props.currentFloorMap}
            x={0}
            y={0}
            width={this.state.stageWidth}
            height={this.state.stageHeight} />

          {whichRooms.map(({ height, width, x, y , key, fill, opacity, text, draggable}) => (
            <RoomHighlight
              key={key}
              height={this.state.stageHeight * height}
              width={this.state.stageWidth * width}
              x={this.state.stageWidth * x}
              y={this.state.stageHeight * y}
              fill={fill}
              opacity={opacity}
              text={text}
              draggable={draggable}
              onDragEnd={e => {
                this.setState((prevState) => ({
                  rooms: update(prevState.rooms, {$splice: [[-1, 1]]})
                }));
                let newRect = this.newRectangle(x + (e.target.attrs.x / this.state.stageWidth), y + (e.target.attrs.y / this.state.stageHeight),
                                                      width, height);
                newRect.draggable = true
                newRect.fill = "green"
                newRect.text = text

                this.setState(prevState => ({
                  rooms: [...prevState.rooms, newRect]
                }));
              }}
              onTransformEnd={e => {
                this.setState((prevState) => ({
                  rooms: update(prevState.rooms, {$splice: [[-1, 1]]})
                }));
                let newRect = this.newRectangle(e.target.attrs.x / this.state.stageWidth, e.target.attrs.y / this.state.stageHeight,
                                                      e.target.attrs.width / this.state.stageWidth, e.target.attrs.height / this.state.stageHeight);
                newRect.draggable = true
                newRect.fill = "green"
                newRect.text = text

                this.setState(prevState => ({
                  rooms: [...prevState.rooms, newRect]
                }));
              }}
            />
            ))}
        </Layer>
      </Stage>
      </div>
    );
  }
}


FloorMap.propTypes = {
    currentFloorMap: PropTypes.string.isRequired,
    mode: PropTypes.string.isRequired,
    currentRoom: PropTypes.string,
    rooms: PropTypes.arrayOf(PropTypes.object),
    onRoomSelect: PropTypes.func,
    onRoomSelectFinish: PropTypes.func,
}


export default FloorMap;
