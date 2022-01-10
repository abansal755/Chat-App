import { Close } from "@mui/icons-material";
import { Alert, Avatar, Button, Checkbox, Dialog, DialogContent, DialogTitle, FormControlLabel, IconButton, List, ListItem, ListItemAvatar, ListItemText, TextField } from "@mui/material";
import { cloneDeep } from "lodash";
import { useEffect, useState } from "react";
import useHttp from "../hooks/useHttp";

const NewRoomDialog = (props, ref) => {
    const [title,setTitle] = useState('');
    const titleInputHandler = e => setTitle(e.target.value);

    const [friends,setFriends] = useState([]);
    const http = useHttp();
    useEffect(() => {
        if(!props.isNewRoomDialogOpen) return;
        http.sendRequest({
            url: '/api/friends'
        },
        data => {
            data.forEach(user => user.isSelected = false);
            setFriends(data);
        });
    }, [props.isNewRoomDialogOpen]);
    const friendIsSelectedChangeHandler = id => {
        setFriends(prev => {
            const newFriends = cloneDeep(prev);
            newFriends.forEach(friend => {
                if(friend.id === id) friend.isSelected = !friend.isSelected;
            })
            return newFriends;
        })
    }

    const resetState = () => {
        setTitle('');
        setIsAlertVisible(false);
        setAlertText('');
    }

    const createGroupBtnClickHandler = () => {
        if(title.trim().length === 0){
            setIsAlertVisible(true);
            setAlertText('Title cannot be empty');
            return;
        }
        props.createRoomBtnClickHandler({
            title,
            users: friends.filter(friend => friend.isSelected).map(friend => friend.id)
        });
        props.onClose();
        resetState();
    }

    const [isAlertVisible,setIsAlertVisible] = useState(false);
    const [alertText,setAlertText] = useState('');

    const dialogCloseHandler = () => {
        props.onClose();
        resetState();
    }

    return (
        <Dialog open={props.isNewRoomDialogOpen} onClose={dialogCloseHandler} sx={{
            '& .MuiPaper-root': {
                width: '400px'
            }
        }}>
            <DialogTitle sx={{
                display: 'flex',
                justifyContent: 'space-between'
            }}>
                New Room
                <IconButton onClick={dialogCloseHandler}>
                    <Close/>
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{
                display: 'flex',
                flexDirection: 'column'
            }}>
                {isAlertVisible && (
                    <Alert severity="error" sx={{
                        width: '100% !important',
                        mb: 2
                    }}>
                        {alertText}
                    </Alert>
                )}
                <TextField variant='filled' label='Title' value={title} onInput={titleInputHandler} fullWidth/>
                <List>
                    {
                        friends.map(friend => (
                            <ListItem key={friend.id}>
                                <ListItemAvatar>
                                    <Avatar>
                                        {friend.username[0].toUpperCase()}
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText>
                                    {friend.username}
                                </ListItemText>
                                <Checkbox checked={friend.isSelected} onChange={() => friendIsSelectedChangeHandler(friend.id)}/>
                            </ListItem>
                        ))
                    }
                </List>
                <Button variant="contained" onClick={createGroupBtnClickHandler}>
                    Create Group
                </Button>
            </DialogContent>
        </Dialog>
    )
}

export default NewRoomDialog;