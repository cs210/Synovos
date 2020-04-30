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
import PropTypes from 'prop-types';

import './filters.css';

class Filters extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="filters">
                <div className="filter">
                    <FormControl
                        className="filters-formControls"
                        disabled = {this.props.buildings.length === 0} >
                        <InputLabel id = "buildingFilter">Building</InputLabel>
                        <Select
                            labelId = "buildingFilter"
                            value={this.props.building}
                            onChange={this.props.handleBuildingChange}
                        >
                            {this.props.buildings.map((building)=> <MenuItem key = {building._id} value={building}>{building.name}</MenuItem>)}
                        </Select>
                    </FormControl>
                </div>
                <div className="filter">
                    <FormControl
                        className="filters-formControls"
                        disabled = {this.props.floors.length === 0} >
                        <InputLabel id = "floorFilter">Floor</InputLabel>
                        <Select
                            labelId = "floorFilter"
                            value={this.props.floor}
                            onChange={this.props.handleFloorChange}
                        >
                            {this.props.floors.map((floor, index)=> <MenuItem key = {floor._id} value={floor}>{floor.name}</MenuItem>)}
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
                        value={this.props.date}
                        KeyboardButtonProps={{
                            'aria-label': 'change date',
                        }}
                        onChange = {this.props.handleDateChange}
                        disableFuture = {true}
                        />
                    </MuiPickersUtilsProvider>
                </div>
            </div>
        );
    }
}

Filters.defaultProps = {
    buildings: [],
    floors: [],
    date: new Date()
}

Filters.propTypes ={
    buildings: PropTypes.arrayOf(PropTypes.object),
    floors: PropTypes.arrayOf(PropTypes.object),
    floor: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    building: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    date: PropTypes.object,
    handleBuildingChange: PropTypes.func,
    handleDateChange: PropTypes.func,
    handleFloorChange: PropTypes.func
}

export default Filters;
