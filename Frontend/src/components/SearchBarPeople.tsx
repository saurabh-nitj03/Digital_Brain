import { useEffect, useState } from "react";
import { BACKEND_URL } from "../config";
import axios from "axios";
import type { SharedLink } from "../interface/SharedLink";

interface SearchBarPeopleProps {
    sharedLinks: SharedLink[],
    setSharedLinks: (sharedLinks: SharedLink[]) => void
}
export default function SearchBarPeople({ sharedLinks, setSharedLinks }: SearchBarPeopleProps) {
    const [query, setQuery] = useState("");

    useEffect(() => {
        const debounced = setTimeout(async () => {
            try {
               if(query.trim() === ""){
                  const res=await axios.get(`${BACKEND_URL}/api/v1/brain/shared-brain`);
                  if( res.data.success) setSharedLinks( res.data.data);
                  else {
                    console.log(res.data.message);
                  }
                  // setSharedLinks(copySharedLinks);
               }  else {
                // console.log(await axios.get(`${BACKEND_URL}/api/v1/getuser/${query}`));
                  const response = await axios.get(`${BACKEND_URL}/api/v1/brain/getuser/${query}`);
                  console.log(response)
                  if(response.data.success){
                    console.log(response.data.link)
                    setSharedLinks(response.data.link)
                    console.log(sharedLinks)
                  } else setSharedLinks([]);
               }

            } catch (err) {
                console.log(err);
                setSharedLinks([])
            }
        }, 500)
        return () => clearTimeout(debounced);
    }, [query, setSharedLinks])
    return (
        // <Input placeholder="Search" rounded={true}/>

      <input
  placeholder="Search name"
//   className="rounded-md md:w-50  text-center py-1 px-3 border-2 ring-purple-600 border-purple-600 focus:outline-none focus:ring-purple-600  "
  className="rounded-md w-full max-w-xs text-center py-1.5 px-3  border-2 ring-purple-600 border-purple-600 focus:outline-none  focus:ring-purple-600 hover:border-purple-700 "

  value={query}
  onChange={(e) => setQuery(e.target.value)}
/>
    )
}