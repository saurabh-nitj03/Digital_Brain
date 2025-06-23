import axios from 'axios';
import { useEffect, useState } from 'react';
import { BACKEND_URL } from '../config';
import type { Content } from '../interface/Content';
import { getToken } from '../utils/auth';

export default function useContent() {
    const [contents, setContents] = useState<Content[]>([]);
    function refresh() {
        // setContents([]);
        axios.get(`${BACKEND_URL}/api/v1/content`, {
            headers: {
                'Authorization': `Bearer ${getToken()}`
            },
            withCredentials: true
        }).then((response) => {
            setContents(response.data.content);
        })
    }
    useEffect(() => {
        refresh();
    }, [])
    return { contents, refresh, setContents };;
}

// Example: How to use token from localStorage in an authenticated request
// const token = localStorage.getItem('token');
// fetch('/api/protected', { headers: { 'Authorization': `Bearer ${token}` } });