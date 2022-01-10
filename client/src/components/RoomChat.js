import { Send, ViewList } from "@mui/icons-material";
import { Avatar, CircularProgress, IconButton, Paper, TextField, Tooltip, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import useHttp from "../hooks/useHttp";
import RoomMessage from "./RoomMessage";
import RoomParticipantsDialog from "./RoomParticipantsDialog";
import Spinner from "./ui/Spinner";
import { cloneDeep } from 'lodash';

const RoomChat = () => {
    const [messages,setMessages] = useState([]);
    
    const [room,setRoom] = useState(null);
    const http = useHttp();
    const sendReqHandler = username => {
        http.sendRequest({
            url: '/api/requests',
            method: 'POST',
            data: {
                username
            }
        },
        () => {
            setRoom(prev => {
                const newRoom = cloneDeep(prev);
                newRoom.users.forEach(user => {
                    if(user.username === username) user.isRequestSent = true;
                })
                return newRoom;
            })
        })
    }

    const params = useParams();
    const httpMsg = useHttp();
    const authCtx = useAuthContext();

    const [chatMsg,setChatMsg] = useState('');
    const chatMsgInputHandler = e => setChatMsg(e.target.value);

    useEffect(() => {
        http.sendRequest({
            url: `/api/rooms/${params.id}`
        },
        data => setRoom(data));
        http.sendRequest({
            url: `/api/rooms/${params.id}/messages`
        },
        data => setMessages(data))
    }, [params.id])

    const messagesBoxRef = useRef();
    useEffect(() => {
        if(messagesBoxRef.current){
            const scrollHeight = messagesBoxRef.current.scrollHeight;
            const clientHeight = messagesBoxRef.current.clientHeight;
            messagesBoxRef.current.scrollTo(0,scrollHeight - clientHeight);
        }
    })

    const msgSubmitBtnClickHandler = () => {
        httpMsg.sendRequest({
            url: `/api/rooms/${params.id}/messages`,
            method: 'POST',
            data: {
                text: chatMsg
            }
        },
        data => {
            setMessages(prev => [
                ...prev,
                {
                    ...data,
                    sender: authCtx.user
                }
            ])
        })
        setChatMsg('');
    }

    useEffect(() => {
        const addMsg = res => {
            if(res.room.id === params.id)
                setMessages(prev => [...prev, res.message]);
        }
        authCtx.socket.on('Rooms:SendMessage', addMsg);
        return () => authCtx.socket.off('Rooms:SendMessage', addMsg);
    }, [params.id]);
    
    useEffect(() => {
        const rejectedReq = res => {
            setRoom(prev => {
                const newRoom = cloneDeep(prev);
                newRoom.users.forEach(user => {
                    if(res.id === user.id) user.isRequestSent = false;
                })
                return newRoom;
            })
        }
        authCtx.socket.on('Requests:RejectedRequest', rejectedReq);
        return () => authCtx.socket.off('Requests:RejectedRequest', rejectedReq);
    }, []);

    useEffect(() => {
        const addedUsers = res => {
            if(res.room.id === params.id){
                setRoom(prev => {
                    const newRoom = cloneDeep(prev);
                    newRoom.users = newRoom.users.concat(res.users);
                    return newRoom;
                })
            }
        }
        authCtx.socket.on('Rooms:AddedUsers_ToAllUsers', addedUsers);
        return () => authCtx.socket.off('Rooms:AddedUsers_ToAllUsers', addedUsers);
    }, [params.id])

    const [isParticipantsDialogOpen,setIsParticipantsDialogOpen] = useState(false);
    const showParticipantsDialogHandler = () => setIsParticipantsDialogOpen(true);
    const hideParticipantsDialogHandler = () => setIsParticipantsDialogOpen(false);

    const chatMsgKeyDownHandler = e => {
        if(e.code === 'Enter'){
            if(!e.shiftKey){
                if(chatMsg.trim().length > 0) msgSubmitBtnClickHandler();
                e.preventDefault();
            }
        }
    }

    return (
        <Box sx={{
            height: 'inherit',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <Paper elevation={20} sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                borderRadius: 0
            }}>
                <Avatar>
                    {room && room.title[0].toUpperCase()}
                </Avatar>
                <Box sx={{
                    ml: 2,
                    mr: 'auto'
                }}>
                    <Typography variant='h6' sx={{
                        mb: -1
                    }}>
                        {room && room.title}
                    </Typography>
                    <Typography variant="caption">
                        {room && room.users.map(user => user.username).join(', ')}
                    </Typography>
                </Box>
                <Tooltip title='View Participants'>
                    <IconButton onClick={showParticipantsDialogHandler}>
                        <ViewList/>
                    </IconButton>
                </Tooltip>
                {room && (
                    <RoomParticipantsDialog
                        id={params.id} 
                        onClose={hideParticipantsDialogHandler} 
                        open={isParticipantsDialogOpen} 
                        users={room.users}
                        adminId={room.admin}
                        sendReqHandler={sendReqHandler}
                    />
                )}
            </Paper>
            <Paper ref={messagesBoxRef} sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                overflow: 'auto',
                p: 1,
                pb: 0,
                height: '100%',
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0
            }}>
                {(http.isComplete === false) && <Spinner/>}
                {messages.map(msg => (
                    <RoomMessage
                        msg={msg}
                        key={msg.id}
                    />
                ))}
            </Paper>
            <Box sx={{
                display: 'flex',
                marginTop: 'auto',
                alignItems: 'center',
                py: 1,
                pr: 1
            }}>
                <TextField 
                    variant='filled' 
                    hiddenLabel 
                    multiline 
                    maxRows={4} 
                    placeholder="Type a message" 
                    value={chatMsg}
                    onInput={chatMsgInputHandler}
                    sx={{
                        flexGrow: 1,
                        marginRight: 2
                    }}
                    onKeyDown={chatMsgKeyDownHandler}
                />
                <IconButton onClick={msgSubmitBtnClickHandler} disabled={httpMsg.isComplete === false || chatMsg.trim().length === 0}>
                    <Send/>
                    {(httpMsg.isComplete === false) && (
                        <CircularProgress sx={{
                            position: 'absolute'
                        }}/>
                    )}
                </IconButton>
            </Box>
        </Box>
    )
}

export default RoomChat;