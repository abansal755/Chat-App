import { Alert, Button, Container, Grid, Paper, TextField } from "@mui/material";
import { useRef, useState } from "react";
import { useAuthContext } from "../contexts/AuthContext";
import { Link } from 'react-router-dom';

const Register = () => {
    const [username,setUsername] = useState('');
    const usernameInputHandler = e => setUsername(e.target.value);

    const [password,setPassword] = useState('');
    const passwordInputHandler = e => setPassword(e.target.value);

    const [confirmPassword,setConfirmPassword] = useState('');
    const confirmPasswordInputHandler = e => setConfirmPassword(e.target.value);

    const authCtx = useAuthContext();
    const registerBtnClickHandler = () => {
        if(username.trim().length > 0 && password.trim().length > 0 && password === confirmPassword){
            authCtx.register(username, password, data => {
                setIsAlertVisible(true);
                setAlertText(data.error.message);
            });
            return;
        }
        setIsAlertVisible(true);
        if(username.trim().length === 0) setAlertText('Username cannot be empty');
        else if(password.trim().length === 0) setAlertText('Password cannot be empty');
        else setAlertText('Passwords are not matching');
    }

    const [isAlertVisible,setIsAlertVisible] = useState(false);
    const [alertText,setAlertText] = useState('');

    const usernameInputRef = useRef();
    const passwordInputRef = useRef();
    const confirmPasswordInputRef = useRef();
    const usernameInputKeyDownHandler = e => {
        if(e.key === 'Enter') passwordInputRef.current.focus();
    }
    const passwordInputKeyDownHandler = e => {
        if(e.key === 'Enter') confirmPasswordInputRef.current.focus();
    }
    const confirmPasswordInputKeyDownHandler = e => {
        if(e.key === 'Enter') registerBtnClickHandler();
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
                        <TextField 
                            variant='filled' 
                            label='Confirm Password' 
                            value={confirmPassword} 
                            onInput={confirmPasswordInputHandler} 
                            onKeyDown={confirmPasswordInputKeyDownHandler} 
                            inputRef={confirmPasswordInputRef} 
                            type='password' 
                            sx={{
                                mb: 2
                            }}
                        />
                        <Button variant="contained" onClick={registerBtnClickHandler} sx={{
                            mb: 2
                        }}>
                            Register
                        </Button>
                        <Button variant="contained" component={Link} to='/login' color="secondary">
                            Already Registered? Click Here
                        </Button>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    )
}

export default Register;