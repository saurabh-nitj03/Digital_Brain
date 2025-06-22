
import { Button } from "../components/Button";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Home() {
    const navigate = useNavigate();
    return (
        <div className="w-full min-h-screen flex flex-col bg-white text-gray-800">
            <Navbar />

            {/* Hero Section */}
            <section className=" flex flex-col justify-center items-center px-4 py-12 pt-36 text-center bg-gradient-to-b from-purple-50 to-white">
                <h1 className="text-5xl md:text-6xl font-bold mb-6 ">
                    Your Digital <span className="text-purple-600">Digital Brain</span>
                </h1>
                <p className="text-lg md:text-2xl text-gray-600 max-w-2xl ">
                    Capture, store, and access your thoughts, notes, and links — anytime, anywhere.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
                    <Button variant="primary" size="lg" text="Get Started" onClick={() => navigate("/signup")} />
                    <Button variant="secondary" size="lg" text="Explore Shared Brains" onClick={() => navigate("/shared-brains")} />
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-white">
                <h2 className="text-4xl font-bold text-center mb-12">Why Digital Brain?</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
                    {[
                        { title: "Centralized Notes", desc: "Organize all your thoughts and links in one secure place." },
                        { title: "Quick Access", desc: "Access your digital brain from anywhere, anytime." },
                        { title: "Shareable", desc: "Collaborate or share knowledge with your peers easily." },
                    ].map((f, i) => (
                        <div key={i} className="bg-purple-50 p-6 rounded-md shadow-md hover:shadow-lg transition">
                            <h3 className="text-xl font-semibold mb-2 text-purple-700">{f.title}</h3>
                            <p className="text-gray-600">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* How It Works */}
            <section className="py-16 bg-purple-50">
                <h2 className="text-4xl font-bold text-center mb-10">How It Works</h2>
                <div className="max-w-4xl mx-auto px-6 space-y-8">
                    {[
                        { step: "1", title: "Sign Up", desc: "Create your free account to get started." },
                        { step: "2", title: "Add Content", desc: "Save links, notes, documents, and ideas." },
                        { step: "3", title: "Access Anywhere", desc: "Log in anytime to retrieve or share your content." }
                    ].map(({ step, title, desc }) => (
                        <div key={step} className="flex items-start space-x-4">
                            <div className="text-white bg-purple-600 w-10 h-10 flex items-center justify-center rounded-full text-lg font-bold">{step}</div>
                            <div>
                                <h4 className="text-xl font-semibold">{title}</h4>
                                <p className="text-gray-600">{desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* About Section */}
            <section className="py-16 bg-white text-center">
                <h2 className="text-4xl font-bold mb-6">About Digital Brain</h2>
                <p className="max-w-3xl mx-auto text-lg text-gray-700">
                    Digital Brain is more than just a notes app. It’s a mindset — a way to unburden your mind and
                    save every important thought, resource, or link in a structured and searchable system.
                    Whether you're a student, researcher, developer, or just curious — Digital Brain helps you think better.
                </p>
            </section>

            {/* Contact Section */}
            <section className="py-16 bg-purple-100">
                <h2 className="text-4xl font-bold text-center mb-6">Contact Us</h2>
                <div className="max-w-xl mx-auto px-4">
                    <form className="space-y-4">
                        <input type="text" placeholder="Your Name" className="w-full px-4 py-2 border rounded-md focus:outline-none" />
                        <input type="email" placeholder="Your Email" className="w-full px-4 py-2 border rounded-md focus:outline-none" />
                        <textarea placeholder="Your Message" rows={4} className="w-full px-4 py-2 border rounded-md focus:outline-none"></textarea>
                        <Button variant="primary" size="md" text="Send Message" />
                    </form>
                </div>
            </section>

            <Footer />
        </div>
    );
}
