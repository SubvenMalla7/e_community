import React from "react";
import NavBar from '../../components/navBar/Header.js'
import ProfileComponent from "../../components/profile/profComponent.js";
import './style.css';
const firebase = require("firebase");

class Profile extends React.Component {
  constructor() {
    super();
    this.state = {
   
      notification: [],
    };
  }
  componentDidMount = () => {
    firebase.auth().onAuthStateChanged(async _users => {
      if (!_users)
        this.props.history.push('/');
      else {
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
      }
    })
  }
  render() {
    const data = this.props.location.state;
    return (

      <>

        <NavBar notification={this.state.notification} />
        <ProfileComponent currentUser={data.currentUser} name={data.name} email={data.email} bio={data.bio} image={data.image} proff={data.proff} />
      </>
    );
  }
}



export default Profile;
