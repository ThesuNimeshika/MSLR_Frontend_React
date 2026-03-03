import React, { useState } from 'react';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import SearchBar from '../../Components/SearchBar';
import JobCard from '../../Components/JobCard';
import CategoryCard from '../../Components/CategoryCard';
import '../../css/LandingPage.css';

const LandingPage: React.FC = () => {
    const [filter, setFilter] = useState<'All' | 'Recent'>('All');

    const featuredJobs = [
        { title: 'Senior Product Designer', company: 'Linear', location: 'Remote', type: 'Full-time', salary: '$140k - $180k', logo: '🎨', isRecent: true },
        { title: 'Frontend Engineer (React)', company: 'Vercel', location: 'San Francisco', type: 'Full-time', salary: '$160k - $200k', logo: '▲', isRecent: false },
        { title: 'Lead Logistics Coordinator', company: 'Maersk', location: 'Colombo', type: 'Contract', salary: '$80k - $110k', logo: '🚢', isRecent: true },
        { title: 'Backend Developer (Node.js)', company: 'Stripe', location: 'Remote', type: 'Full-time', salary: '$150k - $190k', logo: '💳', isRecent: false },
        { title: 'Brand Identity Designer', company: 'Framer', location: 'Amsterdam', type: 'Part-time', salary: '$100k - $130k', logo: '✨', isRecent: true },
        { title: 'DevOps Engineer', company: 'GitHub', location: 'Remote', type: 'Full-time', salary: '$170k - $210k', logo: '🐙', isRecent: false },
    ];

    const categories = [
        { title: 'Technology', count: '1,240', icon: '💻', color: '#6366f1' },
        { title: 'Logistics', count: '850', icon: '📦', color: '#10b981' },
        { title: 'Design', count: '420', icon: '🖋️', color: '#f43f5e' },
        { title: 'Finance', count: '670', icon: '📊', color: '#f59e0b' },
        { title: 'Healthcare', count: '310', icon: '🏥', color: '#3b82f6' },
        { title: 'Marketing', count: '540', icon: '📢', color: '#8b5cf6' },
    ];

    const filteredJobs = filter === 'Recent' ? featuredJobs.filter(j => j.isRecent) : featuredJobs;

    return (
        <div className="landing-page min-h-screen bg-bg text-text selection:bg-primary/30">
            <Header />

            {/* Hero Section */}
            <section className="hero-section z-20">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-primary/10 via-transparent to-transparent blur-[120px] opacity-40 pointer-events-none z-10"></div>

                <div className="max-w-7xl w-full text-center relative z-20 mx-auto px-5">
                    <div className="inline-flex items-center px-4 py-2 mb-6 rounded-full bg-white/5 border border-white/10 backdrop-blur-2xl animate-in fade-in slide-in-from-top-4 duration-1000">
                        <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse mr-2.5"></span>
                        <span className="text-primary font-bold text-[10px] tracking-[0.3em] uppercase">The Future of Recruitment is Here</span>
                    </div>
                    <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tighter leading-[0.9] animate-in fade-in slide-in-from-bottom-8 duration-800 text-text">
                        We connect <span className="text-primary italic font-serif">Talent </span> with organizations, that<br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-indigo-400 to-indigo-600">Demand Excellence discreetly</span> with trust
                    </h1>
                    <p className="max-w-3xl mx-auto text-text text-lg sm:text-xl md:text-2xl mb-12 animate-in fade-in slide-in-from-bottom-12 duration-1000 leading-relaxed font-semibold">
                        Connecting global talent with world-class opportunities. <br className="hidden md:block" /> Your career journey starts here with MSL Recruitment.
                    </p>
                    <div className="search-bar-hero-container animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-300">
                        <SearchBar />
                    </div>
                </div>
            </section>

            {/* Featured Jobs */}
            <section className="featured-jobs-section w-full">
                <div className="featured-jobs-container">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                        <div>
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="h-1 w-12 bg-primary rounded-full"></div>
                                <span className="text-primary font-bold text-sm tracking-[0.2em] uppercase">Opportunity</span>
                            </div>
                            <h2 className="text-5xl md:text-6xl font-bold text-text tracking-tight">Featured Jobs</h2>
                        </div>
                        <div className="flex bg-white/5 p-1 rounded-xl border border-glass-border">
                            <button
                                onClick={() => setFilter('All')}
                                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${filter === 'All' ? 'bg-primary text-white shadow-lg' : 'text-text-dim hover:text-white'}`}
                            >
                                All Jobs
                            </button>
                            <button
                                onClick={() => setFilter('Recent')}
                                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${filter === 'Recent' ? 'bg-primary text-white shadow-lg' : 'text-text-dim hover:text-white'}`}
                            >
                                Recent
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredJobs.map((job, idx) => (
                            <JobCard key={idx} {...job} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Job Categories */}
            <section className="py-12 px-5 bg-white/[0.02] border-y border-white/5 w-full">
                <div className="w-full">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4 text-text">Job Categories</h2>
                        <p className="text-text-dim">Browse jobs across popular industry sectors</p>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-6 gap-6">
                        {categories.map((cat, idx) => (
                            <CategoryCard key={idx} {...cat} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Top Companies section removed per request */}

            <Footer />
        </div>
    );
};

export default LandingPage;
