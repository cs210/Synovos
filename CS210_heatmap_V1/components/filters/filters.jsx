import React from 'react';
import {
    FormControl,
    Select,
    InputLabel,
    MenuItem
} from "@material-ui/core";
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';

import './filters.css';

const buildings = ["Gates", "Huang"];

const floors = ["1st Floor", "2nd floor", "3rd floor"];

class Filters extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            building: "",
            floor: "",
            date: new Date(),
        };
        this.handleBuildingChange = this.handleBuildingChange.bind(this);
        this.handleFloorChange = this.handleFloorChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
    }

    handleBuildingChange(event) {
        this.setState({
            building: event.target.value,
        });
    }

    handleFloorChange(event) {
        this.setState({
            floor: event.target.value,
        });
    }

    handleDateChange(date) {
        this.setState({
            date: date
        });
    }

    render() {
        return (
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
        );
    }
}

export default Filters;