import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import { useState, useEffect } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/Button";
import SearchBar from "../components/SearchBar";
import type { Content } from "../interface/Content";


export default function SharedBrain() {
    const navigate = useNavigate();
    const [contents, setContents] = useState<Content[]>([]);
    const hash = useParams<{ hash: string }>().hash;
    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/v1/brain/hash/${hash}`,).then((response) => {
            setContents(response.data.content);
        }).catch((error) => {
            console.error("Error fetching content:", error);
        });
    }, []);

    return (
        <>
            <Navbar />
            <div className="flex items-center justify-center w-full flex-col px-4  bg-purple-50">
                <h2 className="text-3xl font-semibold mt-6">
                   Digital Brain of {contents.length > 0 ? contents[0].userId?.username : "Unknown User"}
                </h2>
                <p className="max-w-xl mx-auto my-2 text-sm md:text-lg text-neutral-600 text-center">
                    Share your Digital Brain with the world
                </p>
                <div className="w-full flex justify-center items-center gap-4 mt-8 ">
                    <Button
                        variant="primary"
                        size="lg"
                        text='Create New Brain'
                        onClick={() => {
                            navigate("/signup");
                        }}

                    />
                    <Button
                        variant="secondary"
                        size="lg"
                        text='All Digital Brain'
                        onClick={() => {
                            navigate('/shared-brains')
                        }}

                    >

                    </Button>
                    {/* contents[0]?.userId?._id */}
                    {/* {contents[0]?.userId?._id} */}

                </div>
                <div className="mt-6">
                    <SearchBar contents={contents} setContents={setContents} userId={contents[0]?.userId?._id} hash={hash}/>

                </div>
                <div className='p-8 min-h-screen'>
                    <div className="flex gap-8 flex-wrap justify-evenly items-start ">
                        {contents.map(({ type, title, link, _id, content, tags, createdAt }, index) => <Card key={index}
                            type={type} title={title} link={link} contentId={_id} content={content} tags={tags} createdAt={createdAt} />)}
                    </div>

                </div>
            </div>
                <Footer />
        </>
    )
}