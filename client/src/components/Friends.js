import { Message } from "@mui/icons-material";
import { Avatar, Divider, IconButton, ListItem, ListItemAvatar, ListItemText, Stack, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import useHttp from "../hooks/useHttp";
import { useHistory } from 'react-router-dom';
import Spinner from "./ui/Spinner";
import { useAuthContext } from "../contexts/AuthContext";

const Friends = () => {
    const [friends,setFriends] = useState([]);
    const http = useHttp();
    const httpDM = useHttp();
    const history = useHistory();

    useEffect(() => {
        http.sendRequest({
            url: '/api/friends'
        },
        data => setFriends(data))
    }, [])

    const msgBtnClickHandler = id => {
        httpDM.sendRequest({
            url: '/api/directmessages',
            method: 'POST',
            data: {
                recipient: id
            }
        },
        data => {
            history.push(`/directmessages/${data.id}`);
        })
    }

    const authCtx = useAuthContext();
    useEffect(() => {
        const acceptedReq = res => {
            setFriends(prev => [...prev,res]);
        }
        
        authCtx.socket.on('Requests:AcceptedRequest', acceptedReq);
        return () => authCtx.socket.off('Requests:AcceptedRequest', acceptedReq);
    }, [])

    return (
        <Stack divider={<Divider orientation="horizontal" />}>
            {(http.isComplete === false) && <Spinner/>}
            {
                friends.map(friend => (
                    <ListItem key={friend.id}>
                        <ListItemAvatar>
                            <Avatar>
                                {friend.username[0].toUpperCase()}
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={friend.username} />
                        <Tooltip title='Send Message' placement="left">
                            <IconButton onClick={() => msgBtnClickHandler(friend.id)}>
                                <Message/>
                            </IconButton>
                        </Tooltip>
                    </ListItem>
                ))
            }
        </Stack>
    )
}

export default Friends;