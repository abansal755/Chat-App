import { createContext, useContext, useEffect, useState } from "react";
import useHttp from '../hooks/useHttp';
import { io } from 'socket.io-client';

const AuthContext = createContext({
    user: {},
    isLoggedIn: false,
    login: (username, password) => {},
    logOut: () => {},
    register: () => {},
    socket: {}
})

export const useAuthContext = () => {
    return useContext(AuthContext);
}

export const AuthContextProvider = props => {
    const [user,setUser] = useState(null);
    const [socket,setSocket] = useState(null);
    const isLoggedIn = !!user;
    const http = useHttp();

    useEffect(() => {
        http.sendRequest({
            url: '/api/users'
        },
        data => {
            setUser(data);
        });
        setSocket(io());
    }, [])

    const logIn = (username, password, notOkRespondFn) => {
        http.sendRequest({
            url: '/api/users/login',
            method: 'POST',
            data: {
                username,
                password
            }
        },
        data => {
            setUser(data);
            socket.connect();
        },
        data => {
            if(notOkRespondFn) notOkRespondFn(data);
        })
    }

    const logOut = () => {
        http.sendRequest({
            url: '/api/users/logout',
            method: 'POST'
        },
        () => {
            setUser(null);
            socket.disconnect();
        })
    }

    const register = (username, password, notOkRespondFn) => {
        http.sendRequest({
            url: '/api/users',
            method: 'POST',
            data: {
                username,
                password
            }
        },
        data => {
            setUser(data);
            socket.connect();
        },
        data => {
            if(notOkRespondFn) notOkRespondFn(data);
        })
    }

    return (
        <AuthContext.Provider value={{
            user,
            isLoggedIn,
            logIn,
            logOut,
            register,
            socket
        }}>
            {props.children}
        </AuthContext.Provider>
    )
}