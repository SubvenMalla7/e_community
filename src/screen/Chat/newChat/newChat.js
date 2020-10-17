import React from 'react';
import { FormControl, InputLabel, Input, Button, Paper, withStyles, CssBaseline, Typography } from '@material-ui/core';
import styles from './style';
const firebase = require("firebase");

class NewChatForm extends React.Component {

    constructor() {
        super();
        this.state = {
            username: [],
            message: null,
            chatName: null,
        }
    }

    userTyping = (type, e) => {
        switch (type) {
            case 'username':
                let users = [];
                users.push(e.target.value.split(',').sort())

                this.setState({ username: users })
                break;
            case 'message':
                this.setState({ message: e.target.value })
                break
            case 'chatName':
                this.setState({ chatName: e.target.value })
                break

            default:
                break;
        }
    }

    submitNewChat = async (e) => {
        e.preventDefault();
        const userExists = await this.userExists();
        if (userExists) {
            console.log("userExists");
            const chatExists = await this.chatExists();
            chatExists ? this.goToChat() :
                this.createChat();
        } else {
            console.log("no User");
        }
    }

    createChat = () => {
        this.props.newChatSubmit({
            sendTo: this.state.username[0],
            message: this.state.message,
            chatName: this.state.chatName == null ? ` ${this.state.username[0]}` : this.state.chatName,
        });
    }

    goToChat = () => this.props.goToChat(this.buildDocKey(), this.state.message);

    userExists = async () => {
        const usersSnapshot = await
            firebase
                .firestore()
                .collection('users')
                .get();
        console.log("user1", this.state.username[0].toString());
        const data = usersSnapshot
            .docs
            .map((_doc) => _doc.data().email);
        let users = this.state.username[0];
        let userExist = [];
        for (var i = 0; i < users.length; i++) {

            var exists = data.includes(users[i]);
            console.log('user', `${users[i]}`);
            userExist.push(exists);
        }

        return userExist.every(v => v === true);
    }
    buildDocKey = () => { //building a docKey used in firebase 
        let usernames = this.state.username[0].sort().join(':');
        return [firebase.auth().currentUser.email, usernames].sort().join(":");
    }

    chatExists = async () => {
        const docKey = this.buildDocKey();
        const chat = await firebase.firestore().collection('chats').doc(docKey).get();
        return chat.exists;
    }


    render() {

        const { classes } = this.props;

        return (
            <main className={classes.main}>
                <CssBaseline></CssBaseline>
                <Paper className={classes.paper}>
                    <Typography component="h1" variant="h5">Send a Message</Typography>
                    <form className={classes.form} onSubmit={(e) => this.submitNewChat(e)}>
                        <FormControl fullWidth>
                            <InputLabel htmlFor="new-username">
                                example@example,example1@example.com
                            </InputLabel>
                            <Input required className={classes.input} autoFocus onChange={(e) => this.userTyping("username", e)} id="new- username"></Input>
                        </FormControl>
                        <FormControl fullWidth style={{ display: "none" }} id="grp">
                            <InputLabel htmlFor="new-chatName">
                                Enter your Group's name
                            </InputLabel>
                            <Input className={classes.input} onChange={(e) => this.userTyping("chatName", e)} id="new-chatName"></Input>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel htmlFor="new-message">
                                Enter Your Message Here.
                            </InputLabel>
                            <Input required className={classes.input} onChange={(e) => this.userTyping("message", e)} id="new-message"></Input>
                        </FormControl>

                        <Button className={classes.submit} variant="contained" color="primary" type="button" onClick={() => {
                            let box = document.getElementById('grp');
                            box.removeAttribute("style");
                        }}>Group Chat</Button>
                        <Button className={classes.submit} variant="contained" color="primary" type="submit">Submit</Button>
                    </form>
                </Paper>
            </main>
        )
    }
}

export default withStyles(styles)(NewChatForm);