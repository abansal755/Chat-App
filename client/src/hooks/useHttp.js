import axios from 'axios';
import { useState } from 'react';

const useHttp = () => {
    const [isComplete,setIsComplete] = useState(null);
    const [error,setError] = useState(null);

    const sendRequest = async (reqConfig,respondFn,notOkRespondFn) => {
        setIsComplete(false);
        setError(null);
        try {
            const res = await axios(reqConfig);
            setIsComplete(true);
            if(respondFn) respondFn(res.data);
        }
        catch(err) {
            setIsComplete(true);
            if(err.response){
                if(notOkRespondFn) notOkRespondFn(err.response.data);
            }
            else setError(err.message || 'Something went wrong');
        }
    }

    return {
        isComplete,
        error,
        sendRequest
    }
}

export default useHttp;