import axios from 'axios';
import { useEffect, useState } from 'react';
import { BACKEND_URL } from '../config';
import type { Content } from '../interface/Content';

export default function useContent() {
    const [contents, setContents] = useState<Content[]>([]);
    function refresh() {
        // setContents([]);
        axios.get(`${BACKEND_URL}/api/v1/content`,{withCredentials:true} 
            ).then((response) => {
            setContents(response.data.content);
        })
    }
    useEffect(() => {
        refresh();
    }, [])
    return { contents, refresh, setContents };;
}