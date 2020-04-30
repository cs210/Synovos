import React from 'react';
import {
    AppBar, Button, Toolbar, Typography
} from '@material-ui/core';
import './TopBar.css';
import axios from "axios";


class TopBar extends React.Component {
    constructor(props) {
        super(props);
        this.state={
        };
    }

    handleLogoutClick() {
        axios
            .post("admin/logout", { withCredentials: true })
            .then(() => {
                this.props.handleLogout();
            }).catch(error => console.log("logout error", error));
    }

    // Output Logout Button & personalized "Hi, {user.first_name}" if user is logged in.
    outputRightString(){
        if(this.props.loggedIn){
            return(
                <div className="app-bar-right-inline">
                    <Typography variant="h5" color="inherit" className="app-bar-right-inline-text">
                        Hi, {this.props.user.first_name}
                    </Typography>
                    <Button size="large" variant="contained" color="secondary" onClick={() => this.handleLogoutClick()}>
                        Logout
                    </Button>
                </div>
            );
        }
        else{
            return(
                <Typography variant="h5" color="inherit">
                    Please Log in
                </Typography>
            );
        }
    }

    render() {
        return (
            <AppBar className="cs142-topbar-appBar" position="absolute">
                <Toolbar>
                    <section>
                        <Typography variant="h5" color="inherit">
                            {"Predictivity"}
                        </Typography>
                    </section>
                    <section className="app-bar-right">
                        {this.outputRightString()}
                    </section>
                </Toolbar>
            </AppBar>
        );
    }
}

export default TopBar;
