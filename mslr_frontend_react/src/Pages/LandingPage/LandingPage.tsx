import React, { useState, useEffect } from 'react';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import SearchBar from '../../Components/SearchBar';
import JobCard from '../../Components/JobCard';
import CategoryCard from '../../Components/CategoryCard';
import '../../css/LandingPage.css';
import logo from '../../assets/mslLOGO.png';
interface ApiJob {
    jobId: number;
    jobTitle: string;
    jobDescription: string;
    salaryRange: string | null;
    postedDate: string;
    applicationDeadline: string | null;
    location?: { locationName: string };
    sector?: { sectorName: string };
}

interface ApiSector {
    sectorId: number;
    sectorName: string;
    subSectorName: string | null;
}

interface DynamicCategory {
    title: string;
    count: string;
    icon: string;
    color: string;
}

const CATEGORY_MAP: { [key: string]: { icon: string; color: string } } = {
    'Accounting': { icon: '📂', color: '#4f46e5' },
    'Technology': { icon: '💻', color: '#6366f1' },
    'IT': { icon: '💻', color: '#6366f1' },
    'Logistics': { icon: '📦', color: '#10b981' },
    'Design': { icon: '🖋️', color: '#f43f5e' },
    'Finance': { icon: '📊', color: '#f59e0b' },
    'Healthcare': { icon: '🏥', color: '#3b82f6' },
    'Marketing': { icon: '📢', color: '#8b5cf6' },
};

const DEFAULT_CATEGORY = { icon: '🏢', color: '#8b5cf6' };

interface Job {
    title: string;
    company: string;
    location: string;
    type: string;
    salary: string;
    logo: string;
    isRecent: boolean;
    deadline?: string | null;
}

const API_URL = 'http://localhost:5194/api';

const LandingPage: React.FC = () => {
    const [filter, setFilter] = useState<'All' | 'Recent'>('All');
    const [jobs, setJobs] = useState<Job[]>([]);
    const [categories, setCategories] = useState<DynamicCategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>('');

    const fetchJobs = async (params?: { title?: string; location?: string; category?: string }) => {
        setIsLoading(true);
        setHasError(false);
        setErrorMessage('');
        try {
            let url = `${API_URL}/Jobs`;
            if (params) {
                const query = new URLSearchParams();
                if (params.title) query.append('title', params.title);
                if (params.location) query.append('location', params.location);
                if (params.category) query.append('category', params.category);
                url = `${API_URL}/Jobs/search?${query.toString()}`;
            }

            const response = await fetch(url);
            if (response.ok) {
                const data: ApiJob[] = await response.json();
                const mappedJobs = data.map(j => ({
                    title: j.jobTitle,
                    company: 'MSLR Partner',
                    location: j.location?.locationName || 'Remote',
                    type: 'Full-time',
                    salary: j.salaryRange || 'Competitive',
                    logo: j.jobTitle.charAt(0).toUpperCase(),
                    isRecent: new Date(j.postedDate).getTime() > Date.now() - (7 * 24 * 60 * 60 * 1000),
                    deadline: j.applicationDeadline
                }));
                setJobs(mappedJobs);
            } else {
                const err = await response.json().catch(() => ({}));
                setHasError(true);
                setErrorMessage(err.details || 'Unable to connect to the database.');
            }
        } catch (error) {
            console.error("Error fetching jobs:", error);
            setHasError(true);
            setErrorMessage('Backend is unreachable. Ensure it is running on port 5194.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();

        const fetchCategories = async () => {
            try {
                const response = await fetch(`${API_URL}/Sectors`);
                if (response.ok) {
                    const data: ApiSector[] = await response.json();

                    const uniqueSectors = Array.from(new Set(data.map(s => s.sectorName)));

                    const mappedCategories = uniqueSectors.map(sectorName => ({
                        title: sectorName,
                        count: '120+', // Placeholder fallback count
                        icon: CATEGORY_MAP[sectorName]?.icon || DEFAULT_CATEGORY.icon,
                        color: CATEGORY_MAP[sectorName]?.color || DEFAULT_CATEGORY.color,
                    }));

                    setCategories(mappedCategories.slice(0, 6)); // Display top 6
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategories();
    }, []);

    const handleSearch = (params: { title: string; locations: string[]; categories: string[] }) => {
        // For simplicity in this demo, we use the first selected item for filtering
        fetchJobs({
            title: params.title,
            location: params.locations[0],
            category: params.categories[0]
        });
    };

    // Categories are now dynamically fetched

    const filteredJobs = filter === 'Recent' ? jobs.filter(j => j.isRecent) : jobs;

    const displayJobs = filteredJobs.length > 0 || !isLoading ? filteredJobs : [
        { title: 'Senior Product Designer', company: 'Linear', location: 'Remote', type: 'Full-time', salary: '$140k - $180k', logo: '🎨', isRecent: true, deadline: '2026-04-01' },
        { title: 'Frontend Engineer (React)', company: 'Vercel', location: 'San Francisco', type: 'Full-time', salary: '$160k - $200k', logo: '▲', isRecent: false, deadline: null },
        { title: 'Lead Logistics Coordinator', company: 'Maersk', location: 'Colombo', type: 'Contract', salary: '$80k - $110k', logo: '🚢', isRecent: true, deadline: '2026-03-15' },
    ];

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
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 tracking-tighter leading-[1.1] animate-in fade-in slide-in-from-bottom-8 duration-800 text-text">
                        {/* Row 1: Logo + connect Talent with organizations, */}
                        <span className="flex items-center gap-2">
                            <img
                                src={logo}
                                alt="MSL Logo"
                                className="h-8 sm:h-12 md:h-14 lg:h-16 w-auto object-contain flex-shrink-0"
                            />
                            <span>connect <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#6366f1] via-indigo-500 to-[#f1ac29] italic font-serif">
                                Talent
                            </span> with organizations,</span>
                        </span>

                        {/* Row 2: that demand excellence. */}
                        <span className="block">
                            that <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#6366f1] via-indigo-500 to-[#f1ac29] italic font-serif">
                                demand excellence.
                            </span>
                        </span>
                    </h1>

                    <div className="search-bar-hero-container animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-300">
                        <SearchBar onSearch={handleSearch} />
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
                                <span className="font-bold text-sm tracking-[0.2em] uppercase bg-clip-text text-transparent bg-gradient-to-r from-[#6366f1] to-[#f1ac29]">
                                    Opportunity
                                </span>
                            </div>
                            <h2 className="text-5xl md:text-6xl font-bold text-text tracking-tight">
                                {isLoading ? 'Searching...' : filteredJobs.length > 0 ? 'Search Results' : 'Featured Jobs'}
                            </h2>
                            {hasError && (
                                <div className="text-red-400 mt-4 p-4 bg-red-400/10 rounded-2xl border border-white/5 max-w-2xl">
                                    <div className="font-bold flex items-center mb-1 text-sm">
                                        <span className="mr-2 text-base">⚠️</span>
                                        Connection Error
                                    </div>
                                    <p className="text-xs opacity-70 leading-relaxed italic">{errorMessage}</p>
                                </div>
                            )}
                        </div>
                        <div className="flex bg-white/5 p-1 rounded-xl border border-glass-border">
                            <button
                                onClick={() => setFilter('All')}
                                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${filter === 'All' ? 'bg-primary text-white shadow-lg' : 'text-text-dim hover:text-primary'}`}
                            >
                                All Jobs
                            </button>
                            <button
                                onClick={() => setFilter('Recent')}
                                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${filter === 'Recent' ? 'bg-primary text-white shadow-lg' : 'text-text-dim hover:text-primary'}`}
                            >
                                Recent
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {isLoading ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="h-64 glass rounded-3xl animate-pulse"></div>
                            ))
                        ) : displayJobs.length > 0 ? (
                            displayJobs.map((job, idx) => (
                                <JobCard key={idx} {...job} />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-20">
                                <span className="text-6xl mb-4 block">🔍</span>
                                <h3 className="text-2xl font-bold text-text mb-2">No jobs found</h3>
                                <p className="text-text-dim">Try adjusting your search filters or browse other categories.</p>
                            </div>
                        )}
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
