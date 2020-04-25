import React from 'react';
import ReactDOM from 'react-dom';
import {
    HashRouter, Route, Switch, Redirect
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
import Register from "./components/register/Register";
import Login from "./components/login/Login";


class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentTitle: "Default Title",
            loggedInStatus: false, // CHANGE THIS TO TRUE FOR DEVELOPMENT PURPOSES. IT KEEPS YOU LOGGEDIN
            user: {},
        };

        this.handleLogin = this.handleLogin.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.changeTitle = this.changeTitle.bind(this);
    }

    changeTitle(str){
        this.setState({
            currentTitle: str,
        });
    }

    // sessionStorage saves the session in the browser: https://www.robinwieruch.de/local-storage-react
    // Usually, when you refresh the page, the this.state.loggedInStatus gets lost
    // sessionStorage survives refreshing the browser page and keeps you logged in also if you refresh the page
    componentDidMount() {
        // If there is a sessionStorage with loggedInStatus = true, change state of loggedInStatus to true
        if (sessionStorage && sessionStorage.getItem('loggedInStatus') && !this.state.loggedInStatus){
            this.setState({
                loggedInStatus: true,
                user: JSON.parse(sessionStorage.getItem('user')),
            });
        }

        // If there is not a sessionStorage with loggedInStatus = true, change state of loggedInStatus to false
        if (sessionStorage && !sessionStorage.getItem('loggedInStatus') && this.state.loggedInStatus){
            this.setState({
                // CHANGE THIS TO TRUE FOR DEVELOPMENT PURPOSES. IT KEEPS YOU LOGGEDIN
                loggedInStatus: false,
                user: {},
            });
        }
    }

    // Store loggedInStatus = True in the browser's sessionStorage and change the state for loggedInStatus to true.
    handleLogin(data) {
        sessionStorage.setItem('loggedInStatus', true);
        sessionStorage.setItem('user', JSON.stringify(data));

        this.setState(({
            loggedInStatus: true,
            user: data,
        }));
    }

    handleLogout() {
        sessionStorage.clear();
        this.setState({
            loggedInStatus: false,
            user: {}
        });
    }

    render() {
        return (
            <HashRouter>
                <div>
                    <Grid container spacing={8}>
                        <Grid item xs={12}>
                            <TopBar title={this.state.currentTitle} loggedIn={this.state.loggedInStatus} user={this.state.user} handleLogout={this.handleLogout} />
                        </Grid>
                        <div className="cs142-main-topbar-buffer"/>
                        <Grid item sm={3}>
                            <Paper  className="cs142-main-grid-item">
                                {
                                    this.state.loggedInStatus ?
                                        <Sidebar userList={this.state.userList} />
                                        :
                                        <div></div>
                                }
                            </Paper>
                        </Grid>
                        <Grid item sm={9}>
                            <Paper className="cs142-main-grid-item">
                                <Switch>
                                    {
                                        this.state.loggedInStatus ?
                                            [
                                                <Redirect key={1} exact path="/login" to={"/Heatmap"} />,
                                                <Redirect key={2} exact path="/register" to={"/Heatmap"} />,
                                                <Redirect key={3} exact path="/" to={"/Heatmap"} />,
                                                <Route key={4} exact path="/Heatmap">
                                                    <Heatmap></Heatmap>
                                                </Route>,
                                                <Route key={5} exact path="/Listview">
                                                    <Listview></Listview>
                                                </Route>,
                                                <Route key={6} exact path="/Onboarding">
                                                    <Onboarding></Onboarding>
                                                </Route>,
                                            ]
                                            :
                                            [
                                                <Route key={1} path="/register"
                                                       render ={ props => <Register {...props}
                                                                                    handleLogin={this.handleLogin}
                                                                                    loggedInStatus={this.state.loggedInStatus} /> }
                                                />,
                                                <Route key={2} exact path="/login"
                                                       render ={ props => <Login {...props}
                                                                                 handleLogin={this.handleLogin}
                                                                                 loggedInStatus={this.state.loggedInStatus} /> }
                                                />,
                                                <Redirect key={3} exact path="/" to="/login" />,
                                                <Redirect key={4} exact path="/Heatmap" to="/login" />,
                                                <Redirect key={5} exact path="/Listview" to="/login" />,
                                                <Redirect key={6} exact path="/Onboarding" to="/login" />,
                                            ]
                                    }
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
