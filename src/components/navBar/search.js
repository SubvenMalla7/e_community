import React from 'react';
import { withRouter } from 'react-router-dom';
const firebase = require("firebase");
class Search extends React.Component {
    constructor() {
        super();
        this.state = {
            users: [],
            search: '',
        }
    }
    componentDidMount = () => {
        firebase.auth().onAuthStateChanged(async _users => {
            if (!_users)
                this.props.history.push('/');
            else {
                await firebase
                    .firestore()
                    .collection('users').get()
                    .then(async res => {
                        const users = res.docs.map(_doc => _doc.data());
                        await this.setState({
                            users: users
                        });

                    });

            }
        });
    }
    handleMenuClick = (pageUrl, currentUsr, email, name, bio, image,proff) => {
        this.props.history.push(pageUrl, { currentUser: currentUsr, email: email, name: name, bio: bio, image: image, proff:proff });
    };


    userTyping = (type, e) => {

        switch (type) {
            case 'search':
                this.setState({ search: e.target.value })
                break;
            default:
                break;
        }
    }

    render() {

        let users = this.state.users;
        console.log("search", this.state.search);
        const filteredUsers = users.filter(_user => {
            return _user.email.includes(this.state.search)
        });
        console.log(filteredUsers);
        return (
            <>
                <div className="header-top-search">
                    <form className="top-search-box">
                        <input type="text" placeholder="Search" className="top-search-field" onClick={() => {
                            let box = document.querySelector('.search-dropdown');
                            box.classList.remove('hidebox');
                        }} onChange={(e) => this.userTyping('search', e)} />
                        <button className="top-search-btn"><i className="flaticon-search" /></button>
                    </form>
                </div>
                <div className="search-dropdown hidebox" id="a">

                    <ul className="dropdown-msg-list">
                        {
                            filteredUsers.map((_user, i) => {
                                return (
                                    <li className="msg-list-item d-flex" key={i} onClick={() => this.handleMenuClick('/profile', false, _user.email, _user.name, _user.bio, _user.image,_user.proff)}>
                                        {/* profile picture end */}
                                        <div className="profile-thumb">
                                            <figure className="profile-thumb-middle">
                                                <img src={_user.image} alt="profilepicture" />
                                            </figure>
                                        </div>
                                        {/* profile picture end */}
                                        {/* message content start */}
                                        <div style={{ paddingTop: "10px", paddingLeft: "15px" }}>
                                            <h6 className="author">{_user.email}</h6>
                                        </div>

                                    </li>
                                )
                            })
                        }
                    </ul>

                </div>
            </>
        );
    }
}
export default withRouter(Search);