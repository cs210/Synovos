import React from 'react';
import './heatmap.css';
import {
    Typography,
} from '@material-ui/core';
import floorplan from '../../images/GatesBasement.png';
import gradientBar from '../../images/GradientBar.png';
import Slider from '@material-ui/core/Slider';
import PropTypes from 'prop-types';
import { withStyles, makeStyles } from '@material-ui/core/styles';

const PrettoSlider = withStyles({
    root: {
        color: '#DE0F0F',
        height: 8,
    },
    thumb: {
        height: 24,
        width: 24,
        backgroundColor: '#fff',
        border: '2px solid currentColor',
        marginTop: -8,
        marginLeft: -12,
        '&:focus,&:hover,&$active': {
            boxShadow: 'inherit',
        },
    },
    active: {},
    valueLabel: {
        left: 'calc(-50% + 4px)',
    },
    track: {
        height: 8,
        borderRadius: 4,
    },
    rail: {
        height: 8,
        borderRadius: 4,
    },
})(Slider);

const marks = [
    {
        value: 0,
        label: '12am',
    },
    {
        value: 3,
        label: '3am',
    },
    {
        value: 6,
        label: '6am',
    },
    {
        value: 9,
        label: '9am',
    },
    {
        value: 12,
        label: '12pm',
    },
    {
        value: 15,
        label: '3pm',
    },
    {
        value: 18,
        label: '6pm',
    },
    {
        value: 21,
        label: '9pm',
    },
    {
        value: 24,
        label: '11:59pm',
    },
];

class Heatmap extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                {/*
            <Typography variant="body1">
                Welcome to your Heatmap Prototype! This <a href="https://material-ui.com/demos/paper/">Paper</a> component
                displays the main content of the application. The {"sm={9}"} prop in
                the <a href="https://material-ui.com/layout/grid/">Grid</a> item component makes it responsively
                        display 9/12 of the window. The Switch component enables us to conditionally render different
                        components to this part of the screen. You don&apos;t need to display anything here on the homepage,
                        so you should delete this Route component once you get started.
                        This is a new line in the heatmap to make sure it is updating.
            </Typography>
            */}
                <div>
                <button type="button">Building</button>
                <button type="button">Floor</button>
                <button type="button">Sensors</button>
                <button type="button">Week</button>
                <textarea> Feb 10 2020 </textarea>
                <textarea> Feb 19 2020 </textarea>
                <button type="button">Download</button>
                <div class="gradientBar">
                {/*
                  <table>
                    <tr>
                      <td>
                      <div class="leftCell">[min people]</div>
                      <div class="rightCell">[max people]</div>
                      </td>
                    </tr>
                  </table>
                */}
                  </div>
                <img id="floormap" src='../../images/GatesBasement.png' />
                </div>
                <PrettoSlider id="slider" max="24" valueLabelDisplay="on" aria-label="pretto slider" marks={marks} defaultValue={12} />
                </div>
        );
    }
}

export default Heatmap;
