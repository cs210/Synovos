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
const occupancyColors = ['gray','yellow','orange','red', 'darkred'];


function getColorAndValue(data, room, value){
  if (data === undefined) {
    return ["gray", "No Data"]
  }
  let occupancy_data = data.filter(element => element.name == room)[0].data

  if (occupancy_data === undefined || occupancy_data[value] === undefined) {
    return ["gray", "No Data"]
  }
  return [occupancyColors[occupancy_data[value].data], occupancy_data[value].data];
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
                    end_date: end_date
                }
            }).then(result => {
                if(result.status === 200 && Array.isArray(result.data.occupancyData)) {
                    console.log("successfully got occupancy data");
                    // creating an array of elements with values name, data for display
                    let data = this.state.selectedFloor.rooms.map(room => {
                        let id = room._id;
                        let entry = result.data.occupancyData.find((data) =>{ return data.room_id === id});
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
      console.log(event)
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
      console.log(event.target.value)
      this.setState({
        selectedSensor: event.target.value,
      });

    }

    render() {
        let floors = (this.state.selectedBuilding === '' || this.state.selectedBuilding.floors === undefined
          || this.state.selectedBuilding.floors === null) ? [] : this.state.selectedBuilding.floors;
        let rooms = this.state.selectedFloor ? this.state.selectedFloor.rooms.map(room =>
        {
          let values = getColorAndValue(this.state.data, room.name, this.state.sliderValue);
          let sensorType = this.state.selectedSensor;
          let sensorValue = values[1]; // Temporary;
          return {
          "key": room.name,
          "opacity": 0.9,
          "text": room.name + "\n\n" + sensorType + ": " + sensorValue,
          "fill": values[0],
          ...room.location}}
        ) : [];
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
