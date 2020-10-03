import React from 'react';
import { CircularProgress } from '@material-ui/core';
const firebase = require("firebase");

class DiscussionPostBar extends React.Component {
    constructor() {
        super();
        this.state = {
            title: null,
            body: null,
            imageAsFile: null,
            imageAsUrl: null,
            valueError: '',
            loading: false
        }
    }

    userTyping = (type, e) => {

        switch (type) {
            case 'title':
                this.setState({ title: e.target.value })
                break;
            case 'body':
                this.setState({ body: e.target.value })
                break
            case 'image':
                this.setState({ imageAsFile: e.target.files[0] })
                break

            default:
                break;
        }
    }

    newBlogSubmit = async () => {


        if (this.state.title == null && this.state.body == null && this.state.imageAsFile == null) {
            this.setState({
                valueError: 'Field Empty'
            })
        } else {
            var d = new Date();
            var date = ` ${d.getFullYear()}-${d.getMonth()}-${d.getDate()}-${d.getHours()}-${d.getMinutes()}-${d.getSeconds()}`;
            const docKey = date.toString();

            const uploadTask = firebase.storage().ref(`/images/${this.state.imageAsFile.name}`).put(this.state.imageAsFile);
            await uploadTask.on('state_changed',
                (snapShot) => {
                    //takes a snap shot of the process as it is happening
                    console.log(snapShot)
                }, (err) => {
                    //catches the errors
                    console.log(err)
                }

            )

            await firebase.firestore().collection('discussion').doc(docKey).set({
                title: this.state.title,
                body: this.state.body,
                image: this.state.imageAsUrl,
                id: docKey,
                user: firebase.auth().currentUser.displayName,
                userImage: this.props.image
            });
            await firebase.firestore().collection('notification').doc(docKey).set({
                notification: `Discussion"${this.state.title}" Added`,
                date: docKey
            });
            await firebase
                .firestore()
                .collection('badge')
                .doc("count")
                .update({
                    notiCount: this.props.notiCount + 1
                });

            this.clear();
        };
    }
    clear = () => {
        document.getElementById('title').value = '';

        document.getElementById('body').value = '';
    }


    updateBlog = async (blog) => {
        var d = new Date();
        var date = ` ${d.getFullYear()}-${d.getMonth()}-${d.getDate()}-${d.getHours()}-${d.getMinutes()}-${d.getSeconds()}`;
        const docKey = date.toString();
        if (this.state.title == null && this.state.body == null && this.state.imageAsFile == null) {
            this.setState({
                valueError: 'Field Empty'
            })
        } else {
            document.getElementById("textbox").style.display = "none";
            this.clear()

            await firebase
                .firestore()
                .collection('blog')
                .doc(blog.id)
                .update({
                    title: this.state.title == null ? blog.title : this.state.title,
                    body: this.state.body == null ? blog.body : this.state.body,
                    image: this.state.imageAsFile == null ? blog.image : this.state.imageAsUrl
                });


            await firebase.firestore().collection('notification').doc(docKey).set({
                notification: ` News "${this.props.blog.length !== 0 ? this.props.blog[0].title : this.state.title} was Edit"`,
                date: docKey
            });
            await firebase
                .firestore()
                .collection('badge')
                .doc("count")
                .update({
                    notiCount: this.props.notiCount + 1
                });

            this.clear();

        }
    }
    imageUploadFn = () => {
        this.setState({ loading: true });
        const uploadTask = firebase.storage().ref(`/blogImages/${this.state.imageAsFile.name}`).put(this.state.imageAsFile);
        uploadTask.on('state_changed',
            (snapShot) => {
                //takes a snap shot of the process as it is happening
                console.log(snapShot)
            }, (err) => {
                //catches the errors
                console.log(err)
            }, () => {
                firebase.storage().ref('blogImages').child(this.state.imageAsFile.name).getDownloadURL()
                    .then(fireBaseUrl => {
                        this.setState({ imageAsUrl: fireBaseUrl, loading: false, valueError: "Image Uploaded" });
                    });

            }
        )

    }
    render() {
        const { blog } = this.props;
        return (
            <>


                {/* share box start */}

                < div className="card card-small" style={{ borderRadius: '12px' }}>
                    <div className="share-box-inner">
                        {/* profile picture end */}
                        <div className="profile-thumb">
                            <a href={{}}>
                                <figure className="profile-thumb-middle">
                                    <img src={this.props.image} alt="profilepicture" />
                                </figure>
                            </a>
                        </div>
                        {/* profile picture end */}
                        {/* share content box start */}
                        <div className="share-content-box w-100">
                            <form className="share-text-box">
                                <textarea name="share" className="share-text-field" aria-disabled="true" placeholder="Post Your Blog" data-toggle="modal" data-target="#textbox" id="email" defaultValue={""} />
                                <button className="btn-share" data-toggle="modal" type="submit">share</button>
                            </form>
                        </div>
                        {/* share content box end */}
                        {/* Modal start */}
                        <div className="modal fade show" id="textbox" aria-labelledby="textbox">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Post Your Blog</h5>
                                        <button type="button" className="close" onClick={() => {
                                            document.getElementById("textbox").style.display = "none";
                                            this.clear()
                                        }} data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">×</span>
                                        </button>
                                    </div>
                                    <div className="modal-body custom-scroll" >
                                        <textarea required name="share" className="share-field-big custom-scroll" onChange={(e) => this.userTyping("title", e)} style={{ height: '50px' }} id="title" placeholder="Blog title" defaultValue={blog.length !== 0 ? blog[0].title : ''}></textarea>
                                    </div>
                                    <div className="modal-body custom-scroll" style={{ height: '80px' }}>
                                        <input type="file" onChange={(e) => this.userTyping("image", e)} defaultValue={blog.length !== 0 ? blog[0].image : ''}></input>
                                        <button type="button" className="post-share-btn" onClick={() => this.imageUploadFn()}>{this.state.loading === false ? "Upload Image" : <CircularProgress color="secondary" size="2rem" />}</button>
                                        {/* <textarea required name="share" className="share-field-big custom-scroll" onChange={(e) => this.userTyping("image", e)} id="image" placeholder="Image url" defaultValue={blog.length !== 0 ? blog[0].image : ''} /> */}
                                    </div>
                                    <div className="modal-body custom-scroll">
                                        <textarea required name="share" className="share-field-big custom-scroll" onChange={(e) => this.userTyping("body", e)} style={{ height: '250px' }} id="body" placeholder="Blog body" defaultValue={blog.length !== 0 ? blog[0].body : ''} />
                                    </div>
                                    <div className="modal-footer">
                                        <h4 id="errorEmpty" style={{ color: 'red' }}>{this.state.valueError}</h4>
                                        <div style={{ width: '50px' }}></div>

                                        <button type="button" onClick={() => blog.length === 0 ? this.newBlogSubmit() : this.updateBlog(blog[0])} data-dismiss={this.state.title == null && this.state.body == null && this.state.imageAsUrl == null ? "null" : "modal"} className="post-share-btn">{blog.length === 0 ? "Post" : "Update"} </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Modal end */}
                    </div>
                </div >
                {/* share box end */}
            </>
        )
    }
}
export default DiscussionPostBar;