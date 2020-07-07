import React, { Component } from 'react'
import './Profile.css'
import ReactLoading from 'react-loading'
import 'react-toastify/dist/ReactToastify.css'
import firebase from '../../Services/firebase'
import images from '../../ProjectImages/ProjectImage'
import LoginString from '../Login/LoginStrings'

class Profile extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            isLoading: false,
            documentKey: localStorage.getItem(LoginString.FirebaseDocumentId),
            id: localStorage.getItem(LoginString.ID),
            name: localStorage.getItem(LoginString.Name),
            aboutMe: localStorage.getItem(LoginString.Description),
            photoUrl: localStorage.getItem(LoginString.PhotoURL)
        }
        this.newPhoto = null
        this.newPhotoUrl = ""
        this.onChangeAboutMe = this.onChangeAboutMe.bind(this);
        this.onChangeAvatar = this.onChangeAvatar.bind(this);
        this.onChangeName = this.onChangeName.bind(this);
        this.uploadAvatar = this.uploadAvatar.bind(this);
        this.updateUserInfo = this.updateUserInfo.bind(this);
    }

    onChangeName = (e) => {
        this.setState({
            name: e.target.value
        })
    }

    onChangeAboutMe = (e) => {
        this.setState({
            aboutMe: e.target.value
        })
    }

    onChangeAvatar = (e) => {
        if(e.target.files && e.target.files[0]){
            const prefixFileType = e.target.files[0].type.toString()
            if (prefixFileType.indexOf(LoginString.PREFIX_IMAGE) !==0) {
                this.props.showToast(0,'Not an Image file')
                return
            }
            this.newPhoto = e.target.files[0]
            this.setState({
                photoUrl: URL.createObjectURL(e.target.files[0])
            })
        }
        else {
            this.props.showToast(0, 'Something wrong with the selected image file')
        }
    }

    uploadAvatar = () => {
        this.setState({
            isLoading: true
        })
        if(this.newPhoto){
            const uploadTask = firebase.storage()
            .ref()
            .child(this.state.id)
            .put(this.newPhoto)
            uploadTask.on(
                LoginString.UPLOAD_CHANGED,
                null,
                error => {
                    this.props.showToast(0, error.message)
                },
                () => {
                    uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
                        this.updateUserInfo(true, downloadURL)
                    })
                }
            )
        }
        else {
            this.updateUserInfo(false, null)
        }
    }

    updateUserInfo = (isUpdatedPhotoURL, downloadURL) => {
        let newInfo
        if (isUpdatedPhotoURL) {
            newInfo = {
                name: this.state.name,
                Description: this.state.aboutMe,
                URL: downloadURL
            }
        } 
        else {
            newInfo = {
                name: this.state.name,
                Description: this.state.aboutMe                
            }
            firebase.firestore().collection('users')
            .doc(this.state.documentKey)
            .update(newInfo)
            .then( data => {
                localStorage.setItem(LoginString.Name, this.state.name)
                localStorage.setItem(LoginString.Description, this.state.aboutMe)
                if(isUpdatedPhotoURL) {
                    localStorage.setItem(LoginString.PhotoURL, downloadURL)
                }
                this.setState({
                    isLoading: false
                })
                this.props.showToast(1, 'Information Updated Successfully')
            })
        }
    }

    componentDidMount = () => {
        if(localStorage.getItem(LoginString.ID)) {
            this.props.history.push('/')
        }
    }
    
    render() {
        return (
            <div className="profileroot">
                <div className="headerprofile">
                    <span>Profile</span>
                </div>
                <img
                    className="avatar"
                    alt=""
                    src={this.state.photoUrl}
                />
                <div className="viewWrapInputProfile">
                    <img 
                        className="imgInputFile"
                        alt="icon gallery"
                        src={images.chooseFile}
                        onClick={() => {this.refInput.click()}}
                    />
                    <input
                        ref={e1 => {
                            this.refInput = e1
                        }}
                        accept = "image/"  //Users can only select image files only
                        className="viewInputFile"
                        type="file"
                        onChange={this.onChangeAvatar}
                    />
                </div>
                <span className="textLabel">Name</span>
                <input 
                    className="textInput"
                    value={this.state.name ? this.state.name : ""}
                    placeholder="Your Name"
                    onChange={this.onChangeName}
                />
                <span className="textLabel">About Me</span>
                <input 
                    className="textInput"
                    value={this.state.aboutMe ? this.state.aboutMe : ""}
                    placeholder="Your status"
                    onChange = {this.onChangeAboutMe}
                />
                <div>
                    <button className="btnUpdate" onClick={this.uploadAvatar}>
                        SAVE
                    </button>
                    <button className="btnback" onClick={() => {this.props.history.push('/chat')}}>
                        CANCEL
                    </button>
                </div>
                {this.state.isLoading ? (
                    <div>
                        <ReactLoading 
                            type = {'spin'}
                            color = {'#203152'}
                            height = {'3%'}
                            width = {'3%'}
                        />
                    </div>
                ) : null}
                
            </div>
        )
    }
}
export default Profile