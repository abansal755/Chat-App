import { useSnackbar } from "notistack";
import { useEffect } from "react";
import { useAuthContext } from "../contexts/AuthContext";

const NotificationsProvider = props => {
    const authCtx = useAuthContext();
    const { enqueueSnackbar } = useSnackbar();
    
    useEffect(() => {
		if(!authCtx.isLoggedIn) return;
        
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
	}, [authCtx.isLoggedIn]);

    return props.children;
}

export default NotificationsProvider;