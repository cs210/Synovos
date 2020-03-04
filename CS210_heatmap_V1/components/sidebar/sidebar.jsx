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
                        <NavLink to="/">
                            Home
                        </NavLink>
                    </ListItem>
                    <ListItem key={2} button >
                        <NavLink to="/Heatmap">
                            Heat Map
                        </NavLink>
                    </ListItem>
                    <ListItem key={3} button >
                        <NavLink to="/Listview">
                            List View
                        </NavLink>
                    </ListItem>
                    <ListItem key={4} button >
                        <NavLink to="/Onboarding">
                            Onboarding
                        </NavLink>
                    </ListItem>
                </List>
            </div>
        );
    }
}

export default Sidebar;
