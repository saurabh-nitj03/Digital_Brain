import { Button } from "../components/Button";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useState } from "react";

export default function Home() {
    const navigate = useNavigate();
    const [activeFeature, setActiveFeature] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    const features = [
        { 
            title: "Centralized Notes", 
            desc: "Organize all your thoughts and links in one secure place.",
            icon: "📝",
            color: "from-purple-500 to-purple-600"
        },
        { 
            title: "AI-Powered Chat", 
            desc: "Ask questions about your content and get intelligent responses instantly.",
            icon: "🤖",
            color: "from-blue-500 to-purple-600"
        },
        { 
            title: "Quick Access", 
            desc: "Access your digital brain from anywhere, anytime with lightning-fast search.",
            icon: "⚡",
            color: "from-purple-500 to-pink-600"
        },
        { 
            title: "Smart Sharing", 
            desc: "Share your knowledge with others through public brain links.",
            icon: "🔗",
            color: "from-green-500 to-purple-600"
        },
        { 
            title: "Multi-Format Support", 
            desc: "Save links, documents, images, and notes in one unified platform.",
            icon: "📁",
            color: "from-orange-500 to-purple-600"
        },
        { 
            title: "Secure & Private", 
            desc: "Your data is encrypted and secure. You control what you share.",
            icon: "🔒",
            color: "from-red-500 to-purple-600"
        }
    ];

    const stats = [
        { number: "10K+", label: "Active Users" },
        { number: "50K+", label: "Notes Created" },
        { number: "1M+", label: "AI Interactions" },
        { number: "99.9%", label: "Uptime" }
    ];

    const testimonials = [
        {
            name: "Sarah Chen",
            role: "Research Student",
            content: "Digital Brain has transformed how I organize my research. The AI chat feature helps me find connections I never noticed before!",
            avatar: "👩‍🎓"
        },
        {
            name: "Marcus Rodriguez",
            role: "Software Developer",
            content: "Perfect for storing code snippets, documentation links, and technical notes. The search is incredibly fast.",
            avatar: "👨‍💻"
        },
        {
            name: "Dr. Emily Watson",
            role: "Professor",
            content: "I use it to share curated resources with my students. The public brain feature is brilliant for collaboration.",
            avatar: "👩‍🏫"
        }
    ];

    return (
        <div className="w-full min-h-screen flex flex-col bg-white text-gray-800">
            <Navbar />

            {/* Hero Section */}
            <section className="flex flex-col justify-center items-center px-4 py-12 pt-36 text-center bg-gradient-to-b from-purple-50 to-white relative overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                    <div className="absolute top-40 left-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
                </div>
                
                <div className="relative z-10">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6">
                        Your Digital <span className="text-purple-600">Digital Brain</span>
                    </h1>
                    <p className="text-lg md:text-2xl text-gray-600 max-w-2xl mb-8">
                        Capture, store, and access your thoughts, notes, and links — anytime, anywhere. 
                        <span className="block text-purple-600 font-semibold mt-2">Now with AI-powered insights!</span>
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
                        <Button variant="primary" size="lg" text="Get Started" onClick={() => navigate("/signup")} />
                        <Button variant="secondary" size="lg" text="Explore Shared Brains" onClick={() => navigate("/shared-brains")} />
                    </div>
                    
                    {/* Interactive demo preview */}
                    <div className="mt-12 max-w-4xl mx-auto">
                        <div className="bg-white rounded-lg shadow-xl p-6 border border-gray-200">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-800">Try the AI Chat</h3>
                                <div className="flex space-x-2">
                                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                                </div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 text-left">
                                <div className="flex items-center space-x-2 mb-3">
                                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                        <span className="text-purple-600 text-sm">🤖</span>
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">AI Assistant</span>
                                </div>
                                <p className="text-gray-600 text-sm">Ask me anything about your saved content! I can help you find connections, summarize notes, or answer questions based on your digital brain.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-purple-600 text-white">
                <div className="max-w-6xl mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center mb-12">Trusted by Thousands</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</div>
                                <div className="text-purple-200">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Enhanced Features Section */}
            <section className="py-16 bg-white">
                <h2 className="text-4xl font-bold text-center mb-12">Why Digital Brain?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-6">
                    {features.map((feature, index) => (
                        <div 
                            key={index} 
                            className={`bg-gradient-to-br ${feature.color} p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer text-white`}
                            onMouseEnter={() => setActiveFeature(index)}
                            onMouseLeave={() => setActiveFeature(-1)}
                        >
                            <div className="text-4xl mb-4">{feature.icon}</div>
                            <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                            <p className="text-purple-100">{feature.desc}</p>
                            {activeFeature === index && (
                                <div className="mt-4 text-sm text-purple-200">
                                    ✨ Try it now in your dashboard!
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* Interactive Demo Section */}
            <section className="py-16 bg-purple-50">
                <div className="max-w-6xl mx-auto px-6">
                    <h2 className="text-4xl font-bold text-center mb-12">See It In Action</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h3 className="text-2xl font-bold mb-6 text-purple-800">Smart Content Management</h3>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm">✓</div>
                                    <span className="text-gray-700">Add links, notes, and documents with one click</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm">✓</div>
                                    <span className="text-gray-700">Organize with tags and categories</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm">✓</div>
                                    <span className="text-gray-700">Lightning-fast search across all content</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm">✓</div>
                                    <span className="text-gray-700">AI-powered insights and connections</span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-xl p-6 border border-gray-200">
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                    <span className="text-2xl">🔗</span>
                                    <div>
                                        <div className="font-medium">React Documentation</div>
                                        <div className="text-sm text-gray-500">reactjs.org/docs</div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                    <span className="text-2xl">📝</span>
                                    <div>
                                        <div className="font-medium">Project Ideas</div>
                                        <div className="text-sm text-gray-500">Build a task management app...</div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                                    <span className="text-2xl">🤖</span>
                                    <div>
                                        <div className="font-medium">AI Chat Available</div>
                                        <div className="text-sm text-gray-500">Ask about your content</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-16 bg-white">
                <h2 className="text-4xl font-bold text-center mb-10">How It Works</h2>
                <div className="max-w-4xl mx-auto px-6 space-y-8">
                    {[
                        { step: "1", title: "Sign Up", desc: "Create your free account to get started.", icon: "👤" },
                        { step: "2", title: "Add Content", desc: "Save links, notes, documents, and ideas with our intuitive interface.", icon: "➕" },
                        { step: "3", title: "Chat with AI", desc: "Ask questions about your content and get intelligent insights.", icon: "🤖" },
                        { step: "4", title: "Share & Collaborate", desc: "Share your brain with others or explore public brains.", icon: "🌐" }
                    ].map(({ step, title, desc, icon }) => (
                        <div key={step} className="flex items-start space-x-6 p-6 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                            <div className="text-white bg-purple-600 w-12 h-12 flex items-center justify-center rounded-full text-lg font-bold flex-shrink-0">
                                {step}
                            </div>
                            <div className="flex items-center space-x-4">
                                <span className="text-3xl">{icon}</span>
                                <div>
                                    <h4 className="text-xl font-semibold text-purple-800">{title}</h4>
                                    <p className="text-gray-600">{desc}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-16 bg-purple-50">
                <h2 className="text-4xl font-bold text-center mb-12">What Users Say</h2>
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                                <div className="flex items-center mb-4">
                                    <span className="text-3xl mr-3">{testimonial.avatar}</span>
                                    <div>
                                        <div className="font-semibold text-gray-800">{testimonial.name}</div>
                                        <div className="text-sm text-purple-600">{testimonial.role}</div>
                                    </div>
                                </div>
                                <p className="text-gray-600 italic">"{testimonial.content}"</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section className="py-16 bg-white text-center">
                <h2 className="text-4xl font-bold mb-6">About Digital Brain</h2>
                <p className="max-w-3xl mx-auto text-lg text-gray-700 mb-8">
                    Digital Brain is more than just a notes app. It's a mindset — a way to unburden your mind and
                    save every important thought, resource, or link in a structured and searchable system.
                    Whether you're a student, researcher, developer, or just curious — Digital Brain helps you think better.
                </p>
                <div className="flex justify-center space-x-4">
                    <div className="bg-purple-100 px-4 py-2 rounded-full text-purple-700 font-medium">AI-Powered</div>
                    <div className="bg-purple-100 px-4 py-2 rounded-full text-purple-700 font-medium">Secure</div>
                    <div className="bg-purple-100 px-4 py-2 rounded-full text-purple-700 font-medium">Collaborative</div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-r from-purple-600 to-purple-800 text-white text-center">
                <h2 className="text-4xl font-bold mb-6">Ready to Build Your Digital Brain?</h2>
                <p className="text-xl mb-8 text-purple-100">Join thousands of users who are already thinking better.</p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Button variant="primary" size="lg" text="Start Building Now" onClick={() => navigate("/signup")} />
                    <Button variant="secondary" size="lg" text="See Examples" onClick={() => navigate("/shared-brains")} />
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-16 bg-purple-100">
                <h2 className="text-4xl font-bold text-center mb-6">Get In Touch</h2>
                <div className="max-w-xl mx-auto px-4">
                    <form className="space-y-4">
                        <input type="text" placeholder="Your Name" className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
                        <input type="email" placeholder="Your Email" className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
                        <textarea placeholder="Your Message" rows={4} className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"></textarea>
                        <Button variant="primary" size="md" text="Send Message" />
                    </form>
                </div>
            </section>

            <Footer />
        </div>
    );
}
