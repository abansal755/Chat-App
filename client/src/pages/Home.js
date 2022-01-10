import { Paper, Tab } from "@mui/material";
import { TabList, TabPanel, TabContext } from '@mui/lab';
import Friends from "../components/Friends";
import { useState } from "react";
import Requests from "../components/Requests";
import SendRequest from "../components/SendRequest";

const Home = () => {
    const [tabIdx,setTabIdx] = useState('0');

    const tabIdxChangeHandler = (e,newIdx) => {
        setTabIdx(newIdx);
    }

    return (
        <TabContext value={tabIdx}>
            <Paper sx={{
                borderRadius: 0
            }}>
                <TabList onChange={tabIdxChangeHandler} centered>
                    <Tab label='Friends' value='0' />
                    <Tab label='Requests' value='1' />
                    <Tab label='Add Friend' value='2' />
                </TabList>
            </Paper>
            <TabPanel value='0'>
                <Friends/>
            </TabPanel>
            <TabPanel value='1'>
                <Requests/>
            </TabPanel>
            <TabPanel value='2'>
                <SendRequest/>
            </TabPanel>
        </TabContext>
    )
}

export default Home;