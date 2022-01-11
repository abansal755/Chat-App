import { Paper, Typography } from "@mui/material";

const NoConversationSelected = () => {
    return (
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
    )
}

export default NoConversationSelected;