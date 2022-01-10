import { Avatar, Box, Paper, Typography } from "@mui/material";
import { useAuthContext } from "../contexts/AuthContext";

const RoomMessage = props => {
    const date = new Date(props.msg.timestamp);
    const authCtx = useAuthContext();
    const self = props.msg.sender.id === authCtx.user.id;
    
    return (
        <Box sx={{
            mb: 2,
            alignSelf: self ? 'flex-end' : 'flex-start',
            display: 'flex',
            flexDirection: 'column',
            alignItems: self ? 'flex-end' : 'flex-start'
        }}>
            <Paper elevation={4} sx={{
                p: 1,
                whiteSpace: 'pre-wrap',
                overflowWrap: 'anywhere',
                bgcolor: self ? 'info.dark' : ''
            }}>
                {!self && (
                    <Typography variant="body2" sx={{
                        color: 'info.main'
                    }}>
                        {props.msg.sender.username}
                    </Typography>
                )}
                <Typography>
                    {props.msg.text}
                </Typography>
            </Paper>
            <Typography variant="caption" sx={{
                mt: 0.5,
                color: 'grey.300'
            }}>
                {date.toLocaleString()}
            </Typography>
        </Box>
    )
}

export default RoomMessage;