import React from "react";
import { withRouter } from "react-router";
import Divider from '@material-ui/core/Divider';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import NotificationImportant from '@material-ui/icons/NotificationImportant';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import List from '@material-ui/core/List';

import NavBar from '../../../components/navBar/Header.js'
const firebase = require("firebase");

class MobileChat extends React.Component {
    constructor() {
        super();
        this.state = {
            selectedChat: null,
            newChatFormVisible: false,
            email: null,
            chats: [],
            messageCount: 0,
            chatText: '',
        };
    }

    newChat = () => {
        this.setState({ newChatFormVisible: true, selectChat: null });
    }
    selectChat = async (chatIndex) => {
        // let messagebox = document.querySelector('.main-wrapper');
        // messagebox.classList.add('hidebox');
        // let chatbox = document.querySelector('.mobyile-chat-box');
        // chatbox.classList.remove('hidebox');
        await this.setState({ selectedChat: chatIndex, newChatFormVisible: false });
        this.msgRead();
        this.handleMenuClick("/mobileChatView", this.state.chats[this.state.selectedChat], this.state.email);


    }
    handleMenuClick = (pageUrl, chats, user, submitMessageFn) => {
        this.props.history.push(pageUrl, { chats: chats, user: user });


    };
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
                await firebase
                    .firestore()
                    .collection('badge')
                    .onSnapshot(async res => {
                        const count = res.docs.map(_doc => _doc.data());
                        console.log("count", count[0].messageCount);
                        await this.setState({
                            messageCount: count[0].messageCount,

                        });

                    });
            }
        })
    }


    userTyping = (e) => e.keyCode === 13 ? this.submitMessage() : this.setState({ chatText: e.target.value });

    valida = (txt) => txt && txt.replace(/\s/g, '').length;

    userClicked = () => this.props.msgReadFn;

    submitMessage = (msg) => {
        let docKey = this.buildDocKey(this.state.chats[this.state.selectedChat]
            .users
            .filter((_usr, i) => _usr !== this.state.email[i]))
        firebase
            .firestore()
            .collection('chats')
            .doc(docKey)
            .update({
                message: firebase.firestore.FieldValue.arrayUnion({
                    sender: this.state.email,
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

    //creating colections in database eg admin@admin.com:susan@sus.com 

    notSenderClickMsg = (i) => this.state.chats[i].message[this.state.chats[i].message.length - 1].sender !== this.state.email; // latest message sender extraction

    msgRead = () => {

        const docKey = this.buildDocKey(this.state.chats[this.state.selectedChat].users.filter((usr, i) => usr !== this.state.email[i])); //finding friend from state logic
        if (this.notSenderClickMsg(this.state.selectedChat)) { // condition check where sender does not click msg
            console.log("h1");
            firebase
                .firestore()
                .collection('chats')
                .doc(docKey)
                .update({ receiverHasRead: true });
            console.log("h1", docKey);
        } else {
            console.log("Sender clicked the message");
        }
    }

    goToChat = async (docKey, message) => {
        const userInChat = docKey.split(":");
        const chat = this.state.chats.find(chat => userInChat.every(_user => chat.users.includes(_user))); //finds the chat 
        this.setState({ newChatFormVisible: false }); // removes the chat form 
        await this.selectChat(this.state.chats.indexOf(chat)); //opens the chat exited
        this.submitMessage(message);
    }
    userIsSender = (chat) => chat.message[chat.message.length - 1].sender === this.props.userEmail;   //if u are sender u dont need notification icon
    newChatSubmit = async (obj) => {
        let user = []
        obj.sendTo.map((doc) => user.push(doc))
        user.push(this.state.email)
        console.log("asdfsa", user);
        const docKey = this.buildDocKey(user);
        console.log("key",);
        await firebase.firestore().collection('chats').doc(docKey).set({
            receiverHasRead: false,
            users: user,
            chatName: obj.chatName,
            message: [{
                message: obj.message,
                sender: this.state.email,
            }]
        });
        this.setState({ newChatFormVisible: false });
        this.selectChat(this.state.chats.length - 1); //redirect to the chat
    }
    render() {
        const { chats, selectedChatIndex, } = this.state;

        return (
            <>
                <NavBar />
                { console.log("chats", this.state.chats)}
                <div style={{ height: "10vh" }}></div>
                <div className="main-wrapper pt-70 " style={{ marginTop: "0", height: "80vh" }}>
                    <div className="box box-message" style={{ height: "90vh", width: '100vw' }}>
                        <div className="box-header">
                            <div className="header-title" style={{ height: "15vh" }}>
                                <span>INBOX</span>
                            </div>
                        </div>{/* /.box-header */}
                        <List style={{ height: "80vh", overflow: "scroll" }}>
                            {

                                chats.map((_chat, i) => {

                                    return (
                                        <div key={i}>
                                            <ListItem onClick={() => this.selectChat(i)}

                                                selected={selectedChatIndex === i}

                                                alignItems="flex-start">
                                                <ListItemAvatar>
                                                    <Avatar style={{ backgroundColor: "#ff914d", fontWeight: "bold", fontSize: "20" }} alt="Remy Sharp">{_chat.chatName.split('')[0]}</Avatar>
                                                </ListItemAvatar>
                                                <ListItemText primary={<Typography type="body2" style={{ fontWeight: 'bold', fontSize: "20" }}>{_chat.chatName}</Typography>}

                                                    // _chat.users.filter(_user => _user !== userEmail)[0]
                                                    secondary={
                                                        <>
                                                            <Typography component='span' color='textPrimary' >
                                                                {
                                                                    _chat.message[_chat.message.length - 1].message.substring(0, 30)
                                                                }
                                                            </Typography>
                                                        </>
                                                    }></ListItemText>
                                                {
                                                    _chat.receiverHasRead === false && !this.userIsSender(_chat) ?
                                                        <ListItemIcon><NotificationImportant ></NotificationImportant></ListItemIcon> :
                                                        null
                                                }
                                            </ListItem>
                                            <Divider></Divider>

                                        </div>
                                    )
                                })
                            }
                        </List >

                    </div>
                </div>
                <div className="mobyile-chat-box hidebox" >
                    {console.log("asdasdasdasdasdasd", this.state.chats[this.state.selectedChat])}

                </div>
            </>
        )
    }
}

export default withRouter(MobileChat);