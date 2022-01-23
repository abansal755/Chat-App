import { Fragment, useEffect, useRef, useState } from "react";
import { AppBar, Box, Toolbar, Typography, useTheme } from '@mui/material';
import SidePanel from "./SidePanel";
import AccountSettingsButton from "./AccountSettingsButton";

const DRAWER_OPEN_WIDTH = 240;
const DRAWER_CLOSE_WIDTH = 55;

const Navbar = props => {
    const [isDrawerOpen,setIsDrawerOpen] = useState(true);
	const drawerWidth = isDrawerOpen ? DRAWER_OPEN_WIDTH : DRAWER_CLOSE_WIDTH;

    const toggleIsDrawerOpen = () => {
		setIsDrawerOpen(prev => !prev);
	}

	const appBarRef = useRef();
	const contentBoxRef = useRef();
	
	useEffect(() => {
		const height = appBarRef.current.clientHeight;
		contentBoxRef.current.style.height = `calc(100vh - ${height}px)`;
	}, []);

	const theme = useTheme();
	useEffect(() => {
		if(document.body.clientWidth < theme.breakpoints.values.md){
			setIsDrawerOpen(false);
		}
	}, []);

    return (
        <Fragment>
            <SidePanel isDrawerOpen={isDrawerOpen} drawerWidth={drawerWidth} toggleIsDrawerOpen={toggleIsDrawerOpen} />
			<AppBar position='sticky' sx={{
				width: `calc(100% - ${drawerWidth}px)`,
				ml: 'auto',
				transition: '300ms'
			}} ref={appBarRef}>
				<Toolbar>
					<Typography variant='h6' component='h1'>
						Chat-App
					</Typography>
					<AccountSettingsButton/>
				</Toolbar>
			</AppBar>
			<Box sx={{
				width: `calc(100% - ${drawerWidth}px)`,
				overflow: 'hidden',
				ml: 'auto',
                transition: '300ms'
			}} ref={contentBoxRef}>
				{props.children}
			</Box>
        </Fragment>
    )
}

export default Navbar;