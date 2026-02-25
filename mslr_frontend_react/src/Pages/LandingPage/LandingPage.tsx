import React, { useState } from 'react';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import SearchBar from '../../Components/SearchBar';
import JobCard from '../../Components/JobCard';
import CategoryCard from '../../Components/CategoryCard';
import CompanyCard from '../../Components/CompanyCard';
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

    const companies = [
        { name: 'Google', jobs: 45, logo: 'G' },
        { name: 'Amazon', jobs: 32, logo: 'A' },
        { name: 'Microsoft', jobs: 28, logo: 'M' },
        { name: 'Netfix', jobs: 12, logo: 'N' },
        { name: 'SpaceX', jobs: 8, logo: 'X' },
        { name: 'Meta', jobs: 19, logo: '∞' },
    ];

    const filteredJobs = filter === 'Recent' ? featuredJobs.filter(j => j.isRecent) : featuredJobs;

    return (
        <div className="landing-page min-h-screen bg-bg text-text selection:bg-primary/30">
            <Header />

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center pt-20 pb-20 px-5 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-primary/10 via-transparent to-transparent blur-3xl opacity-50 pointer-events-none"></div>
                <div className="absolute -top-20 -left-20 w-80 h-80 bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute bottom-20 -right-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="w-full text-center relative z-10">
                    <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-white/5 border border-white/10 backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-500">
                        <span className="text-primary font-bold text-xs tracking-widest uppercase">✨ The Future of Recruitment is Here</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight leading-[1.1] animate-in fade-in slide-in-from-bottom-8 duration-700 text-text">
                        Find Your <span className="text-primary italic">Dream</span> Job<br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-indigo-400 to-indigo-600">With Next-Gen Search</span>
                    </h1>
                    <p className="text-text-dim text-base sm:text-lg md:text-xl mb-12 animate-in fade-in slide-in-from-bottom-12 duration-1000 px-4">
                        Connecting talented individuals with world-class companies. Express your career journey with MSL Recruitment across the globe.
                    </p>
                    <div className="animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-300 w-full px-0">
                        <SearchBar />
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50 hidden md:block">
                    <div className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center p-1">
                        <div className="w-1.5 h-3 bg-primary rounded-full"></div>
                    </div>
                </div>
            </section>

            {/* Featured Jobs */}
            <section className="py-20 px-5 w-full">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <span className="text-primary font-bold text-sm tracking-widest uppercase mb-2 block">Opportunity</span>
                        <h2 className="text-4xl font-bold text-text">Featured Jobs</h2>
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
            </section>

            {/* Job Categories */}
            <section className="py-20 px-5 bg-white/[0.02] border-y border-white/5 w-full">
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

            {/* Top Companies */}
            <section className="py-20 px-5 w-full">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4 text-text">Top Hiring Companies</h2>
                    <p className="text-text-dim">Partnering with global industry leaders</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {companies.map((comp, idx) => (
                        <CompanyCard key={idx} {...comp} />
                    ))}
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default LandingPage;
