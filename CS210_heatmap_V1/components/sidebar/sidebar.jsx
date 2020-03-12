import React from 'react';
import {
  List,
  ListItem,
  Typography,
}
from '@material-ui/core';
import { NavLink } from 'react-router-dom';
import './sidebar.css';

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
                        <NavLink
                            to="/"
                            style={{ textDecoration: 'none' }}
                        >
                            Home
                        </NavLink>
                    </ListItem>
                    <ListItem key={2} button >
                        <NavLink
                            to="/Heatmap"
                            style={{ textDecoration: 'none' }}
                        >
                            Heat Map
                        </NavLink>
                    </ListItem>
                    <ListItem key={3} button >
                        <NavLink
                            to="/Listview"
                            style={{ textDecoration: 'none' }}
                        >
                            List View
                        </NavLink>
                    </ListItem>
                    <ListItem key={4} button >
                        <NavLink
                            to="/Onboarding"
                            style={{ textDecoration: 'none' }}
                        >
                            Onboarding
                        </NavLink>
                    </ListItem>
                </List>
            </div>
        );
    }
}

export default Sidebar;
