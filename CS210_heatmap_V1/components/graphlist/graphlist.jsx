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
    AreaChart,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ReferenceLine,
    Area
} from 'recharts';
import './graphlist.css';
import { withStyles } from '@material-ui/core/styles';

const columns = [
    {id: 'room', label: 'room', minWidth: 170, width: "30%"},
    {id: 'content', label: 'content', minWidth: 300, width: "70%"},
]

const rows = [
    {room: "Room 101", content: "important data"},
    {room: "Room 102", content: "More important data"},
    {room: "Room 103", content: "More important data"},
    {room: "Room 104", content: "More important data"},
]

const data = [
    {
        "name": "Page A",
        "uv": 4000,
        "pv": 2400,
        "amt": 2400
    },
    {
        "name": "Page B",
        "uv": 3000,
        "pv": 1398,
        "amt": 2210
    },
    {
        "name": "Page C",
        "uv": 2000,
        "pv": 9800,
        "amt": 2290
    },
    {
        "name": "Page D",
        "uv": 2780,
        "pv": 3908,
        "amt": 2000
    },
    {
        "name": "Page E",
        "uv": 1890,
        "pv": 4800,
        "amt": 2181
    },
    {
        "name": "Page F",
        "uv": 2390,
        "pv": 3800,
        "amt": 2500
    },
    {
        "name": "Page G",
        "uv": 3490,
        "pv": 4300,
        "amt": 2100
    }
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

class GraphList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            ExpandedGraphView: false,
        }

        this.toggleColumn = this.toggleColumn.bind(this);
    }

    toggleColumn() {
        const currView = this.state.ExpandedGraphView;
        this.setState({
            ExpandedGraphView: !currView
        })
        console.log(currView)
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
                                    const shouldHideColumn = column.id === 'content' && this.state.ExpandedGraphView;
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
                            {rows.map((row, index) =>(
                                <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                    {columns.map(column => {
                                        switch(column.label){
                                            case 'room':
                                                return(
                                                    <TableCell
                                                        key={column.id}
                                                        style={{minWidth: column.minWidth, width: column.width, height: 100, padding: 0}}
                                                    >
                                                        {row.room}
                                                    </TableCell>);
                                            case 'content':
                                                return(
                                                    !this.state.ExpandedGraphView &&
                                                    <TableCell
                                                        key={column.id}
                                                        style={{minWidth: column.minWidth, width: column.width, height: 100, padding: 0}}
                                                    >
                                                        <ResponsiveContainer width="100%" height={100}>
                                                            <AreaChart data={data}>
                                                                <XAxis dataKey="name" />
                                                                <YAxis />
                                                                <CartesianGrid strokeDasharray="3 3" />
                                                                <Tooltip />
                                                                <ReferenceLine x="Page C" stroke="green" label="Min PAGE" />
                                                                <ReferenceLine y={4000} label="Max" stroke="red" strokeDasharray="3 3" />
                                                                <Area type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8" />
                                                            </AreaChart>
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
                                    <ResponsiveContainer width="100%" height={400}>
                                        <AreaChart data={data}>
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <Tooltip />
                                            <ReferenceLine x="Page C" stroke="green" label="Min PAGE" />
                                            <ReferenceLine y={4000} label="Max" stroke="red" strokeDasharray="3 3" />
                                            <Area type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </GraphTable>
                    }
                </div>
                <Button onClick={this.toggleColumn}>
                    toggle column
                </Button>
            </React.Fragment>
        );
    }
}

export default GraphList;
