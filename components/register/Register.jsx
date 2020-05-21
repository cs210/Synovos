import React from 'react';
import {
    Container, Grid, Avatar, TextField,
    Button, Typography, Link
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import './Register.css';
import axios from "axios";

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            first_name: "",
            last_name: "",
            login_name: "",
            password: "",
            password_copy: ""
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    // change handler for updating states when typing into input fields
    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    // Create user when clicking on Submit if entered passwords were identical
    handleSubmit(event){
        event.preventDefault();

        if(this.state.password !== this.state.password_copy){
            alert("Passwords don't match.");
            console.log("Passwords don't match.");
        } else{
            var executeRegister = axios.post(
                "/admin/create",
                {
                    login_name: this.state.login_name,
                    first_name: this.state.first_name,
                    last_name: this.state.last_name,
                    password: this.state.password
                },
                { withCredentials: true });

            executeRegister.then(response => {
                if (response.data) {
                    this.props.handleLogin(response.data);
                }
                else{
                    console.log("FAILED");
                }
            }).catch(error => {
                alert(error.response.data + ". Try again.");
                console.log("error", error);
            });
        }
    }

    render(){
        return(
            <Container component="main" maxWidth="xs">
                <div className="paper">
                    <Avatar className="avatar">
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Register
                    </Typography>
                    <form className="form" noValidate onSubmit={this.handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    label="First Name"
                                    name="first_name"
                                    autoComplete="first_name"
                                    autoFocus
                                    onChange={this.handleChange}
                                    value={this.state.first_name}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    label="Last Name"
                                    name="last_name"
                                    autoComplete="last_name"
                                    autoFocus
                                    onChange={this.handleChange}
                                    value={this.state.last_name}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    label="Login Name"
                                    name="login_name"
                                    autoComplete="login-name"
                                    autoFocus
                                    onChange={this.handleChange}
                                    value={this.state.login_name}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    autoFocus
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                    onChange={this.handleChange}
                                    value={this.state.password}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    autoFocus
                                    name="password_copy"
                                    label="password_copy"
                                    type="password"
                                    id="password_copy"
                                    autoComplete="duplicate-password"
                                    onChange={this.handleChange}
                                    value={this.state.password_copy}
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className="submit"
                        >
                            Sign Up
                        </Button>
                        <Grid container className="helper-button">
                            <Grid item xs>
                                <Link href="#/login" variant="body2">
                                    {"Already have an account? Sign In."}
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
                </div>
            </Container>
        );
    }
}

export default Register;