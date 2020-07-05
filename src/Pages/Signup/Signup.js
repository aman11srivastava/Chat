import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './Signup.css'
import {Card} from 'react-bootstrap'
import firebase from '../../Services/firebase'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import LoginString from '../Login/LoginStrings' 

export default class Signup extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             email: '',
             password: '',
             name: '',
             error: null
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    async handleSubmit(e){
        const {name, email, password} = this.state;
        e.preventDefault();
        try {
            firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(async result => {
                firebase.firestore().collection('users')
                .add({
                    name, 
                    id: result.user.uid,
                    email,
                    password,
                    URL: '',
                    Description: "",
                    messages: [{notificationId: '', number: 0}]
                }).then((docRef) =>{
                    localStorage.setItem(LoginString.ID, result.user.id);
                    localStorage.setItem(LoginString.Name, name);
                    localStorage.setItem(LoginString.Email, email);
                    localStorage.setItem(LoginString.Password, password);
                    localStorage.setItem(LoginString.PhotoURL, '');
                    localStorage.setItem(LoginString.UPLOAD_CHANGED, 'state_changed');
                    localStorage.setItem(LoginString.Description, '');
                    localStorage.setItem(LoginString.FirebaseDocumentId, docRef.id);
                    this.setState({
                        name: '',
                        password: '',
                        url: ''
                    });
                    this.props.history.push("/chat")
                })
                .catch((error) => {
                    console.error("Error occured while adding data", error)
                })
            })
        }
        catch(error){
            document.getElementById("1").innerHTML = "Error in signing up. Please try again after some time"
        }
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name] : e.target.value
        })
    }
    
    render() {
        const Signinsee = {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            color: 'white',
            backgroundColor: '#1ebea5',
            width: '100%',
            boxShadow: '0 5px 5px #808888',
            height: '10rem',
            paddingTop: '48px',
            opacity: '0.5',
            borderBottom: '5px solid green'
        }

        return (
            <div>
                <CssBaseline/>
                <Card style={Signinsee}>
                    <div>
                        <Typography component="h1" variant="h5">
                            SignUp
                        </Typography>
                    </div>
                    <div>
                        <Link to = "/">
                            <button className="btn"><i className="fa fa-home">WebChat</i></button>
                        </Link>
                    </div>
                </Card>
                <Card className="formacontrooutside">
                    <form className="customform" noValidate onSubmit = {this.handleSubmit}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Id-example: abc@xyz.com"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            type="text"
                            onChange={this.handleChange}
                            value={this.state.email}
                        />
                        <div>
                            <p style={{color: 'grey', fontSize:'15px', marginLeft:"0"}}>
                                Password length must be greater than 6 characters (Must include a number and a special character)
                            </p>
                        </div>
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
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="Name"
                            type="text"
                            label="Enter your Name"
                            name="name"
                            autoComplete="name"
                            autoFocus
                            onChange={this.handleChange}
                            value={this.state.name}
                        />
                        <div>
                            <p style={{color: 'grey', fontSize:'15px'}}>
                                All fields are mandatory
                            </p>
                        </div>
                        <div className="CenterAlignItems">  
                            <button className="button1" type="submit">
                                <span>SignUp</span>
                            </button>
                        </div>
                        <div>
                            <p style={{color: 'grey'}}>Already have an account?</p>
                            <Link to="/login">
                                Log In
                            </Link>
                        </div>
                        <div className="error">
                            <p id="1" style={{color: 'red'}}></p>
                        </div>

                    </form>
                </Card>
            </div>
        )
    }
}
