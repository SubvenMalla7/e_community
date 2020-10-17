import React from 'react';
const firebase = require("firebase");


class DiscussionPost extends React.Component {


    editBlog = (id) => {
        this.props.findBlog(id);
        document.getElementById('textbox').style.display = "block";
        // document.getElementById("textbox").style.display = "none";
    }
    deleteBlog = async (id) => await firebase.firestore().collection('discussion').doc(id).delete()



    render() {
        const { id, title, image, body } = this.props;

        return (
            <>
                {/* post status start */}
                <div className="card" style={{ borderRadius: '10px' }}>
                    {/* post title start */}
                    <div className="post-title d-flex align-items-center">
                        {/* profile picture end */}

                        <div className="profile-thumb">

                            <figure className="profile-thumb-middle">
                                <img src={this.props.profileimage} alt="profile_picture" />
                            </figure>

                        </div>
                        {/* profile picture end */}
                        <div className="posted-author" onClick={() => console.log()}>
                            <h6 className="author" style={{ color: '#ff914d' }}>{this.props.name}</h6>
                            <span className="post-time">{id.substring(0, 10)}</span>
                        </div>
                        <div className="post-settings-bar" style={{ backgroundcolor: '#000000' }}>
                            <span />
                            <span />
                            <span />
                            <div className="post-settings arrow-shape">
                                <ul>
                                    <li><button onClick={() => this.editBlog(id)}>Edit post</button></li>
                                    <li><button onClick={() => this.deleteBlog(id)}>Delete Post</button></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    {/* post title start */}
                    <div className="post-content">
                        <p>
                            {title}</p>
                        <p className="post-desc">
                            {body}</p>
                        <div className="post-thumb-gallery">
                            <figure className="post-thumb img-popup">

                                <img src={image} alt="Blog_image" />


                            </figure>
                        </div>

                    </div>
                </div>
            </>
        )
    }
}

export default DiscussionPost