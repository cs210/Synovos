import React from 'react';
import {
    Typography,
} from '@material-ui/core';

class Listview extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Typography variant="body1">
                Welcome to your ListView Prototype! This <a href="https://material-ui.com/demos/paper/">Paper</a> component
                displays the main content of the application. The {"sm={9}"} prop in
                the <a href="https://material-ui.com/layout/grid/">Grid</a> item component makes it responsively
                display 9/12 of the window. The Switch component enables us to conditionally render different
                components to this part of the screen. You don&apos;t need to display anything here on the homepage,
                so you should delete this Route component once you get started.
            </Typography>
        );
    }
}

export default Listview;
