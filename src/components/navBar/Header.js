import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import HomeIcon from '@material-ui/icons/Home';

import MailIcon from '@material-ui/icons/Mail';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { withRouter } from 'react-router-dom';
import MobileNav from './navMobile';
import MessageDropDown from '../navBar/messageDropdown';
import NotificationDropDown from '../dropdownNotification';
import CalenderDropDown from '../calender/calenderDropdown';
import Search from './search';


// import * as firebase from 'firebase/app';
// import 'firebase/auth'
const firebase = require("firebase");


const useStyles = makeStyles((theme) => ({

    header_top: {
        WebkitBoxShadow: "0px 1px 20px 0px rgba(85, 85, 85, 0.25)",
        boxShadow: "0px 1px 20px 0px rgba(85, 85, 85, 0.25)",
    },
    profile_head: { padding: "12px" },
    profile_head_name: { fontSize: "16px", fontWeight: "500", lineHeight: "1", paddingBottom: "7px", color: "#ff914d" },
    profile_head_name_a: { color: "#333333" },
    profile_head_name_a_hover: { color: "#dc4734" },
    profile_head_mail: { fontSize: "13px", color: "#ff914d", display: "block" },
    profile_body: { lineHeight: "1", marginBottom: "15px", color: '#ff914d', paddingRight: "2px", fontSize: " 16px", padding: " 0 20px", },

}));

const NavBar = (props) => {

    const [anchorEl, setAnchorEl] = React.useState(null);
    const isMenuOpen = Boolean(anchorEl);
    const classes = useStyles();
    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const { history, notification, messageCount, notiCount, proff } = props;

    // var active = "/blog";
    const handleMenuClick = (pageUrl, currentUsr, email, name, bio, image) => {
        history.push(pageUrl, { currentUser: currentUsr, email: email, name: name, bio: bio, image: image, proff: proff });
        // active = pageUrl;

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
                    <h5 className={classes.profile_head_name} >{firebase.auth().currentUser.displayName}</h5>
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
            <div className="header-top sticky  d-none d-lg-block" style={{ backgroundColor: '#ebe6e4' }}>
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-md-5">
                            {/* header top navigation start */}
                            <div className="header-top-navigation">
                                <nav>
                                    <ul style={{ margin: "0" }}>
                                        <li className="active" ><IconButton aria-label="show Home" color="inherit" size="medium" onClick={() => { handleMenuClick('/blog') }}><HomeIcon color="inherit" /></IconButton></li>
                                        <li className="msg-trigger"> <IconButton onClick={() => {
                                            let box = document.querySelector('.message-dropdown');
                                            box.classList.remove('hidebox');
                                            resetBadge();
                                        }} aria-label="show 4 new mails" color="inherit" size="medium">
                                            <Badge badgeContent={messageCount
                                            } color="primary">
                                                <MailIcon color="inherit" />
                                            </Badge>
                                        </IconButton>
                                            {/* Message Drop Down */}
                                            <MessageDropDown />
                                        </li>
                                        <li className="notification-trigger" style={{ borderColor: "white" }}> <IconButton onClick={() => {
                                            let box = document.querySelector('.notification-dropdown');
                                            box.classList.remove('hidebox');
                                            resetNotiBadge();
                                        }} aria-label="show 17 new notifications" color="inherit" >
                                            <Badge badgeContent={notiCount} color="primary">
                                                <NotificationsIcon />
                                            </Badge>
                                        </IconButton>
                                            <NotificationDropDown notification={notification} />
                                        </li>

                                        <li className="notification-trigger"> <IconButton onClick={() => {
                                            let box = document.querySelector('.calender-dropdown');
                                            box.classList.remove('hidebox');

                                        }} aria-label="show 17 new notifications" color="inherit" >
                                            <Badge color="primary">
                                                <CalendarTodayIcon />
                                            </Badge>
                                        </IconButton>
                                            <CalenderDropDown />
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                            {/* header top navigation start */}
                        </div>
                        <div className="col-md-2">
                            {/* brand logo start */}
                            <div className="brand-logo text-center">
                                <img src="assets/images/logo/logo.png" height={60} alt="brand logo" />
                            </div>
                            {/* brand logo end */}
                        </div>
                        <div className="col-md-5">
                            <div className="header-top-right d-flex align-items-center justify-content-end">
                                {/* header top search start */}
                                <Search />
                                <div className="profile-setting-box" id="profile-setting-box">
                                    <div className="profile-thumb-small">
                                        <div onClick={handleProfileMenuOpen}>
                                            <figure>
                                                <img src="../assets/images/profile.jpg" alt="profilepicture" />
                                            </figure>
                                        </div>
                                    </div>
                                </div>
                                {/* profile picture end */}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <MobileNav notification={notification} messageCount={messageCount} notiCount={notiCount} />
            { renderMenu}
        </>
    )

}




export default withRouter(NavBar);