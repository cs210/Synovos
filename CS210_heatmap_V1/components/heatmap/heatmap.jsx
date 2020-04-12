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
import Slider from '@material-ui/core/Slider';
import PropTypes from 'prop-types';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Filters from '../filters/filters.jsx';
import '../filters/filters.css';
import DateFnsUtils from '@date-io/date-fns';
import '../filters/filters.css';

//TODO: Import from json
import * as jsonData from "./sample_data/sample1.json";
var buildings = Object.keys(jsonData);
var floors = [];
var image = "../../images/GatesF0.png"

//TODO: Make range of colors adaptable to occupancy (range)
const occupancyColors = ['Gray','Yellow','Orange','Red', 'DarkRed']

//GetColor functions used as proxy for setting colors
function getColor(room, value){
  var occupancy = jsonData["Gates"]["Floor0"][room]["occupancy"];
  return occupancyColors[occupancy[value]];
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
        value: 12,
        label: '3am',
    },
    {
        value: 24,
        label: '6am',
    },
    {
        value: 36,
        label: '9am',
    },
    {
        value: 48,
        label: '12pm',
    },
    {
        value: 60,
        label: '3pm',
    },
    {
        value: 72,
        label: '6pm',
    },
    {
        value: 84,
        label: '9pm',
    },
    {
        value: 96,
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
              sliderValue: 12,
              mapImage: ""
          };
          this.handleBuildingChange = this.handleBuildingChange.bind(this);
          this.handleFloorChange = this.handleFloorChange.bind(this);
          this.handleDateChange = this.handleDateChange.bind(this);
          this.handleSliderChange = this.handleSliderChange.bind(this);
      }

      handleSliderChange(event){
        this.setState({
            sliderValue: parseInt(event.target.innerText),
        });
      }

      handleBuildingChange(event) {
          floors = Object.keys(jsonData[event.target.value])
          const floor= this.state.floor;
          const date = this.state.date;
          this.setState({
              building: event.target.value,
              floor: floor,
              date: date
          });
      }

      handleFloorChange(event) {
          const building = this.state.building;
          const date = this.state.date;
          var image = jsonData[building][event.target.value]["PDF"].toString();
          document.getElementById("floorLayout").src = image;
          this.setState({
              building: building,
              floor: event.target.value,
              date: date,
              mapImage: image
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
    <img id="floorLayout" src="../../images/GatesF0.png"/>
    <svg class="svgLayout" >
    <rect id="room1" height="19%" width="9%" style={{
        fill: getColor("Room1", this.state.sliderValue)
      }} />
    <rect id="room2" x = "26%" y = "70%" width="11.5%" height="12%"style={{
        fill: getColor("Room2", this.state.sliderValue)
      }}/>
    <rect id="room3" x = "50%" y = "84%" width="8%" height="12%"style={{
        fill: getColor("Room3", this.state.sliderValue),
      }}/>
    <rect id="room4" x = "64%" y = "2%" width="6%" height="22%"style={{
        fill: getColor("Room4", this.state.sliderValue),
      }}/>
    </svg>
    </div>

                </div>
                <PrettoSlider id="slider" max="96" valueLabelDisplay="auto" aria-label="pretto slider" marks={marks} defaultValue={12} onChange={this.handleSliderChange}>
                </PrettoSlider>
                </div>
            </div>

            </div>

        );
    }
}

export default Heatmap;
