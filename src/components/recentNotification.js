import React from 'react';
// const firebase = require("firebase");

class RecentNotification extends React.Component {

    render() {
        const { notification, image } = this.props
        return (
            <div className="col-lg-3 order-3">
                <aside className="widget-area">
                    {/* widget single item start */}
                    <div className="card widget-item" style={{ borderRadius: '32px' }}>
                        <h4 className="widget-title">Recent Notifications</h4>
                        <div className="widget-body">
                            <ul className="like-page-list-wrapper">
                                {notification.slice(0, 5).map((_noti, i) => (
                                    <>
                                        <Notification key={i} notification={_noti.notification} image={image} />
                                        <hr class="solid" style={{ borderTop: '1px solid #ff914d', borderRadius: '0.5px' }}></hr>
                                    </>
                                ))}

                            </ul>
                        </div>
                    </div>
                </aside>
            </div>
        )
    }
}

const Notification = (props) => {
    return (
        <li className="unorder-list">
            {/* profile picture end */}
            <div className="profile-thumb">
                <a href={{}}>
                    <figure className="profile-thumb-small">
                        <img src={props.image} alt="profilepicture" />
                    </figure>
                </a>
            </div>
            {/* profile picture end */}
            <div className="unorder-list-info">
                <h5 className="list-title" >{props.notification}</h5>

            </div>
        </li>
    )
}


export default RecentNotification