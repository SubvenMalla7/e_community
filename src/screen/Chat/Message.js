import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import List from '@material-ui/core/List';
import styles from './style';
import Divider from '@material-ui/core/Divider';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import NotificationImportant from '@material-ui/icons/NotificationImportant';
import "./chat.css"


class MessageList extends React.Component {
    newChat = () => {
        this.props.newchatFn();
    }
    selectChat = (index) => {
        this.props.selectFnChat(index);
    }
    userIsSender = (chat) => chat.message[chat.message.length - 1].sender === this.props.userEmail;   //if u are sender u dont need notification icon

    render() {
        const { classes, chats, selectedChatIndex, } = this.props;
     
        return (

            <div className="box box-message float-left" style={{ height: "85vh", width: '20vw' }}>
                <div className="box-header">
                    <div className="header-title" >
                        <span>INBOX</span>
                    </div>
                </div>{/* /.box-header */}

                <List style={{ height: "60vh", overflow: "scroll" }}>
                    {

                        chats.map((_chat, i) => {

                            return (
                                <div key={i}>
                                    <ListItem onClick={() => this.selectChat(i)}
                                        className={classes.listItem}
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
                                                <ListItemIcon><NotificationImportant className={classes.unreadMessage}></NotificationImportant></ListItemIcon> :
                                                null
                                        }
                                    </ListItem>
                                    <Divider></Divider>
                                </div>
                            )
                        })
                    }
                </List >
                <div className="new-message" onClick={this.newChat}>
                   <h6>Compose Message</h6>
                </div>

            </div >




        )


    }
}
export default withStyles(styles)(MessageList);


