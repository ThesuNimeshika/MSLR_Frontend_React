import React from 'react';

interface CompanyCardProps {
    name: string;
    jobs: number;
    logo: string;
}

const CompanyCard: React.FC<CompanyCardProps> = ({ name, jobs, logo }) => {
    return (
        <div className="glass p-6 rounded-2xl border-white/5 hover:bg-white/5 transition-all flex items-center space-x-4 cursor-pointer group">
            <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center p-2 group-hover:scale-105 transition-all">
                <span className="text-2xl">{logo}</span>
            </div>
            <div>
                <h4 className="text-text font-bold group-hover:text-primary transition-colors">{name}</h4>
                <p className="text-text-dim text-xs">{jobs} Jobs Available</p>
            </div>
        </div>
    );
};

export default CompanyCard;
