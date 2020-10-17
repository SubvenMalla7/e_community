import React from "react";
import NavBar from '../components/navBar/Header.js'
import SideProfile from '../components/sideProfile.js'
import BlogPostBar from '../components/blog/blogPostbar.js'
import RecentNotification from '../components/recentNotification.js';
import Post from "../components/blog/blogPost.js";
const firebase = require("firebase");
class Blog extends React.Component {
  constructor() {
    super();
    this.state = {
      blog: [],
      imageAsUrl: "",
      imageAsUrlAdmin: "",
      editBlog: [],
      notification: [],
      messageCount: 0,
      notiCount: 0,
    }
  }

  componentDidMount = () => {

    firebase.auth().onAuthStateChanged(async _users => {
      if (!_users)
        this.props.history.push('/');
      else {
        await firebase
          .firestore()
          .collection('blog').orderBy('id', 'desc')
          .onSnapshot(async res => {
            const blogs = res.docs.map(_doc => _doc.data());
            await this.setState({
              blog: blogs,
            });

          });
        await firebase
          .firestore()
          .collection('notification')
          .orderBy('date', 'desc')
          .onSnapshot(async res => {
            const notification = res.docs.map(_doc => _doc.data());
            await this.setState({
              notification: notification
            });

          });
        await firebase
          .firestore()
          .collection('users')
          .where('email', '==', firebase.auth().currentUser.email)
          .onSnapshot(async res => {
            const userData = res.docs.map(_doc => _doc.data());

            await this.setState({
              imageAsUrl: userData[0].image,
            });

          });
        await firebase
          .firestore()
          .collection('users')
          .where('email', '==', "admin@admin.com")
          .onSnapshot(async res => {
            const userData = res.docs.map(_doc => _doc.data());

            await this.setState({
              imageAsUrlAdmin: userData[0].image,
            });

          });
        await firebase
          .firestore()
          .collection('badge')
          .onSnapshot(async res => {
            const count = res.docs.map(_doc => _doc.data());
            console.log("count", count[0].messageCount);
            await this.setState({
              messageCount: count[0].messageCount,
              notiCount: count[0].notiCount
            });

          });
      }
    })
  }



  findBlog = async (id) => {

    await firebase
      .firestore()
      .collection('blog')
      .where('id', '==', id)
      .onSnapshot(async res => {
        const blogs = res.docs.map(_doc => _doc.data());

        await this.setState({
          editBlog: blogs
        });

      });
  }

  render() {
    const blog = this.state.blog;
    const notification = this.state.notification;
    return (
      <>

        <NavBar notification={notification} image={this.state.imageAsUrl} messageCount={this.state.messageCount} notiCount={this.state.notiCount} imageAsUrlAdmin={this.state.imageAsUrlAdmin} />
        <main>
          <div className="main-wrapper pt-70">
            <div className="container">
              <div className="row">
                {/* Profile Component */}
                <SideProfile image={this.state.imageAsUrl} />
                {/* Add new Statusbar component */}
                <div className="col-lg-6 order-1 order-lg-2">
                  {firebase.auth().currentUser.email === "admin@admin.com" ? <BlogPostBar blog={this.state.editBlog} image={this.state.imageAsUrlAdmin} messageCount={this.state.messageCount} notiCount={this.state.notiCount} /> : console.log("othersss")}

                  {blog.map((_blog, i) => (
                    < Post key={i} id={_blog.id} title={_blog.title} body={_blog.body} image={_blog.image} profileimage={this.state.imageAsUrlAdmin} findBlog={this.findBlog} />))}
                </div>
                {/* Recent Notification Components */}
                <RecentNotification notification={notification} image={this.state.imageAsUrlAdmin} />
              </div>
            </div>
          </div>
        </main>
        {/* Scroll to top start */}
        <div className="scroll-top ">
          <i className="bi bi-finger-index" onClick={() => {
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
          }} />
        </div>

        {/* Scroll to Top End */}

        {/* footer area end */}
      </>

    )
  }
}
export default Blog