import React from 'react';
import {
    Typography,
    Button
} from '@material-ui/core';
import {SketchField, Tools} from 'react-sketch';


class OnboardingFloorMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {buildingName: '',
                  floorName: '',
                  roomName: '',
                  jsonData: {},
                 };

    this.sketchField = React.createRef();

    this.handleImageUpload = this.handleImageUpload.bind(this)
  }

  handleImageUpload() {
    this.sketchField.current.setBackgroundFromDataUrl(
      "https://library.gwu.edu/sites/default/files/communications/gelman-2nd-02.png",
      {
            width:window.innerWidth,
            height:window.innerHeight,
          });
  }

  render() {
    return (
      <div>
      <Button variant="contained" onClick={this.handleImageUpload}>Upload Image</Button>
      <SketchField 
                         tool={Tools.Rectangle}
                         ref={this.sketchField}
                         lineColor='red'
                         fillColor='red'
                         lineWidth={3}
                               sketchWidth={600}
      sketchHeight={600}/>
      </div>
    );
  }
}

export default OnboardingFloorMap;
