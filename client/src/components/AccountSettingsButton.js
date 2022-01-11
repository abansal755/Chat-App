import { Logout } from "@mui/icons-material";
import { Avatar, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Tooltip } from "@mui/material";
import { Fragment, useEffect, useRef, useState } from "react";
import { useAuthContext } from "../contexts/AuthContext";

const AccountSettingsButton = () => {
    const [anchorEl,setAnchorEl] = useState(null);
    const iconBtnRef = useRef();

    const [isMenuOpen,setIsMenuOpen] = useState(false);
    const toggleMenuIsOpen = () => {
        setIsMenuOpen(prev => !prev);
    }

    useEffect(() => {
        setAnchorEl(iconBtnRef.current);
    }, [])

    const authCtx = useAuthContext();

    const logoutBtnClickHandler = () => {
        authCtx.logOut();
    }

    return (
        <Fragment>
            <Tooltip title='Account'>
                <IconButton sx={{
                    ml: 'auto'
                }} ref={iconBtnRef} onClick={toggleMenuIsOpen}>
                    <Avatar>
                        {authCtx.user.username[0].toUpperCase()}
                    </Avatar>
                </IconButton>
            </Tooltip>
            <Menu open={isMenuOpen} anchorEl={anchorEl} onClose={toggleMenuIsOpen}>
                <MenuItem onClick={logoutBtnClickHandler}>
                    <ListItemIcon>
                        <Logout/>
                    </ListItemIcon>
                    <ListItemText>
                        Logout
                    </ListItemText>
                </MenuItem>
            </Menu>
        </Fragment>
    )
}

export default AccountSettingsButton;