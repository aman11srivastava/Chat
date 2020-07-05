import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './Login.css'
import firebase from '../../Services/firebase'
import LoginString from '../Login/LoginStrings'
import { Card } from 'react-bootstrap'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import Checkbox from '@material-ui/core/Checkbox'
import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Grid from '@material-ui/core/Grid'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'

class Login extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            email: '',
            password: '',
            isLoading: true,
            error: ''
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })

    }

    async handleSubmit(e){
        e.preventDefault();
        this.setState({
            error: ""
        })
        await firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
        .then(async result => {
            let user = result.user
            if(user){
                await firebase.firestore().collection('users')
                .where('id', "==", user.uid)
                .get()
                .then(function(querySnapshot){
                    querySnapshot.forEach(function(doc){
                        const currentdata = doc.data();
                        localStorage.setItem(LoginString.FirebaseDocumentId, doc.id)
                        localStorage.setItem(LoginString.ID, currentdata.id)
                        localStorage.setItem(LoginString.Name, currentdata.name)
                        localStorage.setItem(LoginString.Email, currentdata.email)
                        localStorage.setItem(LoginString.Password, currentdata.password)
                        localStorage.setItem(LoginString.PhotoURL, currentdata.URL)
                        localStorage.setItem(LoginString.Description, currentdata.Description)
                    })
                })
            }
            this.props.history.push('/chat')
        }).catch(function(error){
            this.setState({
                error: "Error while Logging In. Please try again after sometime"
            })
        })
    }

    componentDidMount = () => {
        if(localStorage.getItem(LoginString.ID)) {
            this.setState({
                isLoading: false
            }, () => {
                this.setState({
                    isLoading: false
                })
                this.props.showToast(1, 'Logged In successfully')
                this.props.history.push('./chat')
            })
        }
        else {
            this.setState({
                isLoading: false
            })
        }
    }

    
    render() {

        const paper = {
            display: 'flex',
            flexDirection: 'column',
            alignIttems: 'center',
            paddingLeft: '10px',
            paddingRight: '10xp'
        }

        const rightComponent = {
            boxShadow: '0px 80px 80px #808888',
            backgroundColor: 'smokegrey'
        }

        const root = {
            height: '100vh',
            background: 'linear-gradient(90deg, #e3ffe7 0%, #d9e7ff 100%)',
            marginBottom: '50px'
        }

        const Signinsee = {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            color: 'white',
            marginBottom: '20px',
            backgroundColor: '#1ebea5',
            width: '100%',
            boxShadow: '0 5px 5px #808888',
            height: '10rem',
            paddingTop: '40px',
            opacity: '0.5',
            borderBottom: '5px solid green'
        }

        const form = {
            width: '100%',
            marginTop: '50px'
        }

        const avatar = {
            backgroundColor: 'green'
        }

        return (
            <Grid container component="main" style={root}>
                <CssBaseline/>
                <Grid item xs = {1} md = {7} sm = {4} className="image">
                    <div className="image1"></div>
                </Grid>
                <Grid item xs={12} sm={8} md={5} style={rightComponent} elevation={6} square>
                    <Card style={Signinsee}>
                        <div>
                            <Avatar style={avatar}>
                                <LockOutlinedIcon width="50px" height="50px"/>
                            </Avatar>
                        </div>
                        <div>
                            <Typography component="h1" variant="h5"
                                Sign In 
                                To
                            />
                            <div>
                                <Link
                                    to = "/"
                                >
                                    <button className="btn">
                                        <i className="fa fa-home"></i>
                                        WebChat
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </Card>
                    <div style={paper}>
                        <form style={form} noValidate onSubmit={this.handleSubmit}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Id"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            type="text"
                            onChange={this.handleChange}
                            value={this.state.email}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            type="password"
                            fullWidth
                            id="password"
                            label="Password"
                            name="password"
                            autoComplete="current-password"
                            autoFocus
                            onChange={this.handleChange}
                            value={this.state.password}
                        />
                        <FormControlLabel
                            control = {<Checkbox value="remember" color="primary"/>}
                            label="Remember Me"
                        />
                        <Typography component="h6" variant="h5">
                            {this.state.error ? (
                                <p className="text-danger">{this.state.error}</p>
                            ):null}
                        </Typography>
                        <div className="CenterAliningItems">
                            <button className="button1" type="submit">
                                <span>LogIn</span>
                            </button>
                        </div>

                        <div className="CenterAliningItems">
                            <p>Don't have an account?</p>
                            <Link to="/signup" variant="body2">
                                Sign Up
                            </Link>
                        </div>

                        </form>
                    </div>
                </Grid>
            </Grid>
        )
    }
}

export default Login
