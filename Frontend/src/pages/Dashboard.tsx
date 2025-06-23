import { Button } from '../components/Button'
import { PlusIcon } from '../icons/PlusIcon'
import { ShareIcon } from '../icons/ShareIcon'
import Card from '../components/Card'
import { useEffect, useState } from 'react'
import CreateContentModal from '../components/CreateContentModal'
import { Sidebar } from '../components/Sidebar'
import useContent from '../hooks/useContent'
import axios from 'axios'
import { BACKEND_URL } from '../config'
import { useNavigate } from 'react-router-dom'
import ShareBrainModal from "../components/ShareBrainModal"
import SearchBar from '../components/SearchBar'
import { getToken } from '../utils/auth'

export default function Dashboard() {
    const navigate = useNavigate()
    const [modalOpen, setModalOpen] = useState(false);
    const { contents, refresh, setContents } = useContent();
    const [loading, setLoading] = useState(true); // Start with true
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [openShareModal, setOpenShareModal] = useState(false);
    useEffect(() => {
        const checkAuthentication = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${BACKEND_URL}/api/v1/check`, {
                    headers: {
                        'Authorization': `Bearer ${getToken()}`
                    },
                    withCredentials: true
                });
                
                if (response.data.success) {
                    setIsAuthenticated(true);
                    refresh(); // Load content only after authentication is confirmed
                } else {
                    navigate("/signin");
                }
            } catch (err) {
                console.error('Authentication check failed:', err);
                navigate("/signin");
            } finally {
                setLoading(false);
            }
        };

        checkAuthentication();
    }, [modalOpen]); // Remove modalOpen dependency - only run on mount

    // Show loading spinner while checking authentication
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="mt-4 text-gray-600">Verifying authentication...</p>
                </div>
            </div>
        );
    }

    // Don't render the main UI if not authenticated
    if (!isAuthenticated) {
        return null;
    }

    return (
        <div>
            <Sidebar contents={contents} setContents={setContents} />

            <div className='p-4 bg-purple-50 lg:ml-72 md:ml-60 transition-all duration-500 ease-in-out min-h-screen'>
                <CreateContentModal 
                    open={modalOpen} 
                    onClose={() => { setModalOpen(false) }} 
                />
                <ShareBrainModal
          open={openShareModal}
          onClose={() => setOpenShareModal(false)}
        />
                
                <div className=" flex justify-between items-center gap-4">
                    <div className=" text-xl md:text-2xl lg:text-3xl font-semibold ml-5 text-gray-600 cursor-pointer" onClick={refresh} >
                        All Notes
                    </div>
                    <div><SearchBar contents={contents} setContents={setContents}/></div>
                    
                    <div className="flex gap-3 justify-end">
                        <Button 
                            variant='secondary' 
                            size='md' 
                            text='Share Brain' 
                            startIcon={<ShareIcon size='md' />} 
                            onClick={()=>setOpenShareModal(true)} 
                        />
                        
                        <Button 
                            variant='primary' 
                            size='md' 
                            text='Add Content' 
                            startIcon={<PlusIcon size='md' />} 
                            onClick={() => { setModalOpen(true) }} 
                        />
                    </div>
                </div>
                
                <div className="flex ml-5 mt-6">
                    <div className="flex gap-6 flex-wrap justify-evenly items-start">
                        {contents.map(({ type, title, link, _id, content, tags, createdAt }) => (
                            <Card 
                                key={_id} 
                                type={type} 
                                title={title} 
                                link={link} 
                                contentId={_id} 
                                content={content} 
                                tags={typeof tags === 'string' ? [tags] : tags} 
                                createdAt={createdAt} 
                                delete={true} 
                                contents={contents}
                                setContents={setContents}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}