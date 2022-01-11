import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import { AuthContextProvider } from './contexts/AuthContext';
import { SnackbarProvider } from 'notistack';
import NotificationsProvider from './components/NotificationsProvider';

const theme = createTheme({
	palette: {
		mode: 'dark'
	}
})

ReactDOM.render(
	<React.StrictMode>
		<AuthContextProvider>
			<BrowserRouter>
				<ThemeProvider theme={theme}>
					<SnackbarProvider>
						<NotificationsProvider>
							<App />
						</NotificationsProvider>
					</SnackbarProvider>
				</ThemeProvider>
			</BrowserRouter>
		</AuthContextProvider>
	</React.StrictMode>,
	document.getElementById('root')
);