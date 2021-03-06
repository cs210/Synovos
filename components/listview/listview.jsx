import React from 'react';
import Filters from './../filters/filters';
import GraphList from './../graphlist/graphlist';
import axios from "axios";

const sensorTypes = ["Occupancy", "CO2", "Temperature"];

class Listview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedBuilding: "",
            selectedFloor: "",
            selectedDate: new Date(),
            selectedSensor: sensorTypes[0],
            buildings:  [],
            data: undefined,
        };
    }

    componentDidMount() {
        axios.get(
            "/buildings",
            { withCredentials: true }
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

    fetchFloorData = () => {
        if(this.state.selectedBuilding !== '' &&
            Array.isArray(this.state.selectedBuilding.floors) &&
            this.state.selectedBuilding.floors.includes(this.state.selectedFloor) &&
            Array.isArray(this.state.selectedFloor.rooms)
        ){
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
            data: undefined
        });
    }

    handleFloorChange = (event) => {
        this.setState({
            selectedFloor: event.target.value,
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
        this.setState({
            selectedSensor: event.target.value,
            data: undefined
        }, this.fetchFloorData)
    }

    render() {
        let floors = (this.state.selectedBuilding === '' || this.state.selectedBuilding.floors === undefined || this.state.selectedBuilding.floors === null)
            ? [] : this.state.selectedBuilding.floors;
        return (
            <div>
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
                    sensors = {sensorTypes}
                    sensor = {this.state.selectedSensor}
                    handleSensorChange = {this.handleSensorChange}
                />
                <GraphList
                    data = {this.state.data}
                ></GraphList>
            </div>
        );
    }
}

export default Listview;
