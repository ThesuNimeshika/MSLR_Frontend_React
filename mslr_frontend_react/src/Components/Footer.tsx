import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-dark-bg/80 border-t border-white/5 py-12 mt-20">
            <div className="w-full px-5">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center space-x-2 mb-6">
                            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                                <span className="text-white font-bold text-lg">M</span>
                            </div>
                            <span className="text-xl font-bold text-text">MSL Recruitment</span>
                        </div>
                        <p className="text-text-dim text-sm leading-relaxed">
                            Leading the way in logistics and supply chain recruitment. Connecting talent with global leaders since 2024.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-text font-bold mb-6">Quick Links</h4>
                        <ul className="space-y-4 text-sm text-text-dim">
                            <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Career Advice</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-text font-bold mb-6">For Job Seekers</h4>
                        <ul className="space-y-4 text-sm text-text-dim">
                            <li><a href="#" className="hover:text-primary transition-colors">Browse Jobs</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Success Stories</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Interview Tips</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Portfolio Review</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-text font-bold mb-6">Connect</h4>
                        <div className="flex space-x-4 mb-6">
                            <div className="w-10 h-10 rounded-full bg-white/5 border border-glass-border flex items-center justify-center hover:bg-primary/20 hover:border-primary/50 transition-all cursor-pointer">
                                <span className="text-text">𝕏</span>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-white/5 border border-glass-border flex items-center justify-center hover:bg-primary/20 hover:border-primary/50 transition-all cursor-pointer">
                                <span className="text-text">in</span>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-white/5 border border-glass-border flex items-center justify-center hover:bg-primary/20 hover:border-primary/50 transition-all cursor-pointer">
                                <span className="text-text">f</span>
                            </div>
                        </div>
                        <p className="text-xs text-text-dim">Subscribe to our newsletter for latest job alerts.</p>
                    </div>
                </div>

                <div className="pt-8 border-t border-glass-border text-center text-xs text-text-dim">
                    &copy; {new Date().getFullYear()} MSL Recruitment Portal. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
