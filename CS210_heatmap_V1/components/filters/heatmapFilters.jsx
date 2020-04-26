import React from 'react';
import Filters from './filters.jsx';

class HeatmapFilters extends Component {
    constructor(props) {
        super(props);
        this.state = {
            building: "",
            floor: "",
            numRooms: 1,
            roomData: [],
            date: new Date(),
            sliderValue: 48,
            mapImage: ""
        };
        this.handleBuildingChange = this.handleBuildingChange.bind(this);
        this.handleFloorChange = this.handleFloorChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleSliderChange = this.handleSliderChange.bind(this);
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
        // Change background image
        var image = jsonData[building][event.target.value]["PDF"].toString();
        document.getElementById("floorLayout").src = image;
        // Get number of rooms in floor
        var buildings = Object.keys(jsonData);
        var totalRooms = Object.keys(jsonData[building][event.target.value]["Rooms"]);
        this.setState({
            building: building,
            floor: event.target.value,
            date: date,
            numRooms: totalRooms,
            roomData: jsonData[building][event.target.value]["Rooms"],
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
    return <Filters/>;
  }
}

export default HeatmapFilters;
