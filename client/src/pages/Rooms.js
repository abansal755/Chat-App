import { Add } from "@mui/icons-material";
import { Avatar, Divider, Grid, ListItem, ListItemAvatar, ListItemButton, ListItemIcon, ListItemText, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { Link, Route, Switch, useRouteMatch } from 'react-router-dom';
import NewRoomDialog from "../components/NewRoomDialog";
import NoConversationSelected from "../components/NoConversationSelected";
import RoomChat from "../components/RoomChat";
import Spinner from "../components/ui/Spinner";
import { useAuthContext } from "../contexts/AuthContext";
import useHttp from "../hooks/useHttp";

const Rooms = () => {
    const [rooms,setRooms] = useState([]);
    const http = useHttp();
    const match = useRouteMatch('/rooms/:id');

    useEffect(() => {
        http.sendRequest({
            url: '/api/rooms'
        },
        data => setRooms(data));
    }, []);

    const [isNewRoomDialogOpen,setIsNewRoomDialogOpen] = useState(false);
    const openRoomDialog = () => setIsNewRoomDialogOpen(true);
    const closeRoomDialog = () => setIsNewRoomDialogOpen(false);

    const createRoomBtnClickHandler = (room) => {
        http.sendRequest({
            url: '/api/rooms',
            method: 'POST',
            data: room
        },
        data => setRooms(prev => [...prev, data]));
    }

    const authCtx = useAuthContext();
    useEffect(() => {
        const createRoom = res => {
            setRooms(prev => [...prev, res]);
        }
        authCtx.socket.on('Rooms:CreateRoom', createRoom);
        return () => authCtx.socket.off('Rooms:CreateRoom', createRoom);
    }, []);

    useEffect(() => {
        const addedUsers = res => {
            setRooms(prev => [...prev,res.room]);
        }
        authCtx.socket.on('Rooms:AddedUsers_ToNewUsers', addedUsers);
        return () => authCtx.socket.off('Rooms:AddedUsers_ToNewUsers', addedUsers);
    })

    return (
        <Grid container sx={{
            height: 'inherit'
        }}>
            <Grid item xs={4} sx={{
                height: 'inherit',
                overflow: 'hidden'
            }}>
                <Stack divider={<Divider orientation="horizontal"/>} sx={{
                    p: 0
                }}>
                    <ListItem disablePadding>
                        <ListItemButton onClick={openRoomDialog}>
                            <ListItemIcon>
                                <Avatar>
                                    <Add/>
                                </Avatar>
                            </ListItemIcon>
                            <ListItemText primary='New Room' />
                        </ListItemButton>
                    </ListItem>
                    <NewRoomDialog openRoomDialog={openRoomDialog} onClose={closeRoomDialog} createRoomBtnClickHandler={createRoomBtnClickHandler} isNewRoomDialogOpen={isNewRoomDialogOpen}/>
                    {(http.isComplete === false) && <Spinner/>}
                    {
                        rooms.map((room,idx) => (
                            <ListItem disablePadding key={room.id}>
                                <ListItemButton 
                                    selected={match && match.params.id === room.id} 
                                    component={Link}
                                    to={`/rooms/${room.id}`}
                                >
                                    <ListItemAvatar>
                                        <Avatar>
                                            {room.title[0].toUpperCase()}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary={room.title} />
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
                    <Route path='/rooms/:id'>
                        <RoomChat/>
                    </Route>
                    <Route path='*'>
                        <NoConversationSelected/>
                    </Route>
                </Switch>
            </Grid>
        </Grid>
    )
}

export default Rooms;