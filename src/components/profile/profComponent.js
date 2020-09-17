import React from 'react';
import { CircularProgress } from '@material-ui/core';
const firebase = require("firebase");

class ProfileComponent extends React.Component {
    constructor() {
        super();
        this.state = {
            email: '',
            name: '',
            bio: '',
            proff:'',
            imageAsFile: null,
            imageAsUrl: null,
            valueError: '',
            loading: false
        };
    }

    componentDidMount = () => {
        firebase.auth().onAuthStateChanged(async _users => {
            if (!_users)
                this.props.history.push('/');
            else {
                await firebase
                    .firestore()
                    .collection('users')
                    .where('email', '==', firebase.auth().currentUser.email)
                    .onSnapshot(async res => {
                        const userData = res.docs.map(_doc => _doc.data());
                        console.log("userData", userData);
                        await this.setState({
                            imageAsUrl: userData[0].image,
                            bio: userData[0].bio,
                            proff:userData[0].proff,
                        });

                    });

            }
        });
        this.setState({
            email: firebase.auth().currentUser.email,

            name: firebase.auth().currentUser.displayName == null ? 'No display Name' : firebase.auth().currentUser.displayName,

        });

    }
    userTyping = (type, e) => {

        switch (type) {
            case 'title':
                console.log('title', e.target.value)
                this.setState({ name: e.target.value })
                break;
            case 'body':
                console.log('body', e.target.value)
                this.setState({ bio: e.target.value })
                break
            case 'image':
                this.setState({ imageAsFile: e.target.files[0] })
                console.log("changed");
                break

            default:
                break;
        }
    }
    findProfile = async (id) => {

        await firebase
            .firestore()
            .collection('users')
            .where('email', '==', id)
            .onSnapshot(async res => {
                const userData = res.docs.map(_doc => _doc.data());
                console.log("userData", userData);
                await this.setState({
                    imageAsUrl: userData[0].image,
                    bio: userData[0].bio,
                   

                });

            });
    }
    clear = () => {
        document.getElementById('title').value = '';

        document.getElementById('body').value = '';
    }

    updateProfile = async () => {
        if (this.state.title == null && this.state.body == null && this.state.imageAsFile == null) {
            this.setState({
                valueError: 'Field Empty'
            })
        } else {

            document.getElementById("textbox").style.display = "none";
            this.clear()
            await firebase
                .firestore()
                .collection('users')
                .doc(this.state.email)
                .update({
                    displayName: this.state.name,
                    bio: this.state.bio,
                    image: this.state.imageAsUrl
                });


            await firebase.firestore().collection('notification').doc(Date()).set({
                notification: `Admin Edit Blog "${this.state.title}"`
            });


        }
    }
    imageUploadFn = () => {
        this.setState({ loading: true });
        const uploadTask = firebase.storage().ref(`/ProfileImages/${this.state.imageAsFile.name}`).put(this.state.imageAsFile);
        uploadTask.on('state_changed',
            (snapShot) => {
                //takes a snap shot of the process as it is happening
                console.log(snapShot)
            }, (err) => {
                //catches the errors
                console.log(err)
            }, () => {
                console.log("name", this.state.imageAsFile.name);
                firebase.storage().ref('ProfileImages').child(`${this.state.imageAsFile.name}`).getDownloadURL()
                    .then(fireBaseUrl => {
                        this.setState({ imageAsUrl: fireBaseUrl, loading: false, valueError: "Image Uploaded" });
                    });
                console.log("name", this.state.imageAsFile.name);
                console.log("Url", this.state.imageAsUrl);
            }
        )

    }
    render() {
        const { currentUser, name, email, bio, image, proff } = this.props;
        const color ="#ff914d" ;
        return (
            <>
                <div style={{ height: "4vh" }}></div>
                <div className="main-content">
                    <div className="container mt-7">
                        {/* Table */}
                        <div className="row">
                            <div className="col-xl-8 m-auto order-xl-2 mb-5 mb-xl-0" >
                                <div className="card card-profile shadow" style={{ backgroundColor: color, borderRadius: "32px" }}>
                                    <div className="row justify-content-center">
                                        <div className="col-lg-3 order-lg-2">
                                            <div className="card-profile-image">
                                                <a href={{}}>
                                                    {currentUser === true ? <img src={this.state.imageAsUrl === "" ? '../assets/images/account.png' : this.state.imageAsUrl} alt="profile_pic" className="rounded-circle" /> : <img src={image === undefined ? '../assets/images/account.png' : image} alt="profile_pic" className="rounded-circle" />}

                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-header text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4" style={{ backgroundColor: color }}>
                                        <div className="d-flex justify-content-between">

                                            <div></div>
                                            {currentUser === true ? <button type="button" className="btn btn-sm btn-default float-right" data-toggle="modal" data-target="#textbox" aria-disabled="true" id="email" onClick={() => this.findProfile(this.state.email)}>Edit</button> : <div style={{ height: "40px" }}></div>}

                                            < div className="modal show" id="textbox" aria-labelledby="textbox" >
                                                <div className="modal-dialog">
                                                    <div className="modal-content">
                                                        <div className="modal-header">

                                                            <button type="button" className="close" onClick={() => {
                                                                document.getElementById("textbox").style.display = "none";
                                                                this.clear()
                                                            }} data-dismiss="modal" aria-label="Close">
                                                                <span aria-hidden="true">×</span>
                                                            </button>
                                                        </div>
                                                        <div className="modal-body custom-scroll" >
                                                            <textarea required name="share" className="share-field-big custom-scroll" onChange={(e) => this.userTyping("title", e)} style={{ height: '50px' }} id="title" placeholder="Name" defaultValue={this.state.name} ></textarea>
                                                        </div>
                                                        <div className="modal-body custom-scroll" style={{ height: '80px' }}>
                                                            <input type="file" onChange={(e) => this.userTyping("image", e)} defaultValue=''></input>
                                                            <button type="button" className="post-share-btn" onClick={() => this.imageUploadFn()}>{this.state.loading === false ? "Upload Image" : <CircularProgress color="secondary" size="2rem" />}</button>

                                                        </div>
                                                        <div className="modal-body custom-scroll">
                                                            <textarea required name="share" className="share-field-big custom-scroll" onChange={(e) => this.userTyping("body", e)} style={{ height: '250px' }} id="body" placeholder="Bio" defaultValue={this.state.bio} />
                                                        </div>
                                                        <div className="modal-footer">
                                                            <h4 id="errorEmpty" style={{ color: 'red' }}>{this.state.valueError}</h4>
                                                            <div style={{ width: '50px' }}></div>
                                                            <button type="button" onClick={() => {
                                                                document.getElementById("textbox").style.display = "none";
                                                            }} className="post-share-btn" data-toggle="modal">Close</button>
                                                            <button type="button" onClick={() => this.updateProfile()} className="post-share-btn"> Update </button>

                                                        </div>
                                                    </div>
                                                </div>
                                            </div >
                                        </div>
                                    </div>
                                    <div className="card-body pt-0 pt-md-4">

                                        <div className="text-center">
                                            <h3>
                                                {currentUser === true ? this.state.name : name}
                                            </h3>
                                            <div className="h5 ">
                                                <i className="ni business_briefcase-24 mr-2" />{currentUser === true ? this.state.email : email}
                                            </div>
                                            <div className="h5 ">
                                                <i className="ni business_briefcase-24 mr-2" />{currentUser === true ? this.state.proff : proff}
                                             </div>
                                            <div className="text-center" style={{ height: "fit-content", backgroundColor: "white", margin: "15px", borderRadius: "32px", padding: "12px" }}>

                                                <p >{currentUser === true ? this.state.bio : bio}</p>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}
export default ProfileComponent;