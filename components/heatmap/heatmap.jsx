import React from 'react';
import {
    Grid
} from "@material-ui/core";
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';
import Filters from '../filters/filters.jsx';
import '../filters/filters.css';
import axios from "axios";
import FloorMap from "../onboarding/floormap.jsx"

var default_background = "../../images/FloormapPreviewImage.png"

//TODO: Make range of colors adaptable to occupancy (range)
const range_red = [60,0];
const range_blue = [240,180];
var color_range = Math.abs((range_blue[1] - range_blue[0]) + (range_red[1] - range_red[0]));

// all_data: array of room: {name, data} where data: {time,data}
function get_data_range(all_data){
  let global_max = -Infinity;
  let global_min = Infinity;

  //console.log("All data:")
  //console.log(all_data);
  // for room in all data
  for (var i = 0; i < all_data.length; i++){
    // array of data objects of {time, data}
    let data_array = all_data[i].data;
    if(data_array !== undefined){
      //console.log("Data array:")
      //console.log(data_array);
      // data array may return undefined
      for(var j = 0; j < data_array.length; j++){
        //console.log("data value:");
        let data_value = data_array[j].data;
        //console.log(data_value);
        if(data_value > global_max) global_max = data_value;
        if(data_value < global_min) global_min = data_value;
      }
    }
  }
  console.log("min: " + global_min);
  console.log("Max: " + global_max);
  return [global_min, global_max]
}

function get_color(data_value, data_range){
  let total_data_range = data_range[1] - data_range[0];
  console.log("Data range: " + total_data_range);
  console.log("Color range: " + color_range);
  console.log("data value: " + data_value);
  let color_value = Math.floor((color_range / total_data_range) * (data_value - data_range[0]));
  console.log("color value: "+ color_value);
  if(color_value < 60){
    color_value = color_value + range_blue[1];
  } else {
    color_value = color_value - range_red[0];
  }
  console.log(color_value);
  return "hsl(" + color_value + ",100%,50%)"
}

// room_data: array of {time, data}
function get_value(room_data, sliderValue, data_range){
  //console.log("Getting sensor value");
  //console.log(room_data);
  //console.log(sliderValue);
  //console.log(data_range);
  return room_data[sliderValue].data;
}

// room_data:
// data_range: [global_min, global_max] sensor values for all rooms in floor
function getColorAndValue(room_data, data_range, sliderValue){
  if (room_data === undefined || room_data[sliderValue] === undefined) {
    return ["gray", "No Data"]
  }
  let value = get_value(room_data, sliderValue, data_range);
  let color = get_color(value, data_range);
  return [color, room_data[sliderValue].data];
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
            selectedBuilding: "",
            selectedFloor: "",
            selectedSensor: "",
            selectedFoorMap: "",
            selectedDate: new Date(),
            sensors: ["Occupancy", "CO2", "Temperature"],
            buildings:  [],
            data: undefined,
            sliderValue: 48,
        };
        this.handleSliderChange = this.handleSliderChange.bind(this );
      }

    componentDidMount() {
          axios.get(
              "/buildings", { withCredentials: true}
          ).then(response => {
              if(response.status == 200){
                  this.setState({
                      buildings: response.data.buildings,
                  });
                  console.log("successfully fetched buildings")
              } else{
                  console.error("Buildings request failed")
              }
          });
      }

    handleSliderChange(event) {
      this.setState({
          sliderValue: parseInt(event.target.innerText),
      });
    }

    fetchFloorData = () => {
        if(this.state.selectedBuilding !== '' &&
            Array.isArray(this.state.selectedBuilding.floors) &&
            this.state.selectedBuilding.floors.includes(this.state.selectedFloor) &&
            Array.isArray(this.state.selectedFloor.rooms)){
            let selectedFloorId = this.state.selectedFloor._id;
            let selectedBuildingId = this.state.selectedBuilding._id;
            let room_ids = this.state.selectedFloor.rooms.map(room => {
                return room._id;
            });
            let start_date = new Date(this.state.selectedDate.valueOf());
            start_date.setHours(0, 0, 0, 0);
            let end_date = new Date(start_date.valueOf());
            end_date.setDate(end_date.getDate() + 1);
            axios.get('/sensorData', {
                params: {
                    room_ids: room_ids.join(','),
                    start_date: start_date,
                    end_date: end_date,
                    sensor_type: this.state.selectedSensor
                }
            }).then(result => {
                if(result.status === 200 && Array.isArray(result.data.occupancyData)) {
                    console.log("successfully got occupancy data");
                    // creating an array of elements with values name, data for display
                    let data = this.state.selectedFloor.rooms.map(room => {
                        // For each room in floor

                        // get id
                        let id = room._id;

                        // get corresponding data for room
                        let entry = result.data.occupancyData.find((room_data) =>{ return room_data.room_id === id});

                        //console.log(entry)

                        return {
                            name: room.name,
                            data: entry === undefined ? undefined : entry.readings.map(entry => {
                                return {
                                    time: new Date(entry.time).valueOf(),
                                    data: entry.data
                                }
                            })
                        }
                    });
                    //console.log(data);
                    // checking one last time that we're in a valid state
                    if(this.state.selectedBuilding._id === selectedBuildingId
                        && this.state.selectedFloor._id ===selectedFloorId){
                        this.setState({
                            data: data
                        });
                    }

                } else {
                    console.error("Failed at getting building data with code ", result.status)
                }
            });
        }
      }

    handleBuildingChange = (event) => {
        this.setState({
            selectedBuilding: event.target.value,
            selectedFloor: "",
            selectedFoorMap: "",
            data: undefined,
        });
    }

    handleFloorChange = (event) => {
      //console.log(event)
      this.setState({
          selectedFloor: event.target.value,
          selectedFoorMap: this.state.selectedBuilding.floors.find(
              floor => floor.name == event.target.value.name
            ).img_url,
          data: undefined,
      }, this.fetchFloorData);
    }

    handleDateChange = (date) => {
        this.setState({
            selectedDate: date,
            data: undefined,
        }, this.fetchFloorData);
    }

    handleSensorChange = (event) => {
      //console.log(event.target.value)
      this.setState({
        selectedSensor: event.target.value,
      }, this.fetchFloorData);

    }

    render() {
        let floors = (this.state.selectedBuilding === '' || this.state.selectedBuilding.floors === undefined
          || this.state.selectedBuilding.floors === null) ? [] : this.state.selectedBuilding.floors;

        let rooms = [];
        if (this.state.selectedFloor !== ""){

          if (this.state.selectedSensor !== "" && this.state.data !== undefined){
            let data_range = get_data_range(this.state.data); // [min, max] values of data for all rooms

            rooms = this.state.selectedFloor.rooms.map(room =>
              {
                let [color, sensorValue] = getColorAndValue(this.state.data.filter(element => element.name == room.name)[0].data, data_range, this.state.sliderValue);
                let sensorType = this.state.selectedSensor;

                return {
                  "key": room.name,
                  "opacity": 0.9,
                  "text": room.name + "\n\n" + sensorType + ": " + sensorValue,
                  "fill": color,
                  ...room.location
                }
              }
            )
          } else {
            // if sensor not selected, prompt to [Select sensor] and color all rooms gray
            rooms = this.state.selectedFloor.rooms.map(room =>
              {
                let color = "gray";
                let sensorValue = "No data";
                let sensorType = "[Select Sensor]";
                return {
                  "key": room.name,
                  "opacity": 0.9,
                  "text": room.name + "\n\n" + sensorType + ": " + sensorValue,
                  "fill": color,
                  ...room.location
                }
              }
            )
          }
        }

        return (
          <Grid container direction="column" spacing={5}>
            <Grid item>
              <Filters
                buildings = {this.state.buildings}
                handleBuildingChange = {this.handleBuildingChange}
                building = {this.state.selectedBuilding}
                floors = {floors}
                handleFloorChange = {this.handleFloorChange}
                floor = {this.state.selectedFloor}
                date = {this.state.selectedDate}
                handleDateChange = {this.handleDateChange}
                displaySensor={true}
                sensors = {this.state.sensors}
                handleSensorChange = {this.handleSensorChange}
                sensor = {this.state.selectedSensor}
              />
            </Grid>
            <Grid item>
              <FloorMap
                currentFloorMap={this.state.selectedFoorMap ? this.state.selectedFoorMap : "../../images/FloormapPreviewImage.png"}
                mode="heatmap"
                rooms={rooms}
              />
            </Grid>
            <Grid item>
              <div className="gradientBar"></div>
              <PrettoSlider
                max={96}
                valueLabelDisplay="auto"
                aria-label="pretto slider"
                marks={marks}
                defaultValue={12}
                onChange={this.handleSliderChange}
                style={{width: '90%',
                        marginLeft: '2%'}}
              >

              </PrettoSlider>
            </Grid>
          </Grid>
        );
    }
}

export default Heatmap;
