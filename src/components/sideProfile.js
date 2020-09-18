import React from 'react';
const firebase = require("firebase");

class SideProfile extends React.Component {
    constructor() {
        super();
        this.state = {
            email: '',
            name: '',
        };
    }
    componentDidMount = () => {

        firebase.auth().onAuthStateChanged(async _users => {
            console.log(_users);
        });

        this.setState({
            email: firebase.auth().currentUser.email,
            name: firebase.auth().currentUser.displayName == null ? 'No display Name' : firebase.auth().currentUser.displayName,

        });
    }

    render() {
        return (
            <div className="col-lg-3 order-2 order-lg-1" style={{ marginTop: "10px" }}>
                <aside className="widget-area" >
                    <div className="card card-profile widget-item p-0" style={{ borderRadius: '32px' }} >
                        <div className="profile-banner" style={{ backgroundColor: '#fc9e68', marginTop: '10', borderRadius: '32px' }}>
                            <figure className="profile-banner-small">

                                <a href={{}} className="profile-thumb-2">
                                    <img src={this.props.image===""?'../assets/images/account.png':this.props.image} alt="" />
                                </a>
                            </figure>
                            <div className="profile-desc text-center">
                                <h6 className="author"><a href={{}} style={{ color: '#ffffff' }}>{this.state.name}</a></h6>
                                <p>{this.state.email}</p>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>

        )
    }
}

export default SideProfile;