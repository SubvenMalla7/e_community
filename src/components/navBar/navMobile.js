import React from "react";
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import HomeIcon from '@material-ui/icons/Home';
import AssignmentIcon from '@material-ui/icons/Assignment';
import Badge from '@material-ui/core/Badge';
import MailIcon from '@material-ui/icons/Mail';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MenuItem from '@material-ui/core/MenuItem';
import { withRouter } from 'react-router-dom';
import Menu from '@material-ui/core/Menu';

import MessageDropDown from '../navBar/messageDropdown';


const firebase = require("firebase");

const useStyles = makeStyles((theme) => ({
    header_top: {
        WebkitBoxShadow: "0px 1px 20px 0px rgba(85, 85, 85, 0.25)",
        boxShadow: "0px 1px 20px 0px rgba(85, 85, 85, 0.25)",
    },
    profile_head: { padding: "12px" },
    profile_head_name: { fontSize: "16px", fontWeight: "500", lineHeight: "1", paddingBottom: "7px" },
    profile_head_name_a: { color: "#333333" },
    profile_head_name_a_hover: { color: "#dc4734" },
    profile_head_mail: { fontSize: "13px", color: "#ff914d", display: "block" },
    profile_body: { lineHeight: "1", marginBottom: "15px", color: '#ff914d', paddingRight: "2px", fontSize: " 16px", padding: " 0 20px", },

}));
const MobileNav = (props) => {


    const [anchorEl, setAnchorEl] = React.useState(null);
    const isMenuOpen = Boolean(anchorEl);
    const classes = useStyles();
    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };


    const { history, notification, messageCount, notiCount, proff } = props;
    const handleMenuClick = (pageUrl, currentUsr, email, name, bio, image) => {
        history.push(pageUrl, { currentUser: currentUsr, email: email, name: name, bio: bio, image: image, proff: proff });

    };
    const resetBadge = async () => {
        console.log("presssed");
        await firebase
            .firestore()
            .collection('badge')
            .doc("count")
            .update({
                messageCount: 0
            });
    };
    const resetNotiBadge = async () => {
        console.log("presssed");
        await firebase
            .firestore()
            .collection('badge')
            .doc("count")
            .update({
                notiCount: 0
            });
    };
    const menuId = 'profile-setting-box';
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            id={menuId}
            keepMounted
            transformOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            open={isMenuOpen}
            onClose={() => setAnchorEl(null)}>
            <MenuItem>
                <div className={classes.profile_head}>
                    <h5 className={classes.profile_head_name}>{firebase.auth().currentUser.displayName}</h5>
                    <h6 className={classes.profile_head_mail} color="#ff914d">{firebase.auth().currentUser.email}</h6>
                </div>
            </MenuItem>
            <hr bordertop="10px solid #bbb" borderradius="5px" />
            <ul>
                <MenuItem className={classes.profile_body} onClick={() => handleMenuClick('/profile', true)}>Profile</MenuItem>
                <MenuItem className={classes.profile_body} onClick={() => handleMenuClick('/')}>Sign out</MenuItem>
            </ul>
        </Menu >
    );


    return (
        <>
            <div className="mobile-header-wrapper sticky d-block d-lg-none">
                <div className="mobile-header position-relative " >
                    <div >
                        <a href="index.html">
                            <img src="assets/images/logo/logo.png" height={"40vh"} width={"50vw"} alt="logo" />
                        </a>
                    </div>

                    <div className="mobile-menu w-100 " margintop={20}>

                        <ul style={{ margintop: 10 }}>
                            <li>
                                <IconButton aria-label="show Home" color="inherit" onClick={() => handleMenuClick('/blog')}><HomeIcon /></IconButton>
                            </li>
                            <li className="active" ><IconButton aria-label="show Home" color="inherit" size="medium" onClick={() => { handleMenuClick('/discussion') }}><AssignmentIcon color="inherit" /></IconButton></li>
                            <li className="msg-trigger"> <IconButton onClick={() => {
                                handleMenuClick('/mobMessage')
                                resetBadge();
                            }} aria-label="show 4 new mails" color="inherit" size="medium">
                                <Badge badgeContent={messageCount
                                } color="primary">
                                    <MailIcon />
                                </Badge>
                            </IconButton>
                                {/* Message Drop Down */}
                                <MessageDropDown />
                            </li>
                            <li className="notification-trigger"> <IconButton onClick={() => {
                                resetNotiBadge();
                                history.push("/mobileNotification", { notification: notification })
                            }} aria-label="show 17 new notifications" color="inherit" >
                                <Badge badgeContent={notiCount} color="primary">
                                    <NotificationsIcon />
                                </Badge>
                            </IconButton>

                            </li>

                            <li className="notification-trigger"> <IconButton onClick={() => {
                                handleMenuClick("/mobileCalender")
                            }} aria-label="show 17 new notifications" color="inherit" >
                                <Badge color="primary">
                                    <CalendarTodayIcon />
                                </Badge>
                            </IconButton>

                            </li>
                        </ul>
                    </div>
                    <div className="mobile-header-profile">

                        <div className="profile-thumb-small" onClick={handleProfileMenuOpen} >
                            <figure >
                                <img src="../assets/images/profile.jpg" alt="profilepicture" />
                            </figure>
                        </div>

                    </div>
                </div>
            </div >
            {renderMenu}
        </>
    )

}

export default withRouter(MobileNav);