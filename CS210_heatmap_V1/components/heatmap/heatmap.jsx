import React from 'react';
import './heatmap.css';
import {
    FormControl,
    Select,
    InputLabel,
    MenuItem
} from "@material-ui/core";
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import floorplan from '../../images/GatesBasement.png';
import gradientBar from '../../images/GradientBar.png';
import Slider from '@material-ui/core/Slider';
import PropTypes from 'prop-types';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Filters from '../filters/filters.jsx';
import '../filters/filters.css';
import DateFnsUtils from '@date-io/date-fns';

import '../filters/filters.css';

const buildings = ["Gates", "Huang"];

const floors = ["1st Floor", "2nd floor", "3rd floor"];

const occupancyColors = ['null','#8B00FF','#FFF500','#FF8700','#FF0000']


function getColor1(value){
  console.log(value)
  var color = 0;
  if(value < 9){
    color = 0;
  } else if (value < 12){
    color = 3;
  } else if (value < 14){
    color = 4;
  } else if (value < 16){
    color = 1;
  } else {
    color = 0;
  }
  return occupancyColors[color];
}

function getColor2(value){
  var color = 0;
  if(value < 9){
    color = 0;
  } else if (value < 12){
    color = 5;
  } else if (value < 14){
    color = 3;
  } else if (value < 16){
    color = 3;
  } else {
    color = 0;
  }
  return occupancyColors[color];
}

function getColor3(value){
  var color = 0;
  if(value < 9){
    color = 0;
  } else if (value < 12){
    color = 1;
  } else if (value < 14){
    color = 2;
  } else if (value < 16){
    color = 1;
  } else {
    color = 0;
  }
  return occupancyColors[color];
}

function getColor4(value){
  var color = 0;
  if(value < 9){
    color = 0;
  } else if (value < 12){
    color = 5;
  } else if (value < 14){
    color = 4;
  } else if (value < 16){
    color = 3;
  } else {
    color = 0;
  }
  return occupancyColors[color];
}

const PrettoSlider = withStyles({
    root: {
        color: '#DE0F0F',
        height: 8,
    },
    thumb: {
        height: 24,
        width: 24,
        backgroundColor: '#fff',
        border: '2px solid currentColor',
        marginTop: -8,
        marginLeft: -12,
        '&:focus,&:hover,&$active': {
            boxShadow: 'inherit',
        },
    },
    active: {},
    valueLabel: {
        left: 'calc(-50% + 4px)',
    },
    track: {
        height: 8,
        borderRadius: 4,
    },
    rail: {
        height: 8,
        borderRadius: 4,
    },
})(Slider);

const marks = [
    {
        value: 0,
        label: '12am',
    },
    {
        value: 3,
        label: '3am',
    },
    {
        value: 6,
        label: '6am',
    },
    {
        value: 9,
        label: '9am',
    },
    {
        value: 12,
        label: '12pm',
    },
    {
        value: 15,
        label: '3pm',
    },
    {
        value: 18,
        label: '6pm',
    },
    {
        value: 21,
        label: '9pm',
    },
    {
        value: 24,
        label: '11:59pm',
    },
];


class Heatmap extends React.Component {
      constructor(props) {
          super(props);
          this.state = {
              building: "",
              floor: "",
              date: new Date(),
              sliderValue: 12
          };
          this.handleBuildingChange = this.handleBuildingChange.bind(this);
          this.handleFloorChange = this.handleFloorChange.bind(this);
          this.handleDateChange = this.handleDateChange.bind(this);
          this.handleSliderChange = this.handleSliderChange.bind(this);
      }

      handleSliderChange(event){
        console.log(parseInt(event.target.innerText))
        this.setState({
            sliderValue: parseInt(event.target.innerText),
        });
      }

      handleBuildingChange(event) {
          const floor= this.state.floor;
          const date = this.state.date;
          this.setState({
              building: event.target.value,
              floor: floor,
              date: date
          });
      }

      handleFloorChange(event) {
          const building= this.state.building;
          const date = this.state.date;
          this.setState({
              building: building,
              floor: event.target.value,
              date: date
          });
      }

      handleDateChange(date) {
          const building= this.state.building;
          const floor= this.state.floor;
          this.setState({
              building: building,
              floor: floor,
              date: date
          });
      }

    render() {
      let colors=["#F0F8FF","#FFE4C4","#8A2BE2"];
        return (
          <div>
          <div>
            <div>
                <div>
                <div className="filters">
                    <div className="filter">
                        <FormControl className="filters-formControls">
                            <InputLabel id = "buildingFilter">Building</InputLabel>
                            <Select
                                labelId = "buildingFilter"
                                value={this.state.building}
                                onChange={this.handleBuildingChange}
                            >
                                {buildings.map((building, index)=> <MenuItem key = {index} value={building}>{building}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </div>
                    <div className="filter">
                        <FormControl className="filters-formControls">
                            <InputLabel id = "floorFilter">Floor</InputLabel>
                            <Select
                                labelId = "floorFilter"
                                value={this.state.floor}
                                onChange={this.handleFloorChange}
                            >
                                {floors.map((floor, index)=> <MenuItem key = {index} value={floor}>{floor}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </div>
                    <div className = "datePicker">
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                            disableToolbar
                            variant="inline"
                            format="MM/dd/yyyy"
                            margin="normal"
                            value={this.state.date}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                            onChange = {this.handleDateChange}
                            disableFuture = {true}
                            />
                        </MuiPickersUtilsProvider>
                      </div>
                    </div>
                <div class="gradientBar">
                {/*
                  <table>
                    <tr>
                      <td>
                      <div class="leftCell">[min people]</div>
                      <div class="rightCell">[max people]</div>
                      </td>
                    </tr>
                  </table>
                */}
                  </div>

  <div class="map">
    <img id="floorLayout" src='../../images/GatesBasement.png' />
    <svg class="svgLayout">
    <rect id="room1" class="roomLayout" x ="450" y ="220" height="19%" width="9%" style={{
        fill: getColor1(this.state.sliderValue)
      }} />
    <rect id="room2" class="roomLayout" x = "277" y = "395" width="11.5%" height="12%"style={{
        fill: getColor2(this.state.sliderValue)
      }}/>
    <rect id="room3" class="roomLayout" x = "540" y = "470" width="8%" height="12%"style={{
        fill: getColor3(this.state.sliderValue),
      }}/>
    <rect id="room4" class="roomLayout" x = "688" y = "8" width="6%" height="22%"style={{
        fill: getColor4(this.state.sliderValue),
      }}/>
    </svg>
  </div>

{/*
  <div id="container">
  <svg class="image2"><path fill="none" d="M-1-1h582v402H-1z"/><g><path fill="null" stroke="#7B572D" stroke-width="1.5" stroke-opacity="null" fill-opacity="null" d="M950.556 394.444l1.11 152.223s-86.666 1.11-87.221 1.11c.555 0 1.666 270 1.11 270h227.223l-1.111-421.11-141.111-2.223z"/></g></svg>

<svg id = "product-svg" width="2161" height="1405" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M-1-1h582v402H-1z"/><g><path fill="White" stroke="#7B572D" stroke-width="1.5" stroke-opacity="null" fill-opacity="null" d="M950.556 394.444l1.11 152.223s-86.666 1.11-87.221 1.11c.555 0 1.666 270 1.11 270h227.223l-1.111-421.11-141.111-2.223z"/></g></svg>

<svg id = "product-svg" width="2161" height="1405" xmlns="http://www.w3.org/2000/svg"><path d="M1606.757 830.002l-45 75s-37.501 95.002-39.237 92.511c1.736 2.49-13.264 112.492-13.264 112.492l22.5 105.002 37.5 77.5 37.501 55.002s87.501 2.5 85.765.009c1.736 2.49 1.736-30.01 0-32.5 1.736 2.49 59.237-35.01 57.501-37.501 1.736 2.49 51.737-70.01 50-72.501 1.737 2.49 31.737-67.51 30.001-70 1.736 2.49 4.236-90.011 2.5-92.502 1.736 2.49-20.764-65.01-22.5-67.501 1.736 2.49-55.765-65.01-57.5-67.5 1.735 2.49-73.266-50.011-75.002-52.502 1.736 2.491-70.765-25.01-70.765-25.01z" stroke-width="1.5" stroke="#000" fill="#fff"/></svg>
<svg id = "product-svg" width="2161" height="1405" xmlns="http://www.w3.org/2000/svg"><path d="M429.241 995.004s292.504 0 290.769-2.49c1.735 2.49 1.735 154.992 1.735 154.992s-295.004 5-296.74 2.51c1.736 2.49 4.236-155.012 4.236-155.012z" stroke-width="1.5" stroke="#000" fill="#fff"/></svg>
<svg id = "product-svg" width="2161" height="1405" xmlns="http://www.w3.org/2000/svg"><path d="M1482.144 355.715s-28.571 24.285-29.286 22.857c.715 1.428-42.143 57.143-42.857 55.714.714 1.429-16.429 62.857-17.143 61.429.714 1.428-6.428 72.857-7.143 71.428.715 1.429 6.429 54.286 5.715 52.857.714 1.429 22.142 65.715 21.428 64.286.715 1.429 26.429 47.143 25.715 45.715.714 1.428 25 31.428 24.285 30 .715 1.428 149.286-125.715 148.572-127.143.714 1.428 3.571-165.715 3.571-165.715l-132.857-111.428z" stroke-width="1.5" stroke="#000" fill="#fff"/></svg>
</div>

*/}

                </div>
                <PrettoSlider id="slider" max="24" valueLabelDisplay="on" aria-label="pretto slider" marks={marks} defaultValue={12} onChange={this.handleSliderChange}>
                </PrettoSlider>
                </div>
            </div>
            </div>

        );
    }
}

export default Heatmap;
