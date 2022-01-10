import { Alert, Button, Container, Grid, Paper, TextField } from "@mui/material";
import { useState } from "react";
import useHttp from '../hooks/useHttp';

const SendRequest = () => {
    const [username,setUsername] = useState('');
    const usernameInputHandler = e => setUsername(e.target.value);
    const http = useHttp();

    const sendReqBtnClickHandler = () => {
        if(username.trim().length === 0){
            setIsAlertVisible(true);
            setAlertSeverity('error');
            setAlertText('Username cannot be empty');
            return;
        }
        http.sendRequest({
            url: '/api/requests',
            method: 'POST',
            data: {
                username
            }
        },
        () => {
            setIsAlertVisible(true);
            setAlertSeverity('success');
            setAlertText('Request successfully sent');
        },
        data => {
            setIsAlertVisible(true);
            setAlertSeverity('error');
            setAlertText(data.error.message);
        })
        setUsername('');
    }

    const [isAlertVisible,setIsAlertVisible] = useState(false);
    const [alertSeverity,setAlertSeverity] = useState('');
    const [alertText,setAlertText] = useState('');

    return (
        <Container fixed>
            <Grid container>
                <Grid item sx={{
                    mx: 'auto'
                }}>
                    {isAlertVisible && (
                        <Alert severity={alertSeverity} sx={{
                            mb: 1
                        }}>
                            {alertText}
                        </Alert>
                    )}
                    <Paper sx={{
                        p: 3,
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <TextField 
                            label='Username' 
                            variant='filled' 
                            value={username} 
                            onInput={usernameInputHandler}
                            sx={{
                                mb: 2
                            }}
                        />
                        <Button variant='contained' onClick={sendReqBtnClickHandler}>Send Request</Button>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    )
}

export default SendRequest;