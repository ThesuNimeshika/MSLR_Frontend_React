import React from 'react';

interface JobCardProps {
    title: string;
    company: string;
    location: string;
    type: string;
    salary: string;
    logo: string;
    isRecent?: boolean;
}

const JobCard: React.FC<JobCardProps> = ({ title, company, location, type, salary, logo, isRecent }) => {
    return (
        <div className="glass p-6 rounded-2xl hover:border-primary/50 transition-all group cursor-pointer relative overflow-hidden bg-white/50 dark:bg-card-bg shadow-sm hover:shadow-xl hover:-translate-y-1">
            {isRecent && (
                <div className="absolute top-0 right-0 bg-accent text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg shadow-sm">
                    NEW
                </div>
            )}
            <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20 group-hover:border-primary/40 transition-all">
                    <span className="text-2xl">{logo}</span>
                </div>
                <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/10">
                    {type}
                </span>
            </div>

            <h3 className="text-text font-bold text-lg mb-1 group-hover:text-primary transition-colors tracking-tight">{title}</h3>
            <p className="text-text-dim text-sm mb-4 font-medium">{company}</p>

            <div className="flex items-center gap-4 text-xs text-text-dim">
                <div className="flex items-center gap-1 bg-text-dim/5 px-2 py-1 rounded-md">
                    <span>📍</span> {location}
                </div>
                <div className="flex items-center gap-1 bg-text-dim/5 px-2 py-1 rounded-md">
                    <span>💰</span> {salary}
                </div>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-glass-border pt-4">
                <button className="text-primary text-sm font-bold opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 flex items-center gap-1">
                    Apply Now <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>
                <span className="text-[10px] text-text-dim font-medium italic">2 hours ago</span>
            </div>

            {/* Subtle light mode glow */}
            <div className="absolute -bottom-2 -right-2 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all"></div>
        </div>
    );
};

export default JobCard;
