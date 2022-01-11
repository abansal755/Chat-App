import { Close, Done } from "@mui/icons-material";
import { Avatar, Divider, IconButton, ListItem, ListItemIcon, ListItemText, Stack, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { useAuthContext } from "../contexts/AuthContext";
import useHttp from "../hooks/useHttp";
import Spinner from "./ui/Spinner";

const Requests = () => {
    const [requests,setRequests] = useState([]);
    const http = useHttp();
    const httpRespond = useHttp();

    useEffect(() => {
        http.sendRequest({
            url: '/api/requests'
        },
        data => setRequests(data));
    }, [])

    const respondHandler = (id,accept) => {
        httpRespond.sendRequest({
            url: `/api/requests/${id}/respond`,
            method: 'POST',
            data: {
                accept
            }
        },
        () => {
            setRequests(prev => prev.filter(request => request.id !== id));
        })
    }

    const authCtx = useAuthContext();
    useEffect(() => {
        const sendReq = res => {
            setRequests(prev => [...prev, res]);
        }
        authCtx.socket.on('Requests:SendRequest', sendReq);
        return () => authCtx.socket.off('Requests:SendRequest', sendReq);
    }, [])

    return (
        <Stack divider={<Divider orientation="horizontal" />}>
            {(http.isComplete === false) && <Spinner/>}
            {
                requests.map(request => (
                    <ListItem key={request.id}>
                        <ListItemIcon>
                            <Avatar>
                                {request.username[0].toUpperCase()}
                            </Avatar>
                        </ListItemIcon>
                        <ListItemText primary={request.username} />
                        <Tooltip title='Accept' placement="left">
                            <IconButton onClick={() => respondHandler(request.id,true)}>
                                <Done/>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title='Reject' placement="right">
                            <IconButton onClick={() => respondHandler(request.id,false)}>
                                <Close/>
                            </IconButton>
                        </Tooltip>
                    </ListItem>
                ))
            }
        </Stack>
    )
}

export default Requests;