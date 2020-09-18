import React from "react";
import NavBar from '../../components/navBar/Header.js'
import ProfileComponent from "../../components/profile/profComponent.js";
import './style.css';

class Profile extends React.Component {

  render() {
    const data = this.props.location.state;
    return (

      <>
        
        <NavBar />
        <ProfileComponent currentUser={data.currentUser} name={data.name} email={data.email} bio={data.bio} image={data.image} proff={data.proff} />
      </>
    );
  }
}



export default Profile;
