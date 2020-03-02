import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  Typography,
}
from '@material-ui/core';
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
                        <ListItemText primary={"Button 1"} />
                    </ListItem>
                    <ListItem key={2} button >
                        <ListItemText primary={"Button 2"} />
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
