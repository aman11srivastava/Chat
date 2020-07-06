import React, { Component } from 'react'
import LoginString from '../Login/LoginStrings'
import firebase from '../../Services/firebase'
import './Chat.css'
import ReactLoading from 'react-loading'


export default class Chat extends Component {
    constructor(props) {
        super(props)
        this.currentUsername = localStorage.getItem(LoginString.Name)
    
        this.state = {
            isLoading: true,
            isOpenDialogConfirmLogout: false,
            currentPeerUser: null,
            displayedContactSwitchedNotification: []             
        }
        this.getListUser = this.getListUser.bind(this);
        this.renderListUsers = this.renderListUsers.bind(this);
        this.logout = this.logout.bind(this);
        this.updateRenderList = this.updateRenderList.bind(this);
        this.notificationErase = this.notificationErase.bind(this);
        this.renderListUsers = this.renderListUsers.bind(this);
        this.getClassnameforUserandNotification = this.getClassnameforUserandNotification.bind(this);
        this.onProfileClick = this.onProfileClick.bind(this);
        this.currentUsername = localStorage.getItem(LoginString.Name);
        this.currentUserId = localStorage.getItem(LoginString.ID);
        this.currentUserDocumentId = localStorage.getItem(LoginString.FirebaseDocumentId)
        this.currentUserPhoto = localStorage.getItem(LoginString.PhotoURL);
        this.searchUsers = []
        this.displayedContacts = []
        this.currentUserMessages = []
        this.notificationMessageErase = []
    }

    notificationErase = (itemId) => {
        this.state.displayedContactSwitchedNotification.forEach((e1) => {
            if (e1.notificationId.length > 0){
                if (e1.notificationId != itemId) {
                    this.notificationMessageErase.push({
                        notificationId: e1.notificationId,
                        number: e1.number
                    })
                }
            }
        })
        this.updateRenderList()
    }

    updateRenderList = () => {
        firebase.firestore().collection('users').doc(this.currentUserDocumentId).update({
            messages: this.notificationMessageErase
        })
        this.setState({
            displayedContactSwitchedNotification: this.notificationMessageErase
        })
    }

    onProfileClick = () => {
        this.props.history.push('/profile')
        localStorage.clear()
    }



    logout = (e) => {
        firebase.auth().signOut()
        this.props.history.push('/')
        localStorage.clear()
    }

    getClassnameforUserandNotification = (itemId) => {
        let number = 0
        let className = ""
        let check = false
        if (this.state.currentPeerUser && this.state.currentPeerUser.id === itemId){
            className = 'viewWrappedItemFocused'
        }
        else {
            this.state.displayedContactSwitchedNotification.forEach((item ) => {
                if (item.notificationId.length > 0) {
                    if (item.notificationId === itemId) {
                        check = true
                        number = item.number
                    }
                }
            })
            if (check === true){
                className="viewWrapItemNotification"
            }
            else {
                className="viewWrapItem"
            }
        }
        return className
    }

    renderListUsers = () => {
        if(this.searchUsers.length > 0) {
            let viewListUser = []
            let classname= ""
            this.searchUsers.map((item) => {
                if (item.id != this.currentUserId){
                    classname = this.getClassnameforUserandNotification(item.id)
                    viewListUser.push(
                        <button
                            id={item.key}
                            className={classname}
                            onClick = {() => {
                                this.notificationErase(item.id)
                                this.setState({currentPeerUser: item})
                                document.getElementById(item.key).style.backgroundColor = '#fff'
                                document.getElementById(item.key).style.color = "#fff"
                            }} 
                        >
                            <img
                                className="viewAvatarItems"
                                src={item.URL}
                                alt=""                                
                            />
                            <div className="viewWrapContentItem">
                                <span className="textItem">
                                    {`${item.name}`}
                                </span>
                            </div>
                            {classname === 'viewWrapItemNotification' ? 
                            <div className="notificationparagraph">
                                <p id={item.key} className="newmessages">New Messages</p>
                            </div> : null }
                        </button>
                    )
                }
            })
            this.setState({
                displayedContacts: viewListUser
            })
        }
        else {
            console.log('No user is present');
            
        }
    }

    getListUser = async () => {
        const result = await firebase.firestore().collection('users').get();
        if(result.docs.length > 0){
            let listUsers = []
            listUsers = [...result.docs]
            listUsers.forEach((item, index) => {
                this.searchUsers.push({
                    key: index,
                    documentKey: item.id,
                    id: item.data().id,
                    name: item.data().name,
                    messages: item.data().messages,
                    URL: item.data().URL,
                    description: item.data().description
                })
            })
            this.setState({
                isLoading: false
            })
        }
        this.renderListUsers()
    }

    componentDidMount = () => {
        firebase.firestore().collection('users').doc(this.currentUserDocumentId).get()
        .then((doc) => {
            doc.data().messages.map((item) => {
                this.currentUserMessages.push({
                    notificationId: item.notificationId,
                    number: item.number
                })
            })
            this.setState({
                displayedContactSwitchedNotification: this.currentUserMessages
            })
        })
        this.getListUser()
    }
    
    render() {
        return (
            <div className="root">
                <div className="body">
                    <div className="viewListUser">
                        <div className="profileViewLeftSide">
                            <img
                                className="profilePicture"
                                alt=""
                                src={this.currentUserPhoto}
                                onClick={this.onProfileClick}
                            />
                            <button className="logout" onClick={this.logout}>
                                logout
                            </button>
                        </div>
                        {this.state.displayedContacts}
                    </div>
                </div>
                
            </div>
        )
    }
}
