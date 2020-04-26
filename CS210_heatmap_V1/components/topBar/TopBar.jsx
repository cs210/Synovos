import React from 'react';
import {
  AppBar, Toolbar, Typography
} from '@material-ui/core';
import './TopBar.css';
import axios from "axios";


class TopBar extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      info: {},
    };
  }

  componentDidMount() {
    var url = axios.get("/test/info");
    url.then(response => {
      this.setState({
        info: response.data,
      });
    });
  }

  render() {
    return (
        <AppBar className="cs142-topbar-appBar" position="absolute">
          <Toolbar>
            <section>
              <Typography variant="h5" color="inherit">
                {"Predictivity - Version " + this.state.info.__v}
              </Typography>
            </section>
            <section className="app-bar-right">
              <Typography variant="h5" color="inherit">
                {"Onboarding Dashboard"}
              </Typography>
            </section>
          </Toolbar>
        </AppBar>
    );
  }
}

export default TopBar;
