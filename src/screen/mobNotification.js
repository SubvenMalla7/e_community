import React from 'react';

import { withRouter } from 'react-router';
import Navbar from '../components/navBar/Header';
class MobNotification extends React.Component {
    render() {
        const { notification } = this.props.location.state;
        return (
            <>
                <Navbar />
                <div style={{ height: "10vh" }}></div>
                <div style={{ padding: "0px 8px" }}>
                    <div className="dropdown-title">
                        <p className="recent-msg" style={{ padding: "0px 0px 0px 63px", fontSize: "23px", color: "#ff914d" }}>recent Notification</p>

                    </div>
                    <ul className="dropdown-msg-list">

                        {notification == null ? null : notification.slice(0, 5).map((_noti, i) => (
                            <>
                                <Notification key={i} notification={_noti.notification} />
                                <hr class="solid" style={{ borderTop: '1px solid white', borderRadius: '0.5px' }}></hr>
                            </>
                        ))}

                    </ul>
                </div>
            </>
        )
    }
}

const Notification = (props) => {
    return (
        <li className="msg-list-item d-flex">
            {/* profile picture end */}
            <div className="profile-thumb">
                <figure className="profile-thumb-middle">
                    <img src="assets/images/profile/profile-small-3.jpg" alt="profilepicture" />
                </figure>
            </div>
            {/* profile picture end */}
            {/* message content start */}
            <div style={{ paddingTop: "10px", paddingLeft: "15px" }}>
                <h6 className="author">{props.notification}</h6>
            </div>

        </li>
    )
}

export default withRouter(MobNotification);