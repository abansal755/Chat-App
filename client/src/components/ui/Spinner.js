import { Box, CircularProgress } from "@mui/material"

const Spinner = () => {
    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            pt: 2,
            width: '100%'
        }}>
            <CircularProgress/>
        </Box>
    )
}

export default Spinner;