import { Send } from "@mui/icons-material"
import { Box, CircularProgress, IconButton, TextField } from "@mui/material";
import { useState } from "react";

const MessageField = props => {
    const [chatMsg,setChatMsg] = useState('');
    const chatMsgInputHandler = e => setChatMsg(e.target.value);

    const chatMsgKeyDownHandler = e => {
        if(e.code === 'Enter'){
            if(!e.shiftKey){
                if(chatMsg.trim().length > 0) msgSubmitBtnClickHandler();
                e.preventDefault();
            }
        }
    }

    const msgSubmitBtnClickHandler = () => {
        props.onSubmit(chatMsg);
        setChatMsg('');
    }

    return (
        <Box sx={{
            display: 'flex',
            marginTop: 'auto',
            alignItems: 'center',
            py: 1,
            pr: 1,
            pl: {
                xs: 1,
                md: 0
            }
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
            <IconButton onClick={msgSubmitBtnClickHandler} disabled={props.isLoading || chatMsg.trim().length === 0}>
                <Send/>
                {props.isLoading && (
                    <CircularProgress sx={{
                        position: 'absolute'
                    }}/>
                )}
            </IconButton>
        </Box>
    )
}

export default MessageField;