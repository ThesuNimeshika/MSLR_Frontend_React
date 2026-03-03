import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    return (
        <header className="fixed top-0 left-0 w-full z-50 glass py-5 border-b border-white/5">
            <div className="max-w-[1700px] mx-auto px-8 flex justify-between items-center">
                <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => navigate('/')}>
                    <div className="w-11 h-11 bg-gradient-to-br from-primary via-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-primary/20 transform group-hover:rotate-6 transition-all duration-300">
                        <span className="text-white font-black text-2xl">M</span>
                    </div>
                    <div className="flex flex-col -space-y-1">
                        <span className="text-2xl font-black tracking-tighter text-text">
                            MSL<span className="text-primary">R</span>
                        </span>
                        <span className="text-[10px] font-bold tracking-[0.3em] text-primary/80 uppercase">Recruitment</span>
                    </div>
                </div>

                <nav className="hidden lg:flex items-center space-x-10 text-sm font-bold tracking-widest">
                    <Link to="/" className="text-primary relative after:absolute after:bottom-[-8px] after:left-0 after:w-full after:h-0.5 after:bg-primary transition-all">HOME</Link>
                    <a href="#" className="text-text-dim hover:text-text transition-all hover:-translate-y-0.5">JOBS</a>
                    <a href="#" className="text-text-dim hover:text-text transition-all hover:-translate-y-0.5">RESOURCES</a>
                    <a href="#" className="text-text-dim hover:text-text transition-all hover:-translate-y-0.5">CONTACT</a>
                </nav>

                <div className="hidden md:flex items-center space-x-8">
                    <button
                        onClick={toggleTheme}
                        className="p-3 rounded-2xl bg-white/5 border border-white/10 text-xl hover:bg-white/10 hover:border-white/20 transition-all active:scale-90"
                        title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    >
                        {theme === 'dark' ? '✨' : '🌙'}
                    </button>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => navigate('/recruiter-guide')}
                            className="px-5 py-3 text-sm font-bold text-text-dim hover:text-text transition-all rounded-xl hover:bg-white/5 cursor-pointer"
                        >
                            Post a Job
                        </button>
                        <button
                            onClick={() => navigate('/discover-me')}
                            className="px-6 py-3 text-sm font-bold text-text hover:text-primary transition-all rounded-xl hover:bg-white/5"
                        >
                            Discover ME
                        </button>
                        <button
                            onClick={() => navigate('/login')}
                            className="px-8 py-3.5 bg-primary hover:bg-indigo-500 text-white text-sm font-black rounded-2xl shadow-2xl shadow-primary/40 transition-all transform hover:-translate-y-1 active:translate-y-0 hover:scale-[1.02]"
                        >
                            Candidate Portal
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-text p-2"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <span className="text-2xl">{isMenuOpen ? '✕' : '☰'}</span>
                </button>
            </div>

            {/* Mobile Navigation Drawer */}
            <div className={`md:hidden absolute top-full left-0 w-full glass border-t border-glass-border transition-all duration-300 overflow-hidden ${isMenuOpen ? 'max-h-96 py-6 opacity-100' : 'max-h-0 py-0 opacity-0'}`}>
                <nav className="flex flex-col items-center space-y-6">
                    <a href="#" className="text-text text-lg font-medium hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>HOME</a>
                    <a href="#" className="text-text-dim text-lg font-medium hover:text-text transition-colors" onClick={() => setIsMenuOpen(false)}>JOBS</a>
                    <a href="#" className="text-text-dim text-lg font-medium hover:text-text transition-colors" onClick={() => setIsMenuOpen(false)}>CONTACT US</a>
                    <div className="flex flex-col w-full px-6 space-y-4 pt-4 border-t border-glass-border">
                        <button
                            onClick={() => { navigate('/discover-me'); setIsMenuOpen(false); }}
                            className="w-full py-3 text-text font-semibold rounded-xl border border-glass-border"
                        >
                            Discover ME
                        </button>
                        <button
                            onClick={() => { navigate('/recruiter-guide'); setIsMenuOpen(false); }}
                            className="w-full py-3 text-text font-semibold rounded-xl border border-glass-border"
                        >
                            Recruiter Login
                        </button>
                        <button
                            onClick={() => { navigate('/login'); setIsMenuOpen(false); }}
                            className="w-full py-3 bg-primary text-white font-bold rounded-xl shadow-lg"
                        >
                            Job Seeker Login
                        </button>
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Header;
