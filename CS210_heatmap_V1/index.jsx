import React from 'react';
import ReactDOM from 'react-dom';
import {
  HashRouter, Route, Switch,
} from 'react-router-dom';
import {
  Grid, Typography, Paper
} from '@material-ui/core';
import './styles/main.css';

// import necessary components
import TopBar from './components/topBar/TopBar';
import Sidebar from './components/sidebar/sidebar';
import Listview from './components/listview/listview';
import Heatmap from './components/heatmap/heatmap';
import Onboarding from './components/onboarding/onboarding';


class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTitle: "Default Title",
    };

    this.changeTitle = this.changeTitle.bind(this);
  }

  changeTitle(str){
    this.setState({
      currentTitle: str,
    });
  }

  render() {
    return (
        <HashRouter>
          <div>
            <Grid container spacing={8}>
              <Grid item xs={12}>
                <TopBar title={this.state.currentTitle} />
              </Grid>
              <div className="cs142-main-topbar-buffer"/>
              <Grid item sm={3}>
                <Paper  className="cs142-main-grid-item">
                  <Sidebar userList={this.state.userList} />
                </Paper>
              </Grid>
              <Grid item sm={9}>
                <Paper className="cs142-main-grid-item">
                  <Switch>
                      <Route exact path='/' render={() =>
                          <Typography variant="body1">
                              Welcome to your home! This <a href="https://material-ui.com/demos/paper/">Paper</a> component
                              displays the main content of the application. The {"sm={9}"} prop in
                              the <a href="https://material-ui.com/layout/grid/">Grid</a> item component makes it responsively
                              display 9/12 of the window. The Switch component enables us to conditionally render different
                              components to this part of the screen. You don&apos;t need to display anything here on the homepage,
                              so you should delete this Route component once you get started.
                          </Typography>}>
                      </Route>
                      <Route exact path="/Heatmap">
                          <Heatmap></Heatmap>
                      </Route>
                      <Route exact path="/Listview">
                          <Listview></Listview>
                      </Route>
                      <Route exact path="/Onboarding">
                          <Onboarding></Onboarding>
                      </Route>
                  </Switch>
                </Paper>
              </Grid>
            </Grid>
          </div>
        </HashRouter>
    );
  }
}


ReactDOM.render(
  <Index />,
  document.getElementById('photoshareapp'),
);
