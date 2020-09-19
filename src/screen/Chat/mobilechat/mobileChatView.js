import React from 'react';
import { withRouter } from "react-router";
import '../chat.css';
import Avatar from '@material-ui/core/Avatar';
import NavBar from '../../../components/navBar/Header.js'

const firebase = require("firebase");
class MobileChatView extends React.Component {
    constructor() {
        super();
        this.state = {
            chatText: '',
            messageCount: 0,
            chats: [],
            email: null,
            selectedChat: 0,
        };
    }

    userTyping = (e) => e.keyCode === 13 ? this.submitMessagess() : this.setState({ chatText: e.target.value });

    valida = (txt) => txt && txt.replace(/\s/g, '').length;

    userClicked = () => this.props.location.state.msgReadFn;

    submitMessage = () => {
        if (this.valida(this.state.chatText)) {
            this.props.location.state.submitMessage(this.state.chatText);
            document.getElementById('chatbox').value = '';
        };
    }
    componentDidUpdate = () => {
        const cont = document.getElementById('chatviews');
        if (cont)
            cont.scrollTo(0, cont.scrollHeight);

    }

    componentDidMount = () => {

        firebase.auth().onAuthStateChanged(async _users => {
            if (!_users)
                this.props.history.push('/');
            else {
                await firebase
                    .firestore()
                    .collection('chats')
                    .where('users', 'array-contains', this.props.location.state.user)
                    .onSnapshot(async res => {
                        const chats = res.docs.map(_doc => _doc.data());
                        await this.setState({
                            email: _users.email,
                            chats: chats,
                            selectedChat: this.props.location.state.chatsIndex

                        });

                    });

            }
        })

    }
    findProfile = async (id) => {
        await firebase
            .firestore()
            .collection('users')
            .where('email', '==', id)
            .onSnapshot(async res => {
                const userData = res.docs.map(_doc => _doc.data());

                await this.setState({
                    image: userData[0].image,
                });
            });
    }
    submitMessagess = () => {
        if (this.valida(this.state.chatText)) {
            this.submitMessage(this.state.chatText);
            document.getElementById('chatbox').value = '';
        };
    }

    submitMessage = (msg) => {
        document.getElementById('chatbox').value = '';
        const docKey = this.buildDocKey(this.state.chats[this.state.selectedChat]
            .users
            .filter((_usr, i) => _usr !== this.props.location.state.user[i]))
        console.log("docccc", msg);
        firebase
            .firestore()
            .collection('chats')
            .doc(docKey)
            .update({
                message: firebase.firestore.FieldValue.arrayUnion({
                    sender: this.props.location.state.user,
                    message: msg,
                    timestamp: Date.now()
                }),
                receiverHasRead: false
            });

        firebase
            .firestore()
            .collection('badge')
            .doc("count")
            .update({
                messageCount: this.state.messageCount + 1
            });

    }
    buildDocKey = (friend) => friend.sort().join(':');
    render() {

        const { chatsIndex } = this.props.location.state;
        const { chats, email } = this.state;

        if (chats === undefined) {
            return (<main id="chatviews"></main>)
        } else {
            return (
                <>
                    <NavBar />
                    <div style={{ height: "10vh" }}></div>
                    <div style={{ boxSizing: "border-box" }}>
                        <div className="message-info " style={{ height: "90vh", width: "100vw" }}>
                            <div className="message-header"  >
                                <div className="move-message" style={{ height: "15vh", marginTop: "-15px", padding: "0px" }} >
                                    {chats[chatsIndex] === undefined ? null :chats[chatsIndex].chatName}
                                </div>{/* /.move-message */}
                            </div>{/* /.message-header */}
                            <div className="message-box" id="chatviews" style={{ height: "67vh", overflow: "scroll", padding: "25px 100px" }} >
                                {

                                    chats[chatsIndex] === undefined ? null : chats[chatsIndex].message.map((_msg, i) => {
                                        return (
                                            < div key={i} >
                                                {_msg.sender === email ? <MessageOut message={_msg.message} sender={_msg.sender} image={this.state.image} /> : <MessageIn message={_msg.message} sender={_msg.sender} />}
                                            </div>
                                        )
                                    })
                                }

                            </div>
                            <div className="form-chat" style={{ padding: " 0px 23px" }}>
                                <div class="chat-text-field" >
                                    <textarea class="live-chat-field custom-scroll" style={{ border: "1px solid black", borderRadius: "25px", padding: "10px", width: "80vw" }} id='chatbox' onFocus={this.userClicked} placeholder='Type your message...' onKeyUp={(e) => this.userTyping(e)}></textarea>
                                    <button class="chat-message-send" style={{ padding: "5px" }} type="button" onClick={this.submitMessagess}>
                                        <img src="assets/images/icons/plane.png" alt="" />
                                    </button>
                                </div>

                            </div >
                        </div>{/* /.message-info */}

                        <div className="clearfix" />
                    </div>

                </>
            )
        }
    }
}

const MessageIn = (props) => {
    return (
        <>

            <div className="message-in" style={{ margin: "20px -69px" }}>
                <div className="message-pic">
                    <Avatar style={{ marginLeft: "30px", backgroundColor: "#ff914d", fontSize: "20" }} alt="">{props.sender.split('')[0]}</Avatar>
                    <div>{props.sender}</div>
                </div>
                <div className="message-body">
                    <div className="message-text" style={{ width: "140px", padding: "10px 10px 19px" }}>
                        <p style={{ color: "white" }}>{props.message}</p>
                    </div>
                </div>
                <div className="clearfix" />
            </div>
            <div className="clearfix" />
        </>
    )
}

const MessageOut = (props) => {
    return (
        <>
            <div className="message-out" style={{ margin: "20px -69px" }}>
                <div className="message-pic">
                    <Avatar style={{ backgroundColor: "#ff914d", fontSize: "20" }} alt="">{props.sender.split('')[0]}</Avatar>

                </div>
                <div className="message-body">
                    <div className="message-text" style={{ width: "140px", padding: "10px 10px 19px" }}>
                        <p>{props.message}</p>

                    </div>
                </div>
                <div className="clearfix" />
            </div>
            <div className="clearfix" />
        </>
    )
}

export default withRouter(MobileChatView);