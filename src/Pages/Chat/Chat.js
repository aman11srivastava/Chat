import React, { Component } from 'react'
import LoginString from '../Login/LoginStrings'
import firebase from '../../Services/firebase'

export default class Chat extends Component {
    constructor(props) {
        super(props)
        this.currentUsername = localStorage.getItem(LoginString.Name)
    
        this.state = {
             
        }
        this.logout = this.logout.bind(this);
    }

    logout = (e) => {
        firebase.auth().signOut()
        this.props.history.push('/')
        localStorage.clear()
    }
    
    render() {
        return (
            <div>
                This is a Chat Component
                Welcome {this.currentUsername}   
                <button onClick={this.logout}>Logout</button>
            </div>
        )
    }
}
