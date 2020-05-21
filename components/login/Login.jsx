import React from 'react';
import {
    Container, Grid, Avatar, TextField,
    Button, Typography, Link
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import './Login.css';
import axios from "axios";

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            login_name: "",
            password: "",
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }


    handleChange(event) {
        //console.log(event.target.name + " " + event.target.value);
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleSubmit(event){
        var login_name_temp = this.state.login_name;
        var password_temp = this.state.password;

        var executeLogin = axios.post(
            "/admin/login",
            {
                login_name: login_name_temp,
                password: password_temp,
                },
            { withCredentials: true });

        executeLogin.then(response => {
            if (response.data) {
                //console.log(this.props.handleLogin);
                this.props.handleLogin(response.data);
            }
            else{
                console.log("FAILED");
            }
        }).catch(error => {
                // Change this to a div!
                alert("Wrong Login Name. Try again.");
                console.log("login error", error);
            });



        event.preventDefault();
    }

    render(){
        return(
            <Container component="main" maxWidth="xs">
                    <div className="paper">
                        <Avatar className="avatar">
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Login
                        </Typography>
                        <form className="form" noValidate onSubmit={this.handleSubmit}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                label="Login Name"
                                name="login_name"
                                onChange={this.handleChange}
                                value={this.state.login_name}
                                autoFocus
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                label="Password"
                                name="password"
                                type="password"
                                onChange={this.handleChange}
                                value={this.state.password}
                                autoComplete="current-password"
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className="submit"
                            >
                                Sign In
                            </Button>
                            <Grid container className="helper-button">
                                <Grid item xs>
                                    <Link href="#/register" variant="body2">
                                        {"Don't have an account? Sign Up"}
                                    </Link>
                                </Grid>
                            </Grid>
                        </form>
                    </div>
            </Container>
    );
    }
}

export default Login;