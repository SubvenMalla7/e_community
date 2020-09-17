import React from 'react';
import '../chat.css';
import Avatar from '@material-ui/core/Avatar';

const firebase = require("firebase");
class ChatView extends React.Component {
    constructor() {
        super();
        this.state = {
            chatText: '',
        };
    }

    userTyping = (e) => e.keyCode === 13 ? this.submitMessage() : this.setState({ chatText: e.target.value });

    valida = (txt) => txt && txt.replace(/\s/g, '').length;

    userClicked = () => this.props.msgReadFn;

    submitMessage = () => {
        if (this.valida(this.state.chatText)) {
            this.props.submitMessage(this.state.chatText);
            document.getElementById('chatbox').value = '';
        };
    }

    componentDidUpdate = () => {
        const cont = document.getElementById('chatview');
        if (cont)
            cont.scrollTo(0, cont.scrollHeight);

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
    render() {
        const { chats, user } = this.props;
        if (chats === undefined) {
            return (<main id="chatview"></main>)
        } else {
            return (
                <>
                    <div style={{ boxSizing: "border-box" }}>
                        <div className="message-info float-left" style={{ height: "85vh", width: "62vw" }}>
                            <div className="message-header" >
                                <div className="move-message" >
                                    {chats.chatName}
                                </div>{/* /.move-message */}
                            </div>{/* /.message-header */}
                            <div className="message-box" id="chatview" style={{ height: "60vh", overflow: "scroll", padding: "25px 100px" }} >
                                {
                                    chats.message.map((_msg, i) => {
                                        // this.findProfile(_msg.sender);
                                        return (
                                            < div key={i} >
                                                {_msg.sender === user ? <MessageOut message={_msg.message} sender={_msg.sender} image={this.state.image} /> : <MessageIn message={_msg.message} sender={_msg.sender} />}
                                            </div>
                                        )
                                    })
                                }

                            </div>
                            <div className="form-chat">
                                <div class="chat-text-field" >
                                    <textarea class="live-chat-field custom-scroll" style={{ border: "1px solid black", borderRadius: "25px", padding: "10px", width: "80vw" }} id='chatbox' onFocus={this.userClicked} placeholder='Type your message...' onKeyUp={(e) => this.userTyping(e)}></textarea>
                                    <button class="chat-message-send" style={{ padding: "5px" }} type="button" onClick={this.submitMessage}>
                                        <img src="assets/images/icons/plane.png" alt="" />
                                    </button>
                                </div>

                            </div >
                        </div>{/* /.message-info */}
                        <div className="box box-message float-left" style={{ height: "85vh", width: '15vw' }}>
                            <div className="box-header">
                                <div className="header-title" >
                                    <span>Users</span>
                                </div>
                            </div>{/* /.box-header */}

                            <div style={{ height: "60vh", overflow: "scroll", float: "left", width: "15vw" }}>
                                {

                                    chats.users.map((_chat, i) => {
                                        return (
                                            <div key={i} style={{ margin: "30px" }} >
                                                <li>{_chat}</li>
                                            </div>
                                        )
                                    })
                                }
                            </div>

                        </div >
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

            <div className="message-in">
                <div className="message-pic">
                    <Avatar style={{ marginLeft: "30px", backgroundColor: "#ff914d", fontSize: "20" }} alt="">{props.sender.split('')[0]}</Avatar>
                    <div>{props.sender}</div>
                </div>
                <div className="message-body">
                    <div className="message-text">
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
            <div className="message-out">
                <div className="message-pic">
                    <Avatar style={{ backgroundColor: "#ff914d", fontSize: "20" }} alt="">{props.sender.split('')[0]}</Avatar>

                </div>
                <div className="message-body">
                    <div className="message-text">
                        <p>{props.message}</p>

                    </div>
                </div>
                <div className="clearfix" />
            </div>
            <div className="clearfix" />
        </>
    )
}

export default ChatView;