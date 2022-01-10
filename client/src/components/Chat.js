import { Send } from "@mui/icons-material";
import { IconButton, TextField, Paper, Avatar, Typography, CircularProgress } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useRef, useState } from "react";
import Message from "./Message";
import { useParams } from 'react-router-dom';
import useHttp from "../hooks/useHttp";
import { useAuthContext } from '../contexts/AuthContext';
import Spinner from './ui/Spinner';

const Chat = () => {
    const [messages,setMessages] = useState([]);
    const [recipient,setRecipient] = useState(null);
    const params = useParams();
    const http = useHttp();
    const httpMsg = useHttp();
    
    const [chatMsg,setChatMsg] = useState('');
    const chatMsgInputHandler = e => setChatMsg(e.target.value);

    const authCtx = useAuthContext();

    useEffect(() => {
        http.sendRequest({
            url: `/api/directmessages/${params.id}`
        },
        data => {
            setMessages(data.messages);
            setRecipient(data.recipient);
        })
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
            url: `/api/directmessages/${params.id}`,
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
            if(res.directMessageId === params.id)
                setMessages(prev => [...prev, res.message]);
        }
        authCtx.socket.on('DirectMessages:SendMessage', addMsg);
        return () => authCtx.socket.off('DirectMessages:SendMessage', addMsg);
    }, [params.id]);

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
                    {recipient && recipient.username[0].toUpperCase()}
                </Avatar>
                <Typography variant="h6" sx={{
                    ml: 2
                }}>
                    {recipient && recipient.username}
                </Typography>
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
                    <Message 
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

export default Chat;