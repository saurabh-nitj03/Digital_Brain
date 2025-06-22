import type { ReactElement } from "react";
import { ShareIcon } from "../icons/ShareIcon";
import DeleteIcon from "../icons/DeleteIcon";
import YouTube from "../icons/Youtube";
import Twitter from "../icons/Twitter";
import axios from "axios";
import { BACKEND_URL } from "../config";
import Document from "../icons/Document";
import Image from "../icons/Image";
import Link from "../icons/Link";
import { format } from "date-fns";
import { useEffect } from "react";
import type { Content } from "../interface/Content";

declare global {
  interface Window {
    twttr?: any;
  }
}

export interface CardProps {
  title: string;
  link?: string;
  type: "twitter" | "youtube" | "document" | "image" | "link";
  contentId: string;
  content?: string;
  tags?: string[];
  createdAt?: Date;
  delete?: boolean,
  contents?:Content[],
  setContents?:(contents: Content[]) => void,
}

function TwitterEmbed({ link }: { link: string }) {
  useEffect(() => {

    if (window.twttr) {
      window.twttr.widgets.load();
    } else {
      const script = document.createElement("script");
      script.src = "https://platform.twitter.com/widgets.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, [link]);

  return (
    <div className="twitter-embed mb-4">
      <blockquote className="twitter-tweet" data-dnt="true">
        <a href={link.replace("x.com", "twitter.com")}></a>
      </blockquote>
    </div>
  );
}

const Card = (props: CardProps): ReactElement => {
  return (
    <div className="p-2 bg-white rounded-md shadow-md border border-gray-200 w-80 min-w-48 hover:shadow-lg transition">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className="pr-4 text-gray-300">
            {props.type === "youtube" && <YouTube />}
            {props.type === "twitter" && <Twitter />}
            {props.type === "document" && <Document />}
            {props.type === "image" && <Image />}
            {props.type === "link" && <Link />}
          </div>
          <div className=" text-lg font-medium truncate">{props.title}</div>
        </div>
        <div className="flex text-gray-200">
          {
            props.link !== "" && (
              <div className="pr-3 text-gray-300">
                <a
                  href={props.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-battleshipgray "
                >
                  <ShareIcon size="md" />
                </a>
              </div>
            )
          }
          {
          props.delete && (
              <div
                className="pr-3 text-gray-300 cursor-pointer"
                onClick={async () => {
                    const confirmDelete = window.confirm("Are you sure you want to delete this content?");
                     if (!confirmDelete) return;
                  try {
                    // setContents(contents.filter((content) => content._id!== props.contentId))
                    
                    if (props.setContents && props.contents) {
                      props.setContents(props.contents.filter((content) => content._id !== props.contentId));
                    }

                    await axios.delete(`${BACKEND_URL}/api/v1/content`, {
                      data: { contentId: props.contentId },
                      withCredentials: true
                    });
                    // window.location.reload();
                  } catch (error) {
                    console.error("Failed to delete content:", error);
                  }
                }}
              >
                <DeleteIcon />
              </div>
          )
          }
        </div>
      </div>

      <div className="p-4">

        {props.type === "youtube" && props.link && (
          <iframe
            className="w-full h-40 rounded-md"
            src={props.link
              .replace("watch", "embed")
              .replace("?v=", "/")}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        )}

        {props.type === "twitter" && props.link && <TwitterEmbed link={props.link} />}

        {props.type === "image" && (
          <a href={props.link}>
            <img
              src={props.link}
              alt={props.title}
              className="w-full object-cover  rounded-md h-40"
            />

          </a>
        )
        }
        {
          props.type === "document" && (
            <a href={props.link}>

              <img
                src={props.link?.replace("pdf", "png")}
                alt={props.title}
                className="w-full object-cover object-left-top  rounded-md h-40"
              />
            </a>
          )

        }
        <div className="min-h-8">
          {props.content !== "" && <div className="mt-1 py-1 text-md ">
            {props.content}</div>}

        </div>
      </div>
      <div className="min-h-9 ml-4">

        {props.tags && props.tags[0] != "" && props.tags.length > 0 && (
          <div className="">
            <div className="flex flex-wrap gap-2 mb-2">
              {props.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-slate-200  text-sm px-2 py-1 rounded-md"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      <p className="text-xs text-battleshipgray ml-2">
        {props.createdAt && (
          <>Added on {format(new Date(props.createdAt), "MMM dd, yyyy")}</>
        )}
      </p>

    </div>
  );
}
export default Card;
