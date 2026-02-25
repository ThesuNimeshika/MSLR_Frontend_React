import React from 'react';

interface CategoryCardProps {
    title: string;
    count: string;
    icon: string;
    color: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ title, count, icon, color }) => {
    return (
        <div className="glass p-6 rounded-2xl text-center group cursor-pointer hover:-translate-y-2 transition-all duration-300 shadow-sm hover:shadow-xl bg-white/40 dark:bg-card-bg">
            <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-4 mx-auto transition-all group-hover:scale-110 group-hover:rotate-3 shadow-inner"
                style={{ backgroundColor: `${color}15`, border: `1px solid ${color}30` }}
            >
                {icon}
            </div>
            <h3 className="text-text font-bold mb-1 font-outfit text-lg tracking-tight group-hover:text-primary transition-colors">{title}</h3>
            <p className="text-text-dim text-xs font-medium">{count} Open Positions</p>

            <div className="mt-4 w-8 h-1 bg-primary/20 mx-auto rounded-full group-hover:w-16 transition-all duration-500"></div>
        </div>
    );
};

export default CategoryCard;
