import  { useEffect } from 'react';
import { BACKEND_URL } from '../config';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useState } from 'react';
import { format } from 'date-fns';
import { Button } from '../components/Button';
import Explore from '../icons/Explore';
import { useNavigate } from 'react-router-dom';
import SearchBarPeople from '../components/SearchBarPeople';
import type{ SharedLink } from '../interface/SharedLink';

export default function SecondBrainShare() {
  const [sharedLinks, setSharedLinks] = useState<SharedLink[]>([]);
  const navigate = useNavigate();
   const [loading, setLoading] = useState(true);
    // Show loading spinner while checking authentication
    
    useEffect(() => {
      setLoading(true);
      axios.get(`${BACKEND_URL}/api/v1/brain/shared-brain`)
      .then((response) => {
        setLoading(false)
        setSharedLinks(response.data.data);
      })
      .catch((error) => {
        setLoading(false)
        console.error("Error fetching shared content:", error);
      });
    }, []);
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-purple-50">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="mt-4 text-gray-600">Fetching Brains...</p>
                </div>
            </div>
        );
    }
    return (
    <>
      <Navbar />
      
      <div className="flex items-center justify-center w-full flex-col px-4  bg-purple-50">
        <h2 className="text-3xl font-semibold mt-6">
          All Digital Brain Links
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
            text='Back to Digital Brain'
            onClick={() => {
              navigate('/')
            }}

          >

          </Button>
        </div>
        <div className='mt-6'>
          <SearchBarPeople sharedLinks={sharedLinks} setSharedLinks={setSharedLinks}/>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:p-8 p-2 bg-purple-50 ">
        {sharedLinks?.length > 0 && sharedLinks.map((link) => (
          <div key={link._id} className="bg-white shadow-md rounded-lg p-4  hover:shadow-lg transition">
            <h2 className="text-lg font-semibold mb-2 text-mediumslateblue">
              {link.userId.username}'s <span className='text-purple-600'>Brain -{" "}</span>
              <span className="text-battleshipgray">{link.hash}</span>
            </h2>
            <p className="text-xs text-battleshipgray mb-8 h-4">
              {link.createdAt && !isNaN(new Date(link.createdAt).getTime()) && (
                <p>  Added on {format(new Date(link.createdAt), "MMM dd, yyyy")}</p>
              )}
            </p>
            <a href={`/shared/${link.hash}`}>
              <Button
                variant="primary"
                size="md"
                text='Open Brain'
                startIcon={<Explore />}
                width={true}
                onClick={() => {

                }}
              />
            </a>
          </div>
        ))}
      </div>
      <Footer />
    </>
  )
}