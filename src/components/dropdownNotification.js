import React from 'react';

class NotificationDropDown extends React.Component {
    render() {

        const { notification ,imageAsUrlAdmin} = this.props;

        return (
            <div className="notification-dropdown hidebox " id="a">
                <div className="dropdown-title">
                    <p className="recent-msg">recent Notification</p>

                </div>
                <ul className="dropdown-msg-list">
                    
                    {notification==null?null: notification.map((_noti, i) => (
                        <>
                            <Notification key={i} notification={_noti.notification} imageAsUrlAdmin={imageAsUrlAdmin} />
                            <hr class="solid" style={{ borderTop: '1px solid white', borderRadius: '0.5px' }}></hr>
                        </>
                    ))}

                </ul>

            </div>
        )
    }

}
const Notification = (props) => {
    return (
        <li className="msg-list-item d-flex">
            {/* profile picture end */}
            <div className="profile-thumb">
                <figure className="profile-thumb-middle">
                    <img src={props.imageAsUrlAdmin} alt="profilepicture" />
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



export default NotificationDropDown;