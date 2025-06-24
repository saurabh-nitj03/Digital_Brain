
import { useState } from "react";
import axios from "axios";
import { Button } from "./Button";
import { BACKEND_URL } from "../config";

import { ClipboardIcon, ClipboardCheckIcon, } from "lucide-react";
import { CrossIcon } from "../icons/CrossIcon";
import { getToken } from "../utils/auth";

interface ShareBrainModalProps {
  open: boolean;
  onClose: () => void;
}

const ShareBrainModal = ({ open, onClose }: ShareBrainModalProps) => {
  const [isShared, setIsShared] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const handleShare = async () => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/brain/share`,
        { share: true },
        {headers: {
              'Authorization': `${getToken()}`
            }, withCredentials: true }
      );
      if (response.data.success) {
        setIsShared(true);
        setShareLink(`${window.location.origin}/shared/${response.data.hash}`);
      }
    } catch (error) {
      console.error("Error sharing brain:", error);
    }
  };

  const handleUnshare = async () => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/brain/share`,
        { share: false },
        { withCredentials: true }
      );
      if (response.data.success) {
        setIsShared(false);
        setShareLink("");
      }
    } catch (error) {
      console.error("Error unsharing brain:", error);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  if (!open) return null;

  return (
    <div className="w-screen h-screen fixed top-0 left-0 z-50 flex justify-center items-center">
      <div className="absolute w-full h-full bg-slate-500 opacity-60 z-10"></div>

      <div className="z-20 bg-white rounded-md shadow-md p-6 w-11/12 max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Share Your Brain</h2>
          <button onClick={onClose}>
            <CrossIcon  />
          </button>
        </div>

        <div className="space-y-4">
          {isShared ? (
            <>
              <p>Your brain is currently shared. Here's your share link:</p>
              <div className="flex items-center gap-4 ">
                <input
                  type="text"
                  value={shareLink}
                  readOnly
                  className="flex-grow p-2 border rounded"
                />
                <Button
                  startIcon={
                    isCopied ? (
                      <ClipboardCheckIcon className="w-5 h-5" />
                    ) : (
                      <ClipboardIcon className="w-5 h-5" />
                    )
                  }
                  text={isCopied ? "Copied!" : "Copy"}
                  variant="primary"
                  size="md"
                  onClick={copyToClipboard}
                  
                />
              </div>
              <Button
                variant="secondary"
                size="md"
                text="Stop Sharing"
                onClick={handleUnshare}
                width={true}
                
              />
            </>
          ) : (
            <>
              <p>Share your brain to allow others to view your content.</p>
              <Button
                variant="primary"
                text="Share My Brain"
                size="md"
                onClick={handleShare}
                width={true}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareBrainModal;
