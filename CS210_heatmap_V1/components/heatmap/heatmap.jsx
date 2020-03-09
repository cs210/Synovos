import React from 'react';
import {
    Typography,
} from '@material-ui/core';
import floorplan from '../../images/GatesBasement.png'
import gradientBar from '../../images/GradientBar.png'

console.log(floorplan);

class Heatmap extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
            <Typography variant="body1">
                Welcome to your Heatmap Prototype! This <a href="https://material-ui.com/demos/paper/">Paper</a> component
                displays the main content of the application. The {"sm={9}"} prop in
                the <a href="https://material-ui.com/layout/grid/">Grid</a> item component makes it responsively
                        display 9/12 of the window. The Switch component enables us to conditionally render different
                        components to this part of the screen. You don&apos;t need to display anything here on the homepage,
                        so you should delete this Route component once you get started.
                        This is a new line in the heatmap to make sure it is updating.
            </Typography>
                <div>
                <button type="button">Building</button>
                <button type="button">Floor</button>
                <button type="button">Sensors</button>
                    <button type="button">Week</button>
                    <textarea> Feb 10 2020 </textarea>
                    <textarea> Feb 19 2020 </textarea>
                    <button type="button">Download</button>
                </div>
                <img src='../../images/GradientBar.png' width="500" />
                <div>
                    <img src='../../images/GatesBasement.png' width="500" />
                </div>
                <input type="range" min="1" max="100" value="50" class="slider" id="myRange" />
                <table>
                    <tr>
                        <th>12am</th>
                        <th>3am</th>
                        <th>6am</th>
                        <th>9am</th>
                        <th>12pm</th>
                        <th>3pm</th>
                        <th>6pm</th>
                        <th>9pm</th>
                        <th>11:59pm</th>
                    </tr>
                </table>
            </div>
        );
    }
}

export default Heatmap;
