import { Fragment, useEffect, useRef, useState } from "react";
import { AppBar, Box, Toolbar, Typography } from '@mui/material';
import SidePanel from "./SidePanel";
import AccountSettingsButton from "./AccountSettingsButton";
import { useAuthContext } from "../contexts/AuthContext";
import { useSnackbar } from "notistack";

const DRAWER_OPEN_WIDTH = 240;
const DRAWER_CLOSE_WIDTH = 55;

const Navbar = props => {
    const [isDrawerOpen,setIsDrawerOpen] = useState(true);
	const drawerWidth = isDrawerOpen ? DRAWER_OPEN_WIDTH : DRAWER_CLOSE_WIDTH;

    const toggleIsDrawerOpen = () => {
		setIsDrawerOpen(prev => !prev);
	}

	const appBarRef = useRef();
	const contentBoxRef = useRef();
	
	useEffect(() => {
		const height = appBarRef.current.clientHeight;
		contentBoxRef.current.style.height = `calc(100vh - ${height}px)`;
	}, [])

	const authCtx = useAuthContext();
	const {enqueueSnackbar} = useSnackbar();
	useEffect(() => {
		const addMsg = res => {
			enqueueSnackbar(`Received a message from ${res.message.sender.username}`, {
				variant: 'info'
			})
		}
		authCtx.socket.on('DirectMessages:SendMessage', addMsg);

		const sendReq = res => {
            enqueueSnackbar(`Received a friend request from ${res.username}`, {
				variant: 'info'
			});
        }
        authCtx.socket.on('Requests:SendRequest', sendReq);

		const acceptedReq = res => {
			enqueueSnackbar(`${res.username} accepted your friend request`, {
				variant: 'success'
			});
		}
		authCtx.socket.on('Requests:AcceptedRequest', acceptedReq);

		const addRoomMsg = res => {
			enqueueSnackbar(`You received a message in ${res.room.title}`, {
				variant: 'info'
			});
		}
		authCtx.socket.on('Rooms:SendMessage', addRoomMsg);

		const createRoom = res => {
			enqueueSnackbar(`You have been added to the group ${res.title}`, {
				variant: 'info'
			});
		}
		authCtx.socket.on('Rooms:CreateRoom', createRoom);

		const addedUserToRoom = res => {
			enqueueSnackbar(`You have been added to the group ${res.room.title}`, {
				variant: 'info'
			});
		}
		authCtx.socket.on('Rooms:AddedUsers_ToNewUsers', addedUserToRoom);

		return () => {
			authCtx.socket.off('DirectMessages:SendMessage', addMsg);
			authCtx.socket.off('Requests:SendRequest', sendReq);
			authCtx.socket.off('Requests:AcceptedRequest', acceptedReq);
			authCtx.socket.off('Rooms:SendMessage', addRoomMsg);
			authCtx.socket.off('Rooms:CreateRoom', createRoom);
			authCtx.socket.on('Rooms:AddedUsers_ToNewUsers', addedUserToRoom);
		}
	}, []);

    return (
        <Fragment>
            <SidePanel isDrawerOpen={isDrawerOpen} drawerWidth={drawerWidth} toggleIsDrawerOpen={toggleIsDrawerOpen} />
			<AppBar position='sticky' sx={{
				width: `calc(100% - ${drawerWidth}px)`,
				ml: 'auto',
				transition: '300ms'
			}} ref={appBarRef}>
				<Toolbar>
					<Typography variant='h6' component='h1'>
						Chat-App
					</Typography>
					<AccountSettingsButton/>
				</Toolbar>
			</AppBar>
			<Box sx={{
				width: `calc(100% - ${drawerWidth}px)`,
				overflow: 'hidden',
				ml: 'auto',
                transition: '300ms'
			}} ref={contentBoxRef}>
				{props.children}
			</Box>
        </Fragment>
    )
}

export default Navbar;