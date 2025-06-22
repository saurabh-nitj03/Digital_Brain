
import { useNavigate } from "react-router-dom";
import Logo from "../icons/Logo";
import { Button } from "./Button";
import { useState } from "react";
import { Menu } from "lucide-react";
import { CrossIcon } from "../icons/CrossIcon"; // or any other icon lib you use

export default function Navbar() {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="border-b-2 border-slate-200 px-4 py-5 md:px-6 flex justify-between items-center">
            {/* Logo Section */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
                <Logo />
                <div className="text-lg md:text-2xl font-medium">Digital Brain</div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-4" >
                <div className="flex gap-10 mr-4 text-sm md:text-lg" onClick={()=>{
                navigate("/");
            }}>
                    <div className="cursor-pointer">Home</div>
                    <div className="cursor-pointer">About </div>
                    <div className="cursor-pointer">Contact Us</div>
                </div>
                <Button variant="secondary" size="md" text="Login" onClick={() => navigate("/signin")} />
                <Button variant="primary" size="md" text="Sign Up" onClick={() => navigate("/signup")} />
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
                <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}>
                    {isMobileMenuOpen ? <CrossIcon/> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && ( 
                <div className="absolute top-20 left-0 w-full bg-white border-t border-slate-200 shadow-md flex flex-col items-center gap-4 py-4 z-10 md:hidden">
                    <div className="text-sm text-center space-y-2" onClick={()=>{
                navigate("/");
            }}>
                        <div className="cursor-pointer">Home</div>
                        <div className="cursor-pointer">About </div>
                        <div className="cursor-pointer">Contact Us</div>
                    </div>
                    <Button variant="secondary" size="md" text="Login" onClick={() => { navigate("/signin"); setMobileMenuOpen(false); }} />
                    <Button variant="primary" size="md" text="Sign Up" onClick={() => { navigate("/signup"); setMobileMenuOpen(false); }} />
                </div>
            )}
        </div>
    );
}
