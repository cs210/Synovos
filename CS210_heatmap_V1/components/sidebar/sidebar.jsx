import React from 'react';
import {
  List,
  ListItem,
  Typography,
  Button,
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
                            <Button>
                                Home
                            </Button>
                        </NavLink>
                    </ListItem>
                    <ListItem key={2} button >
                        <NavLink
                            to="/Heatmap"
                            style={{ textDecoration: 'none' }}
                        >
                            <Button>
                                Heat Map
                            </Button>
                        </NavLink>
                    </ListItem>
                    <ListItem key={3} button >
                        <NavLink
                            to="/Listview"
                            style={{ textDecoration: 'none' }}
                        >
                            <Button>
                                List View
                            </Button>
                        </NavLink>
                    </ListItem>
                    <ListItem key={4} button >
                        <NavLink
                            to="/Onboarding"
                            style={{ textDecoration: 'none' }}
                        >
                            <Button>
                                Onboarding
                            </Button>
                        </NavLink>
                    </ListItem>
                </List>
            </div>
        );
    }
}

export default Sidebar;
