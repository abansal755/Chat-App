import { Alert, Button, Container, Grid, Paper, TextField } from "@mui/material";
import { useRef, useState } from "react";
import { useAuthContext } from "../contexts/AuthContext";
import { Link } from 'react-router-dom';

const Login = () => {
    const [username,setUsername] = useState('');
    const usernameInputHandler = e => setUsername(e.target.value);

    const [password,setPassword] = useState('');
    const passwordInputHandler = e => setPassword(e.target.value);

    const authCtx = useAuthContext();
    const loginBtnClickHandler = () => {
        if(username.trim().length > 0 && password.trim().length > 0){
            authCtx.logIn(username, password, data => {
                setIsAlertVisible(true);
                setAlertText(data.error.message);
            });
            return;
        }
        setIsAlertVisible(true);
        if(username.trim().length === 0) setAlertText('Username cannot be empty');
        else setAlertText('Password cannot be empty');
    }

    const [isAlertVisible,setIsAlertVisible] = useState(false);
    const [alertText,setAlertText] = useState('');

    const usernameInputRef = useRef();
    const passwordInputRef = useRef();
    const usernameInputKeyDownHandler = e => {
        if(e.key === 'Enter') passwordInputRef.current.focus();
    }
    const passwordInputKeyDownHandler = e => {
        if(e.key === 'Enter') loginBtnClickHandler();
    }

    return (
        <Container fixed sx={{
            width: '100vw',
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column'
        }}>
            <Grid container>
                <Grid item xs={12} sm={8} md={6} lg={4} sx={{
                    mx: 'auto'
                }}>
                    {isAlertVisible && (
                        <Alert severity="error" sx={{
                            mb: 2
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
                            variant='filled' 
                            label='Username' 
                            value={username} 
                            onInput={usernameInputHandler} 
                            onKeyDown={usernameInputKeyDownHandler} 
                            inputRef={usernameInputRef}
                        />
                        <TextField 
                            variant='filled' 
                            label='Password' 
                            value={password} 
                            onInput={passwordInputHandler} 
                            onKeyDown={passwordInputKeyDownHandler} 
                            type='password' 
                            inputRef={passwordInputRef} 
                            sx={{
                                my: 2
                            }}
                        />
                        <Button variant="contained" onClick={loginBtnClickHandler} sx={{
                            mb: 2
                        }}>
                            Login
                        </Button>
                        <Button variant="contained" component={Link} to='/register' color="secondary">
                            Not Registered? Click Here
                        </Button>                        
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    )
}

export default Login;