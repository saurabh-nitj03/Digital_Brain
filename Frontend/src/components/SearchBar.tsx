import { useEffect, useState } from "react";
import { BACKEND_URL } from "../config";
import axios from "axios";
import type { Content } from "../interface/Content";
import { getToken } from "../utils/auth";

interface SearchBarProps {
    contents: Content[],
    setContents: (contents: Content[]) => void,
    userId?: string,
    hash?: string
}
export default function SearchBar({ setContents, userId, hash }: SearchBarProps) {
    const [query, setQuery] = useState("");
    useEffect(() => {
        const debounced = setTimeout(async () => {
            try {
                // console.log(userId,hash)

                if (hash) {
                    if (query.trim() === "") {
                        // console.log(hash,userId)
                        const all = await axios.get(`${BACKEND_URL}/api/v1/brain/hash/${hash}`, { 
                            headers: {
                        'Authorization': `${getToken()}`
                    },withCredentials: true },)
                        // console.log(all);
                        setContents(all.data.content)
                        return;
                    }
                    const result = await axios.post(`${BACKEND_URL}/api/v1/content/search`, {
                        userId: userId,
                        query: query
                    })
                    if (!result.data.success) {
                        console.log(result.data.message);
                        return
                    } else {
                        setContents(result.data.content);
                    }

                } else {
                    // console.log("i am here in main part")
                    if (query.trim() === "") {
                        const all = await axios.get(`${BACKEND_URL}/api/v1/content`, { withCredentials: true },)
                        setContents(all.data.content)
                        return;
                    }
                    let id;
                    const res = await axios.get(`${BACKEND_URL}/api/v1/check`, {
                        headers: {
                        'Authorization': `${getToken()}`
                        }, withCredentials: true });
                    if (res.data.success) id = res.data.userId;
                    const result = await axios.post(`${BACKEND_URL}/api/v1/content/search`, {
                        userId: id,
                        query: query
                    })
                    if (!result.data.success) {
                        console.log(result.data.message);
                        return
                    } else {
                        setContents(result.data.content);
                    }
                }

            } catch (err) {
                console.log(err);
            }
        }, 500)
        return () => clearTimeout(debounced);
    }, [query, setContents])
    return (
        // <Input placeholder="Search" rounded={true}/>

        <input
            placeholder="Search"
            //   className="rounded-md md:w-50  text-center py-1 px-3 border-2 ring-purple-600 border-purple-600 focus:outline-none focus:ring-purple-600  "
            className="rounded-md w-full max-w-xs text-center py-1.5 px-3  border-2 ring-purple-600 border-purple-600 focus:outline-none  focus:ring-purple-600 hover:border-purple-700 "

            value={query}
            onChange={(e) => setQuery(e.target.value)}
        />
    )
}