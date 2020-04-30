import React from 'react';
import {
    Button,
    Table,
    TableHead,
    TableRow,
    TableBody,
    TableCell,
} from '@material-ui/core';
import {
    ResponsiveContainer,
    LineChart,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Line,
} from 'recharts';
import './graphlist.css';
import { withStyles } from '@material-ui/core/styles';
import data from '../../data/predictivityData.json';

const columns = [
    {id: 'room', label: 'room', minWidth: 170, width: "30%"},
    {id: 'occupancy', label: 'occupancy', minWidth: 300, width: "70%"},
]

const styles = {
    RowGraphTable: {
        rowGraph: {
            root: {
                width: "100%"
            }
        },
        expandedGraph:{
            root:{
                width:"30%"
            }
        }
    },
    ExpandedGraphTable: {
        root:{
            width: "70%"
        }
    },
};

const GRAPH_HEIGHT = 100;
const ROOM_PADDING = 16;
const ROOM_HEIGHT = GRAPH_HEIGHT - 2 * ROOM_PADDING;

class GraphList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            ExpandedGraphView: false,
            SelectedRow: -1,
        }
        this.data = this.loadData(data);
        console.log(this.data);
        this.handleRowClick = this.handleRowClick.bind(this);
    }

    loadData(json){
        let data = [];
        for(let key in json){
            data.push([key, json[key]]);
        }
        return data;
    }

    handleRowClick(key){
        let newIndex = key;
        console.log(key);
        console.log(this.state.SelectedRow);
        if(this.state.SelectedRow === newIndex){
            this.setState({
                SelectedRow: -1,
                ExpandedGraphView: false,
            });
        } else {
            this.setState({
                SelectedRow: newIndex,
                ExpandedGraphView: true,
            })
        }

    }

    render() {
        const RowTable = withStyles(this.state.ExpandedGraphView ? styles.RowGraphTable.expandedGraph : styles.RowGraphTable.rowGraph)(Table);
        const GraphTable = withStyles(styles.ExpandedGraphTable)(Table);
        return (
            <React.Fragment>
                <div className="graphlist-div">
                    <RowTable
                        stickyHeader
                        aria-label="sticky table"
                    >
                        <TableHead>
                            <TableRow>
                                {columns.map(column => {
                                    const shouldHideColumn = column.id === 'occupancy' && this.state.ExpandedGraphView;
                                    if(!shouldHideColumn) {
                                        return (
                                            <TableCell
                                                key={column.id}
                                                style={{minWidth: column.minWidth, width: column.width}}
                                            >
                                                {column.label}
                                            </TableCell>
                                        );
                                    }else{
                                        return;
                                    }
                                })}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.data.map((room, index) => (
                                <TableRow hover
                                          role="checkbox" tabIndex={index}
                                          key={index}
                                          selected = {index == this.state.SelectedRow}
                                          onClick={() => {this.handleRowClick(index)}}
                                >
                                    {columns.map(column => {
                                        switch(column.label){
                                            case 'room':
                                                return(
                                                    <TableCell
                                                        key={column.id}
                                                        style={{minWidth: column.minWidth, width: column.width, height: ROOM_HEIGHT, padding: ROOM_PADDING}}
                                                        tabIndex={index}
                                                    >
                                                        {room[0]}
                                                    </TableCell>);
                                            case 'occupancy':
                                                return(
                                                    !this.state.ExpandedGraphView &&
                                                    <TableCell
                                                        key={column.id}
                                                        style={{minWidth: column.minWidth, width: column.width, height: GRAPH_HEIGHT, padding: 0}}
                                                        tabIndex={index}
                                                    >
                                                        <ResponsiveContainer width="100%" height={GRAPH_HEIGHT}>
                                                            <LineChart data={room[1]}>
                                                                <XAxis dataKey="time" />
                                                                <YAxis dataKey="occupancy"/>
                                                                <CartesianGrid strokeDasharray="3 3" />
                                                                <Tooltip />
                                                                <Line type='Monotone' dataKey="occupancy"/>
                                                            </LineChart>
                                                        </ResponsiveContainer>
                                                    </TableCell>
                                                );
                                        }
                                    })}
                                </TableRow>
                            ))}
                        </TableBody>
                    </RowTable>
                    {this.state.ExpandedGraphView &&
                    <GraphTable
                        stickyHeader
                        aria-label="sticky table"
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell
                                    key={columns[1].id}
                                    style={{minWidth: columns[1].minWidth}}
                                >
                                    {columns[1].label}
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow
                                hover
                                role="checkbox"
                                tabIndex={-1}
                            >
                                <TableCell
                                    style = {{
                                        padding: 0
                                    }}
                                >
                                    <ResponsiveContainer width="100%" height={500}>
                                        <LineChart data={this.data[this.state.SelectedRow][1]}>
                                            <XAxis dataKey="time" />
                                            <YAxis dataKey="occupancy"/>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <Tooltip />
                                            <Line type='Monotone' dataKey="occupancy"/>
                                        </LineChart>
                                    </ResponsiveContainer>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </GraphTable>
                    }
                </div>
            </React.Fragment>
        );
    }
}

export default GraphList;
