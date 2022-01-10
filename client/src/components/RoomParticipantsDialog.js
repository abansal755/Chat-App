import { Close, PersonAdd } from '@mui/icons-material';
import { Avatar, Button, Checkbox, Dialog, DialogContent, DialogTitle, IconButton, List, ListItem, ListItemAvatar, ListItemText, Tooltip } from '@mui/material';
import { cloneDeep } from 'lodash';
import { Fragment, useEffect, useState } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import useHttp from '../hooks/useHttp';
import Spinner from './ui/Spinner';

const RoomParticipantsDialog = props => {
    const [isAddingParticipants,setIsAddingParticipants] = useState(false);
    const toggleIsAddingParticipants = () => setIsAddingParticipants(prev => !prev);

    const dialogCloseHandler = () => {
        props.onClose();
        setIsAddingParticipants(false);
    }

    const authCtx = useAuthContext();
    const http = useHttp();
    const httpAddUsers = useHttp();
    const [friends,setFriends] = useState([]);
    useEffect(() => {
        if(!props.open || !isAddingParticipants) return;
        http.sendRequest({
            url: '/api/friends'
        },
        data => {
            const inRoom = new Set();
            props.users.forEach(user => inRoom.add(user.id))
            data.forEach(friend => {
                if(inRoom.has(friend.id)){
                    friend.isInRoom = true;
                    friend.isSelected = true;
                }
                else{
                    friend.isInRoom = false;
                    friend.isSelected = false;
                }
            });
            setFriends(data);
        });
    }, [props.open, isAddingParticipants]);

    const addBtnClickHandler = () => {
        httpAddUsers.sendRequest({
            url: `/api/rooms/${props.id}/users`,
            method: 'PATCH',
            data: {
                users: friends.filter(friend => friend.isSelected && !friend.isInRoom).map(user => user.id)
            }
        },
        () => dialogCloseHandler());
    }

    const friendIsSelectedChangeHandler = id => {
        setFriends(prev => {
            const newFriends = cloneDeep(prev);
            newFriends.forEach(friend => {
                if(friend.id === id) friend.isSelected = !friend.isSelected;
            })
            return newFriends;
        })
    }

    return (
        <Dialog open={props.open} onClose={dialogCloseHandler} sx={{
            '& .MuiPaper-root': {
                width: '400px'
            }
        }}>
            <DialogTitle sx={{
                display: 'flex',
                justifyContent: 'space-between'
            }}>
                Room Participants
                <IconButton onClick={dialogCloseHandler}>
                    <Close/>
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{
                display: 'flex',
                flexDirection: 'column'
            }}>
                {!isAddingParticipants && (
                    <Fragment>
                        <List>
                            {
                                props.users.map(user => (
                                    <ListItem key={user.id}>
                                        <ListItemAvatar>
                                            <Avatar>
                                                {user.username[0].toUpperCase()}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText primary={user.username} secondary={(props.adminId === user.id) && 'admin'}/>
                                        {user.isFriend !== undefined && (
                                            <Tooltip title='Send friend request'>
                                                <span>
                                                    <IconButton disabled={user.isFriend || user.isRequestSent} onClick={() => props.sendReqHandler(user.username)}>
                                                        <PersonAdd/>
                                                    </IconButton>
                                                </span>
                                            </Tooltip>
                                        )}
                                    </ListItem>
                                ))
                            }
                        </List>
                        {props.adminId === authCtx.user.id && (
                            <Button variant='contained' onClick={toggleIsAddingParticipants}>Add Participants</Button>
                        )}
                    </Fragment>
                )}
                {isAddingParticipants && (
                    <Fragment>
                        <List>
                            {http.isComplete === false && <Spinner/>}
                            {
                                friends.map(friend => (
                                    <ListItem key={friend.id}>
                                        <ListItemAvatar>
                                            <Avatar>
                                                {friend.username[0].toUpperCase()}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText primary={friend.username} secondary={friend.isInRoom && 'Already in room'}/>
                                        <Checkbox checked={friend.isSelected} disabled={friend.isInRoom} onChange={() => friendIsSelectedChangeHandler(friend.id)}/>
                                    </ListItem>
                                ))
                            }
                        </List>
                        <Button variant='contained' onClick={addBtnClickHandler} sx={{
                            mb: 1
                        }}>
                            Add
                        </Button>
                        <Button variant='contained' onClick={toggleIsAddingParticipants}>Cancel</Button>
                    </Fragment>
                )}
            </DialogContent>
        </Dialog>
    )
}

export default RoomParticipantsDialog;