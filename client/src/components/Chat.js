import { Send } from "@mui/icons-material";
import { IconButton, TextField, Paper, Avatar, Typography, CircularProgress } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useRef, useState } from "react";
import Message from "./Message";
import { useParams } from 'react-router-dom';
import useHttp from "../hooks/useHttp";
import { useAuthContext } from '../contexts/AuthContext';
import Spinner from './ui/Spinner';
import MessageField from "./MessageField";

const Chat = () => {
    const [messages,setMessages] = useState([]);
    const [recipient,setRecipient] = useState(null);
    const params = useParams();
    const http = useHttp();
    const httpMsg = useHttp();

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

    const msgSubmitBtnClickHandler = chatMsg => {
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
    }

    useEffect(() => {
        const addMsg = res => {
            if(res.directMessageId === params.id)
                setMessages(prev => [...prev, res.message]);
        }
        authCtx.socket.on('DirectMessages:SendMessage', addMsg);
        return () => authCtx.socket.off('DirectMessages:SendMessage', addMsg);
    }, [params.id]);

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
            <MessageField
                isLoading={httpMsg.isComplete === false}
                onSubmit={msgSubmitBtnClickHandler}
            />
        </Box>
    )
}

export default Chat;