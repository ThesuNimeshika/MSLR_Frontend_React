import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();

    return (
        <header className="fixed top-0 left-0 w-full z-50 glass py-4">
            <div className="w-full px-5 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-indigo-400 rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
                        <span className="text-white font-bold text-xl">M</span>
                    </div>
                    <span className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-text to-text-dim transition-colors">
                        MSL<span className="text-primary">R</span>
                    </span>
                </div>

                <nav className="hidden md:flex space-x-8 text-sm font-medium">
                    <a href="#" className="text-text hover:text-primary transition-colors">HOME</a>
                    <a href="#" className="text-text-dim hover:text-primary transition-colors">JOBS</a>
                    <a href="#" className="text-text-dim hover:text-primary transition-colors">CONTACT US</a>
                </nav>

                <div className="hidden md:flex items-center space-x-6">
                    <button
                        onClick={toggleTheme}
                        className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-xl hover:bg-white/10 transition-all active:scale-95"
                        title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    >
                        {theme === 'dark' ? '☀️' : '🌙'}
                    </button>
                    <div className="flex items-center space-x-4">
                        <button className="px-5 py-2 text-sm font-semibold text-text-dim hover:text-text transition-colors cursor-pointer">
                            Recruiter Login
                        </button>
                        <button className="px-6 py-2.5 bg-primary hover:bg-indigo-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5 active:translate-y-0">
                            Job Seeker Login
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
                        <button className="w-full py-3 text-text font-semibold rounded-xl border border-glass-border">
                            Recruiter Login
                        </button>
                        <button className="w-full py-3 bg-primary text-white font-bold rounded-xl shadow-lg">
                            Job Seeker Login
                        </button>
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Header;
