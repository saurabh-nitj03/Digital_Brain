
import { Link } from "react-router-dom";    
import LinkedinIcon from "../icons/Linkedin";
import GithubIcon from "../icons/GithubIcon";
import Twitter from "../icons/Twitter"; 

const socialLinks: { url: string; icon: any }[] = [
    {
        url: "https://www.linkedin.com/in/saurabh-chauhan-9a378725a/",
        icon: (
            // <LinkedinIcon className="h-6 w-6 transition-all duration-300 ease-in-out hover:text-mediumslateblue" />
            <LinkedinIcon />
        ),
    },
    {
        url: "https://github.com/saurabh-nitj03",
        icon: (
            <GithubIcon />
        ),
    },
    {
        url: "https://x.com/",
        icon: (
            <Twitter />
        ),
    },
];

export default function Footer() {
    return (
       <div className=" bg-slate-200 flex flex-col justify-center items-center p-4 gap-4">
                {/* Social Media Icons */}
                <div className="flex justify-center gap-4">
                    {socialLinks.map((link, index) => (
                        <Link key={index} to={link.url} target="_blank">
                            {link.icon}
                        </Link>
                    ))}
                </div>

                {/* Copyright */}
                <p className="text-center text-sm text-battleshipgray">
                    &copy; {new Date().getFullYear()} Your Digital Brain. All rights
                    reserved.
                </p>
            </div>
    )
}