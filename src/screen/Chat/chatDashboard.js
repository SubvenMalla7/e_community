import React from 'react'
import MessageList from './Message'
import NavBar from '../../components/navBar/Header.js'
import Chatview from './ChatView/Chatview';

import NewChatForm from './newChat/newChat';
const firebase = require("firebase");

class ChatDashboard extends React.Component {

    constructor() {
        super();
        this.state = {
            selectedChat: null,
            newChatFormVisible: false,
            email: null,
            chats: [],
            messageCount: 0,
            notification: [],
            imageAsUrlAdmin: "",
        };
    }

    newChat = () => {
        this.setState({ newChatFormVisible: true, selectChat: null });
    }
    selectChat = async (chatIndex) => {
        await this.setState({ selectedChat: chatIndex, newChatFormVisible: false });
        this.msgRead();
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
                await firebase
                    .firestore()
                    .collection('notification')
                    .orderBy('date', 'desc')
                    .onSnapshot(async res => {
                        const notification = res.docs.map(_doc => _doc.data());
                        await this.setState({
                            notification: notification
                        });
                    });
                    await firebase
                    .firestore()
                    .collection('users')
                    .where('email', '==', "admin@admin.com")
                    .onSnapshot(async res => {
                        const userData = res.docs.map(_doc => _doc.data());

                        await this.setState({
                            imageAsUrlAdmin: userData[0].image,
                        });

                    });
            }
        })
    }




    submitMessage = (msg) => {
        const docKey = this.buildDocKey(this.state.chats[this.state.selectedChat]
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
        return (
            <>
                <NavBar notification={this.state.notification}  imageAsUrlAdmin={this.state.imageAsUrlAdmin}/>
                {console.log("chats", this.state.chats)}
                <div className="main-wrapper pt-70" style={{ paddingTop: '95px', marginTop: "0", height: "100vh" }}>
                    <MessageList history={this.props.history} newchatFn={this.newChat} selectFnChat={this.selectChat}
                        chats={this.state.chats} userEmail={this.state.email} selectedChatIndex={this.state.selectedChat} ></MessageList>

                    {

                        this.state.newChatFormVisible ?
                            null :
                            <Chatview user={this.state.email} chats={this.state.chats[this.state.selectedChat]} msgReadFn={this.msgRead} submitMessage={this.submitMessage} />
                    }

                    {
                        this.state.newChatFormVisible ? <NewChatForm newChatSubmit={this.newChatSubmit} goToChat={this.goToChat}></NewChatForm> : null
                    }
                </div>
            </>
        );
    }
}

export default ChatDashboard;