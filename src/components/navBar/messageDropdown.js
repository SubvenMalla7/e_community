import React from 'react';
import { withRouter } from 'react-router-dom';

const firebase = require("firebase");
class MessageDropDown extends React.Component {

    constructor() {
        super();
        this.state = {
            selectedChat: null,
            newChatFormVisible: false,
            email: null,
            chats: [],
            displaymsg: []
        };
    }
    componentDidMount = () => {
        firebase.auth().onAuthStateChanged(async _users => {
            if (!_users)
                this.props.history.push('/');
            else {
                await firebase
                    .firestore()
                    .collection('chats')
                    .where('users', 'array-contains', _users.email)
                    .onSnapshot(async res => {
                        const chats = res.docs.map(_doc => _doc.data());
                        await this.setState({
                            email: _users.email,
                            chats: chats,

                        });

                    });

            }
        })

    }

    goToChat = async (docKey) => {
        const userInChat = docKey.split(":");
        const chat = this.state.chats.find(chat => userInChat.every(_user => chat.users.includes(_user))); //finds the chat 
        this.setState({ newChatFormVisible: false }); // removes the chat form 
        await this.selectChat(this.state.chats.indexOf(chat)); //opens the chat exited
        
    }


    render() {

        const { history } = this.props;



        const handleMenuClick = (pageUrl) => {
            history.push(pageUrl);
            
        };
        let chat = this.state.chats;
        const d = new Date()
        const mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
        const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
        return (
            <>
                <div className="message-dropdown hidebox" id="a" style={{height:"auto"}}>
                    <div className="dropdown-title">
                        <p className="recent-msg">recent message</p>

                    </div>
                    <ul className="dropdown-msg-list">

                        { chat.slice(0, 3).map((_chat, i) => {
                            return (
                                <div key={i}>
                                    <Message name={_chat.chatName} message={_chat.message[_chat.message.length - 1].message.substring(0, 30)} da={da} mo={mo} index={i}/>
                                </div>

                            )
                        })}


                    </ul>
                    <div className="msg-dropdown-footer">
                        <button onClick={() => handleMenuClick('/message')} >See all in messenger</button>

                    </div>
                </div>

            </>
        )
    }

}
const Message = (props) => {
    return (
        <li className="msg-list-item d-flex justify-content-between" onClick={()=>this.goToChat()}>
            {/* profile picture end */}
            <div className="profile-thumb">
                <figure className="profile-thumb-middle">
                    <img src="assets/images/profile/profile-small-3.jpg" alt="profilepicture" />
                </figure>
            </div>
            {/* profile picture end */}
            {/* message content start */}
            <div className="msg-content">
                <h6 className="author">{props.name}</h6>
                <p>{props.message}</p>
            </div>
            {/* message content end */}
            {/* message time start */}
            <div className="msg-time">
                <p>{`${props.da}-${props.mo}`}</p>
            </div>
            {/* message time end */}
        </li>
    )
}



export default withRouter(MessageDropDown);