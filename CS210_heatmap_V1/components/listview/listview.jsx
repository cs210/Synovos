import React from 'react';
// import {
//     Typography,
// } from '@material-ui/core';

import Filters from './../filters/filters';
import GraphList from './../graphlist/graphlist';

class Listview extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Filters></Filters>
                <GraphList></GraphList>
            </div>
        );
    }
}

export default Listview;
