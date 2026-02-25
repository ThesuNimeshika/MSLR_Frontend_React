import React, { useState } from 'react';

const SearchBar: React.FC = () => {
    const [showLocationDropdown, setShowLocationDropdown] = useState(false);
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedLocations, setSelectedLocations] = useState<string[]>([]);

    const locations = ['Remote', 'Colombo', 'Galle', 'Kandy', 'Negombo', 'Jaffna', 'New York', 'London', 'Dubai'];

    const categories = [
        { id: 'tech', label: 'Technology', icon: '💻' },
        { id: 'logistics', label: 'Logistics', icon: '📦' },
        { id: 'design', label: 'Design', icon: '🖋️' },
        { id: 'finance', label: 'Finance', icon: '📊' },
        { id: 'healthcare', label: 'Healthcare', icon: '🏥' },
        { id: 'marketing', label: 'Marketing', icon: '📢' },
    ];

    const toggleLocation = (loc: string) => {
        if (selectedLocations.includes(loc)) {
            setSelectedLocations(selectedLocations.filter(item => item !== loc));
        } else {
            setSelectedLocations([...selectedLocations, loc]);
        }
    };

    return (
        <div className="relative z-10 w-full px-5">
            <div className="glass p-2 rounded-2xl flex flex-col md:flex-row gap-2 shadow-2xl shadow-black/50 border-white/10">
                <div className="flex-1 flex items-center px-4 py-3 bg-white/5 rounded-xl border border-white/5 focus-within:border-primary/50 transition-all">
                    <span className="text-text-dim mr-3">🔍</span>
                    <input
                        type="text"
                        placeholder="Job title, keywords, or company"
                        className="bg-transparent border-none outline-none text-text w-full text-sm placeholder:text-text-dim"
                    />
                </div>

                <div className="md:w-64 relative">
                    <div
                        className="flex items-center px-4 py-3 bg-white/5 rounded-xl border border-white/5 hover:border-primary/50 transition-all cursor-pointer h-full"
                        onClick={() => {
                            setShowCategoryDropdown(!showCategoryDropdown);
                            setShowLocationDropdown(false);
                        }}
                    >
                        <span className="text-text-dim mr-3">📁</span>
                        <span className="text-sm text-text overflow-hidden whitespace-nowrap overflow-ellipsis flex-1">
                            {selectedCategory ? categories.find(c => c.id === selectedCategory)?.label : 'Categories'}
                        </span>
                        <span className="text-text-dim text-xs ml-2">{showCategoryDropdown ? '▲' : '▼'}</span>
                    </div>

                    {showCategoryDropdown && (
                        <div className="absolute top-full left-0 w-full mt-2 glass rounded-xl border-white/10 overflow-hidden shadow-2xl z-20 max-h-60 overflow-y-auto p-2 animate-in fade-in slide-in-from-top-2 duration-200">
                            {categories.map(cat => (
                                <div
                                    key={cat.id}
                                    className={`flex items-center px-3 py-2.5 hover:bg-white/5 rounded-lg cursor-pointer transition-all group ${selectedCategory === cat.id ? 'bg-primary/10 border-l-2 border-primary' : ''}`}
                                    onClick={() => {
                                        setSelectedCategory(cat.id);
                                        setShowCategoryDropdown(false);
                                    }}
                                >
                                    <span className="mr-3 text-lg group-hover:scale-110 transition-transform">{cat.icon}</span>
                                    <span className={`text-sm ${selectedCategory === cat.id ? 'text-primary font-bold' : 'text-text-dim hover:text-text'}`}>{cat.label}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="md:w-64 relative">
                    <div
                        className="flex items-center px-4 py-3 bg-white/5 rounded-xl border border-white/5 hover:border-primary/50 transition-all cursor-pointer h-full"
                        onClick={() => {
                            setShowLocationDropdown(!showLocationDropdown);
                            setShowCategoryDropdown(false);
                        }}
                    >
                        <span className="text-text-dim mr-3">📍</span>
                        <span className="text-sm text-text overflow-hidden whitespace-nowrap overflow-ellipsis flex-1">
                            {selectedLocations.length > 0 ? selectedLocations.join(', ') : 'Location'}
                        </span>
                        <span className="text-text-dim text-xs ml-2">▼</span>
                    </div>

                    {showLocationDropdown && (
                        <div className="absolute top-full left-0 w-full mt-2 glass rounded-xl border-white/10 overflow-hidden shadow-2xl z-20 max-h-60 overflow-y-auto p-2 animate-in fade-in slide-in-from-top-2 duration-200">
                            {locations.map(loc => (
                                <div
                                    key={loc}
                                    className="flex items-center px-3 py-2 hover:bg-white/5 rounded-lg cursor-pointer transition-colors"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleLocation(loc);
                                    }}
                                >
                                    <div className={`w-4 h-4 rounded border flex items-center justify-center mr-3 transition-all ${selectedLocations.includes(loc) ? 'bg-primary border-primary' : 'border-white/20'
                                        }`}>
                                        {selectedLocations.includes(loc) && <span className="text-[10px] text-white">✓</span>}
                                    </div>
                                    <span className="text-sm text-text-dim hover:text-white">{loc}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <button className="bg-primary hover:bg-indigo-500 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-primary/20 transition-all whitespace-nowrap active:scale-95">
                    Search Jobs
                </button>
            </div>
        </div>
    );
};

export default SearchBar;
