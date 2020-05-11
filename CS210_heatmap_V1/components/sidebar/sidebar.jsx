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
                            style={{ textDecoration: 'none' , width: '100%'}}
                        >
                            <Button>
                                Home
                            </Button>
                        </NavLink>
                    </ListItem>
                    <ListItem key={2} button >
                        <NavLink
                            to="/Heatmap"
                            style={{ textDecoration: 'none' , width: '100%'}}
                        >
                            <Button>
                                Heat Map
                            </Button>
                        </NavLink>
                    </ListItem>
                    <ListItem key={3} button >
                        <NavLink
                            to="/Listview"
                            style={{ textDecoration: 'none' , width: '100%'}}
                        >
                            <Button>
                                List View
                            </Button>
                        </NavLink>
                    </ListItem>
                    <ListItem key={4} button >
                        <NavLink
                            to="/Onboarding"
                            style={{ textDecoration: 'none' , width: '100%'}}
                        >
                            <Button>
                                Onboarding
                            </Button>
                        </NavLink>
                    </ListItem>
                    <ListItem key={5} button >
                        <NavLink
                            to="/Edit"
                            style={{ textDecoration: 'none' , width: '100%'}}
                        >
                            <Button>
                                Edit Buildings
                            </Button>
                        </NavLink>
                    </ListItem>
                </List>
            </div>
        );
    }
}

export default Sidebar;
