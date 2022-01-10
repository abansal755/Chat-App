import { Box, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper } from '@mui/material';
import { ChevronLeft, Dashboard, Groups, Inbox } from '@mui/icons-material';
import { Link, useRouteMatch } from "react-router-dom";

const SidePanel = props => {
    return (
        <Drawer variant='permanent' sx={{
            '& .MuiDrawer-paper': {
                width: props.drawerWidth,
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                transition: '300ms'
            },
            '& .MuiList-padding': {
                pt: 0
            }
        }}>
            <Paper sx={{
                height: '100vh'
            }}>
                <List>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        pr: 1,
                        py: 1.5
                    }}>
                        <IconButton onClick={props.toggleIsDrawerOpen}>
                            <ChevronLeft sx={{
                                transform: `rotate(${props.isDrawerOpen ? 0 : 180}deg)`,
                                transition: '300ms'
                            }}/>
                        </IconButton>
                    </Box>
                    <Divider/>
                    <ListItem disablePadding>
                        <ListItemButton component={Link} to='/dashboard/home' selected={!!useRouteMatch('/dashboard/home')}>
                            <ListItemIcon>
                                <Dashboard/>
                            </ListItemIcon>
                            <ListItemText primary='Home'/>
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton component={Link} to='/dashboard/directmessages' selected={!!useRouteMatch('/dashboard/directmessages')}>
                            <ListItemIcon>
                                <Inbox/>
                            </ListItemIcon>
                            <ListItemText primary='Direct Messages'/>
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton component={Link} to='/dashboard/rooms' selected={!!useRouteMatch('/dashboard/rooms')}>
                            <ListItemIcon>
                                <Groups/>
                            </ListItemIcon>
                            <ListItemText primary='Rooms'/>
                        </ListItemButton>
                    </ListItem>
                </List>
            </Paper>
        </Drawer>
    )
}

export default SidePanel;