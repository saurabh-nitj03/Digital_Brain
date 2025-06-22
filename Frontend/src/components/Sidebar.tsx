
import type { ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../config";
import axios from "axios";

import Twitter from "../icons/Twitter";
import YouTube from "../icons/Youtube";
import Document from "../icons/Document";
import Image from "../icons/Image";
import Link from "../icons/Link";
import Logo from "../icons/Logo";
import { SidebarItem } from "./SidebarItem";
import { Button } from "./Button";
import LogoutIcon from "../icons/LogoutIcon";
import type { Content } from "../interface/Content";


interface SidebarProps {
  contents: Content[];
  setContents: (contents: Content[]) => void;
}

export function Sidebar({ contents, setContents }: SidebarProps) {
  const navigate = useNavigate();

  const icons: { icon: ReactElement; type: "Twitter" | "Youtube" | "Document" | "Image" | "Link" }[] = [
    { icon: <Twitter />, type: "Twitter" },
    { icon: <YouTube />, type: "Youtube" },
    { icon: <Document />, type: "Document" },
    { icon: <Image />, type: "Image" },
    { icon: <Link />, type: "Link" },
  ];
  const signout = async () => {
       await axios.post(`${BACKEND_URL}/api/v1/signout`, {}, { withCredentials: true })
      // console.log(response)
      navigate("/");
    }

    return (
      <>
        {/* Sidebar for Desktop */}
        <div className="md:block hidden h-screen border-r-2 bg-white w-60 lg:w-72 fixed left-0 top-0 transition-all duration-500 ease-in-out">
          <div className="flex flex-col justify-between h-full">
            <div>
              <div className="p-3 pt-4 text-2xl flex items-center  text-gray-600 text-center font-semibold cursor-pointer " onClick={() => {
                navigate("/")
              }}>
                <div className="pl-1 ">
                  <Logo />

                </div>
                <div className=" pl-4">
                  Digital Brain
                </div>
              </div>
              <div className="pt-2 pl-5">
                <SidebarItem icon={<Twitter />} text="Twitter" contents={contents} setContents={setContents} />
                <SidebarItem icon={<YouTube />} text="Youtube" contents={contents} setContents={setContents} />
                <SidebarItem icon={<Document />} text="Document" contents={contents} setContents={setContents} />
                <SidebarItem icon={<Image />} text="Image" contents={contents} setContents={setContents} />
                <SidebarItem icon={<Link />} text="Link" contents={contents} setContents={setContents} />

              </div>
            </div>

            <div className="flex justify-center items-center pb-12">
              <Button variant="primary" size="md" text="Log out" startIcon={<LogoutIcon></LogoutIcon>} onClick={signout} />
            </div>
          </div>

        </div>
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t flex justify-around py-2 z-30 transition-all duration-500 ease-in-out">
          {icons.map((item) => (
            <button
              key={item.type}
              onClick={async () => {
                const response = await axios.get(`${BACKEND_URL}/api/v1/content/${item.type.toLowerCase()}`, { withCredentials: true });
                console.log(response)
                setContents(response.data.content);
  
              }}
            >
              {item.icon}
            </button>
          ))}
  
          <div>
            <button onClick={signout}><LogoutIcon /></button>
  
          </div>
        </div>
      </>
    );
  }
