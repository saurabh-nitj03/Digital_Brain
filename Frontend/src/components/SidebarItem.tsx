import type { ReactElement } from "react";
import { BACKEND_URL } from "../config";
import axios from "axios";

interface SidebarItemProps {
    text: "Twitter" | "Youtube" | "Document" | "Image" | "Link",
    icon: ReactElement,
    contents: any[],
    setContents: (contents: any[]) => void
}
const ContentType = {
    Youtube: "youtube",
    Twitter: "twitter",
    Document: "document",
    Image: "image",
    Link: "link"
} as const;
type ContentType = typeof ContentType[keyof typeof ContentType];

export function SidebarItem(props: SidebarItemProps) {
    return (
        <div className=" flex items-center justify-start gap-4 p-3  text-lg font-medium 
        cursor-pointer hover:bg-gray-100 rounded-lg max-w-60" onClick={async () => {
            const type = ContentType[props.text];
                const response = await axios.get(`${BACKEND_URL}/api/v1/content/${type}`,{withCredentials:true});
                // console.log(response)
                props.setContents && props.setContents(response.data.content);

            }}>
            <div>{props.icon}</div>
            <div>{props.text}</div>
        </div>
    )

}