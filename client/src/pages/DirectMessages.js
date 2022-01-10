import { Avatar, Divider, Grid, ListItem, ListItemAvatar, ListItemButton, ListItemText, Paper, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Link, Route, Switch, useRouteMatch } from "react-router-dom";
import Chat from "../components/Chat";
import useHttp from "../hooks/useHttp";
import Spinner from "../components/ui/Spinner";
import { useAuthContext } from "../contexts/AuthContext";

const DirectMessages = () => {
    const [directMessages,setDirectMessages] = useState([]);
    const http = useHttp();
    const match = useRouteMatch('/dashboard/directmessages/:id');

    useEffect(() => {
        http.sendRequest({
            url: '/api/directmessages'
        },
        data => setDirectMessages(data))
    }, [])

    const authCtx = useAuthContext();
    useEffect(() => {
        const createDM = res => {
            setDirectMessages(prev => [...prev, res]);
        }
        authCtx.socket.on('DirectMessages:CreateDM', createDM);
        return () => authCtx.socket.off('DirectMessages:CreateDM', createDM);
    }, []);

    return (
        <Grid container sx={{
            height: 'inherit',
        }}>
            <Grid item xs={4} sx={{
                height: 'inherit',
                overflow: 'auto'
            }}>
                <Stack  divider={<Divider orientation="horizontal"/>} sx={{
                    p: 0
                }}>
                    {(http.isComplete === false) && <Spinner/>}
                    {
                        directMessages.map(dm => (
                            <ListItem disablePadding key={dm.id}>
                                <ListItemButton
                                    selected={match && match.params.id === dm.id}
                                    component={Link}
                                    to={`/dashboard/directmessages/${dm.id}`}
                                >
                                    <ListItemAvatar>
                                        <Avatar>
                                            {dm.recipient.username[0].toUpperCase()}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary={dm.recipient.username} />
                                </ListItemButton>
                            </ListItem>
                        ))
                    }
                </Stack>
            </Grid>
            <Grid item xs sx={{
                height: 'inherit',
                overflow: 'hidden'
            }}>
                <Switch>
                    <Route path='/dashboard/directmessages/:id'>
                        <Chat/>
                    </Route>
                    <Route path='*'>
                        <Paper sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <Typography variant="h4" component='span'>
                                No conversation selected
                            </Typography>
                            <Typography variant="h4" component='span'>
                                Select a conversation and start messaging
                            </Typography>
                        </Paper>
                    </Route>
                </Switch>
            </Grid>
        </Grid>
    )
}

export default DirectMessages;