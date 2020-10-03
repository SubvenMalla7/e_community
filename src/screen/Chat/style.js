const styles = theme => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        height: 'calc(90% - 70px)',
        marginTop: theme.spacing(2),
        marginLeft: theme.spacing(2),
        position: 'absolute',
        left: '0',
        width: '300px',
        boxShadow: '0px 0px 2px black'
    },
    listItem: {
        cursor: 'pointer'
    },
    newChatBtn: {
        borderRadius: '0px'
    },
    unreadMessage: {
        color: 'red',
        position: 'absolute',
        top: '0',
        right: '5px'
    }
});

export default styles;