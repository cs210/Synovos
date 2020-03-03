import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  Typography,
}
from '@material-ui/core';
import { NavLink } from 'react-router-dom';
import './sidebar.css';
import axios from 'axios';

class Sidebar extends React.Component {
    constructor(props) {
        super(props);
    }


    render() {
        return (
            <div>
                <Typography variant="h5">
                    Dashboard Items:
                </Typography>
                <List component="nav">
                    <ListItem key={1} button >
                        <NavLink to="/Home" activeClassName="hurray">
                            Home
                        </NavLink>
                    </ListItem>
                    <ListItem key={2} button >
                        <NavLink to="/ListView" activeClassName="hurray">
                            List View
                        </NavLink>
                    </ListItem>
                    <ListItem key={3} button >
                        <ListItemText primary={"Button 3"} />
                    </ListItem>
                </List>
            </div>
        );
    }
}

export default Sidebar;
