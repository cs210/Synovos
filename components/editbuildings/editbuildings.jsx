import React from "react";
import MaterialTable from 'material-table';
import Filters from './../filters/filters';
import axios from "axios";

const columnMap = {
    'rooms':  [
        {title: 'Room Name', field: 'name'},
    ],
    'floors': [
        {title: 'Floor Name', field: 'name'},
        {title: 'Image Url', field: 'img_url'},
        {
            title: '# rooms',
            field: 'rooms',
            type: 'numeric',
            render: rowData => Array.isArray(rowData.rooms) ? rowData.rooms.length : 0,
            editable: 'never'
        },
    ],
    'buildings': [
        {title: 'Building Name', field: 'name'},
        {
            title: '# floors',
            field: 'floors',
            type: 'numeric',
            render: rowData => Array.isArray(rowData.floors) ? rowData.floors.length : 0,
            editable: 'never'
        },
    ]

}

class EditBuildings extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            selectedBuilding: "",
            selectedFloor: "",
            buildings:  [],
        }
    }

    componentDidMount() {
        axios.get(
            "/buildings",
            { withCredentials: true }
        ).then(response => {
            if(response.status == 200){
                console.log(response.data.buildings);
                this.setState({
                    buildings: response.data.buildings,
                });
                console.log("successfully fetched buildings")
            } else{
                console.error("Buildings request failed")
            }
        });
    }

    handleBuildingChange = (event) => {
        if(this.state.selectedBuilding._id === event.target.value._id){
            this.setState({
                selectedBuilding: "",
                selectedFloor: "",
            });
        } else {
            this.setState({
                selectedBuilding: event.target.value,
                selectedFloor: "",
            });
        }
    }

    handleFloorChange = (event) => {
        if(this.state.selectedFloor._id === event.target.value._id){
            this.setState({
                selectedFloor: "",
            });
        } else {
            this.setState({
                selectedFloor: event.target.value,
            });
        }
    }

    updateState = (updated_building) => {
        let bldIdx = this.state.buildings.findIndex(building => building.index === bldIdx);
        let buildingsCopy = JSON.parse(JSON.stringify(this.state.buildings));
        buildingsCopy[bldIdx] = updated_building;
        console.log(buildingsCopy);
        if(this.state.selectedBuilding !== ''
            && this.state.selectedBuilding._id === updated_building._id
        ){
            if(this.state.selectedFloor !== '') {
                let floor = updated_building.floors.find(floor => floor._id === this.state.selectedFloor._id);
                this.setState({
                    buildings: buildingsCopy,
                    selectedBuilding: updated_building,
                    selectedFloor: floor
                })
            } else {
                this.setState({
                    buildings: buildingsCopy,
                    selectedBuilding: updated_building
                });
            }
        } else{
            this.setState({
                buildings: buildingsCopy,
            });
        }
    }

    onRowUpdate = (newData) =>
        new Promise((resolve, reject) => {
            let newBuilding = JSON.parse(JSON.stringify(this.state.selectedBuilding));
            if(this.state.selectedFloor !== ''){
                //updating a room
                console.log('updating a room');
                let rooms = newBuilding.floors.find(floor =>  floor._id === this.state.selectedFloor._id)
                    .rooms
                let idx = rooms.findIndex(room => room._id === newData._id);
                if(idx === -1){
                    console.error("Couldn't update building record");
                    reject();
                    return;
                } else{
                    rooms[idx] = newData;
                }
            } else if(this.state.selectedBuilding !== ''){
                //updating a floor
                console.log('updating a floor');
                let idx = newBuilding.floors.findIndex(floor => floor._id === newData._id);
                if(idx === -1){
                    console.error("Couldn't update building record");
                    reject();
                    return;
                } else{
                    newBuilding.floors[idx] = newData;
                }
            } else {
                //updating a building
                console.log('updating a building');
                newBuilding = newData;
            }
            axios.patch(
                "/buildings/" + newBuilding._id,
                newBuilding,
                { withCredentials: true }
            ).then(response => {
                    if(response.status == 200){
                        console.log(response.data.updated_building);
                        if(response.data.updated_building.nModified > 0) {
                            this.updateState(newBuilding);
                        }
                        console.log("successfully update building")
                        resolve();
                    } else{
                        console.error("Building update request failed")
                        reject();
                    }
                }, (error) => {
                    console.log('building update request failed')
                    console.error(error);
                    reject();
                }
            );
        })

    render() {
        let floors = (this.state.selectedBuilding === '' || this.state.selectedBuilding.floors === undefined || this.state.selectedBuilding.floors === null)
            ? [] : this.state.selectedBuilding.floors;
        let data = [];
        let columns = [];
        let title = '';
        if(this.state.selectedFloor !== ''){
            // Floor selected, displaying rooms
            title = this.state.selectedFloor.name + "'s rooms";
            data = Array.isArray(this.state.selectedFloor.rooms) ? this.state.selectedFloor.rooms : [];
            columns = columnMap['rooms'];
        } else if(this.state.selectedBuilding !== ''){
            // Building selected, displaying floors
            title = this.state.selectedBuilding.name + "'s floors";
            data = Array.isArray(this.state.selectedBuilding.floors) ? this.state.selectedBuilding.floors : [];
            columns = columnMap['floors'];
        } else {
            // Nothing selected, displaying buildings
            title = 'Buildings'
            data = this.state.buildings;
            columns = columnMap['buildings'];
        }
        return(
            <React.Fragment>
                <Filters
                    buildings = {this.state.buildings}
                    handleBuildingChange = {this.handleBuildingChange}
                    building = {this.state.selectedBuilding}
                    floors = {floors}
                    handleFloorChange = {this.handleFloorChange}
                    floor = {this.state.selectedFloor}
                    displayDate = {false}
                />
                <MaterialTable
                    title = {title}
                    data = {data}
                    columns = {columns}
                    editable={{
                        onRowUpdate: this.onRowUpdate
                    }}
                />
            </React.Fragment>
        )
    }

}

export default EditBuildings;
