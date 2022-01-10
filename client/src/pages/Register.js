import { Alert, Button, Container, Grid, Paper, TextField } from "@mui/material";
import { useState } from "react";
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
    const loginBtnClickHandler = () => {
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
                        <TextField variant='filled' label='Username' value={username} onInput={usernameInputHandler}/>
                        <TextField variant='filled' label='Password' value={password} onInput={passwordInputHandler} type='password' sx={{
                            my: 2
                        }}/>
                        <TextField variant='filled' label='Confirm Password' value={confirmPassword} onInput={confirmPasswordInputHandler} type='password' sx={{
                            mb: 2
                        }}/>
                        <Button variant="contained" component={Link} to='/login' sx={{
                            mb: 2
                        }}>
                            Already Registered? Click Here
                        </Button>
                        <Button variant="contained" onClick={loginBtnClickHandler}>Register</Button>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    )
}

export default Register;