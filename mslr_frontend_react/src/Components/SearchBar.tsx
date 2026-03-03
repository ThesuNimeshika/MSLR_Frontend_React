import React, { useState } from 'react';

const SearchBar: React.FC = () => {
    const [showLocationDropdown, setShowLocationDropdown] = useState(false);
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
    const [selectedLocations, setSelectedLocations] = useState<string[]>([]);

    const locations = ['Remote', 'Colombo', 'Galle', 'Kandy', 'Negombo', 'Jaffna', 'New York', 'London', 'Dubai'];

    const categoriesData = [
        {
            id: 'accounting',
            label: 'Accounting',
            icon: '📂',
            subcategories: [
                'Accounts Officers/Clerks',
                'Accounts Payable',
                'Accounts Receivable/Credit Control',
                'Analysis & Reporting',
                'Assistant Accountants',
                'Audit - External',
                'Audit - Internal',
                'Bookkeeping & Small Practice Accounting',
                'Business Services & Corporate Advisory',
                'Company Secretaries',
                'Compliance & Risk',
                'Cost Accounting',
                'Financial Accounting & Reporting',
                'Financial Managers & Controllers',
                'Forensic Accounting & Investigation',
                'Insolvency & Corporate Recovery',
                'Inventory & Fixed Assets',
                'Management',
                'Management Accounting & Budgeting',
                'Payroll',
                'Strategy & Planning',
                'Systems Accounting & IT Audit',
                'Taxation',
                'Treasury'
            ]
        },
        {
            id: 'tech',
            label: 'Technology',
            icon: '💻',
            subcategories: ['Software Engineering', 'Cyber Security', 'Data Science', 'IT Support', 'Mobile Development', 'DevOps']
        },
        {
            id: 'logistics',
            label: 'Logistics',
            icon: '📦',
            subcategories: ['Supply Chain', 'Warehouse Management', 'Freight Forwarding', 'Transport', 'Lead Logistics']
        },
        {
            id: 'design',
            label: 'Design',
            icon: '🖋️',
            subcategories: ['Product Design', 'UI/UX Design', 'Graphic Design', 'Brand Identity', 'Illustration']
        },
        {
            id: 'finance',
            label: 'Finance',
            icon: '📊',
            subcategories: ['Banking', 'Investment', 'Accounting', 'Financial Analysis', 'Auditing']
        },
        {
            id: 'healthcare',
            label: 'Healthcare',
            icon: '🏥',
            subcategories: ['Nursing', 'Pharmacy', 'Clinical Research', 'Public Health', 'Radiology']
        },
        {
            id: 'marketing',
            label: 'Marketing',
            icon: '📢',
            subcategories: ['Digital Marketing', 'Content Strategy', 'Public Relations', 'SEO', 'Brand Management']
        },
    ];

    const toggleLocation = (loc: string) => {
        if (selectedLocations.includes(loc)) {
            setSelectedLocations(selectedLocations.filter(item => item !== loc));
        } else {
            setSelectedLocations([...selectedLocations, loc]);
        }
    };

    const toggleCategory = (id: string) => {
        if (selectedCategories.includes(id)) {
            setSelectedCategories(selectedCategories.filter(item => item !== id));
        } else {
            setSelectedCategories([...selectedCategories, id]);
        }
    };

    const toggleExpand = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (expandedCategories.includes(id)) {
            setExpandedCategories(expandedCategories.filter(item => item !== id));
        } else {
            setExpandedCategories([...expandedCategories, id]);
        }
    };

    const isCategorySelected = (catId: string) => {
        return selectedCategories.includes(catId);
    };

    const isSubSelected = (sub: string) => {
        return selectedCategories.includes(sub);
    };

    const handleCategoryClick = (catId: string, subcategories: string[]) => {
        const allSelected = subcategories.every(sub => selectedCategories.includes(sub));
        if (allSelected) {
            // Remove all subcategories if all are selected
            setSelectedCategories(selectedCategories.filter(item => !subcategories.includes(item) && item !== catId));
        } else {
            // Select all subcategories
            const newSelection = Array.from(new Set([...selectedCategories, ...subcategories, catId]));
            setSelectedCategories(newSelection);
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

                <div className="md:w-72 relative">
                    <div
                        className="flex items-center px-4 py-3 bg-white/5 rounded-xl border border-white/5 hover:border-primary/50 transition-all cursor-pointer h-full"
                        onClick={() => {
                            setShowCategoryDropdown(!showCategoryDropdown);
                            setShowLocationDropdown(false);
                        }}
                    >
                        <span className="text-text-dim mr-3">📁</span>
                        <span className="text-sm text-text overflow-hidden whitespace-nowrap overflow-ellipsis flex-1">
                            {selectedCategories.length > 0
                                ? `${selectedCategories.length} selected`
                                : 'Categories'}
                        </span>
                        <span className="text-text-dim text-xs ml-2">{showCategoryDropdown ? '▲' : '▼'}</span>
                    </div>

                    {showCategoryDropdown && (
                        <div className="absolute top-full left-0 w-80 mt-2 glass rounded-xl border-white/10 overflow-hidden shadow-2xl z-30 max-h-[450px] overflow-y-auto p-3 animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="flex justify-between items-center mb-3 px-1">
                                <span className="text-xs font-bold text-text-dim uppercase tracking-wider">Classification</span>
                                {selectedCategories.length > 0 && (
                                    <button
                                        onClick={() => setSelectedCategories([])}
                                        className="text-[10px] text-primary hover:underline font-bold"
                                    >
                                        Clear all
                                    </button>
                                )}
                            </div>
                            {categoriesData.map(cat => (
                                <div key={cat.id} className="mb-1">
                                    <div
                                        className={`flex items-center px-3 py-2.5 hover:bg-white/5 rounded-lg cursor-pointer transition-all group ${expandedCategories.includes(cat.id) ? 'bg-white/5' : ''}`}
                                        onClick={() => toggleExpand(cat.id, { stopPropagation: () => { } } as any)}
                                    >
                                        <div
                                            className={`w-4 h-4 rounded border flex items-center justify-center mr-3 transition-all ${isCategorySelected(cat.id) ? 'bg-primary border-primary' : 'border-white/20'}`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleCategoryClick(cat.id, cat.subcategories);
                                            }}
                                        >
                                            {isCategorySelected(cat.id) && <span className="text-[10px] text-white">✓</span>}
                                        </div>
                                        <span className="mr-2 text-base">{cat.icon}</span>
                                        <span className={`text-sm flex-1 ${isCategorySelected(cat.id) ? 'text-text font-bold' : 'text-text-dim'}`}>{cat.label}</span>
                                        <span className="text-[10px] text-text-dim ml-2 transition-transform duration-300" style={{ transform: expandedCategories.includes(cat.id) ? 'rotate(180deg)' : 'rotate(0)' }}>▼</span>
                                    </div>

                                    {expandedCategories.includes(cat.id) && (
                                        <div className="ml-9 mt-1 space-y-1 animate-in slide-in-from-top-1 duration-200">
                                            {cat.subcategories.map(sub => (
                                                <div
                                                    key={sub}
                                                    className="flex items-center justify-start text-left px-3 py-2 hover:bg-white/5 rounded-lg cursor-pointer transition-colors"
                                                    onClick={() => toggleCategory(sub)}
                                                >
                                                    <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center mr-3 transition-all ${isSubSelected(sub) ? 'bg-primary border-primary' : 'border-white/20'}`}>
                                                        {isSubSelected(sub) && <span className="text-[8px] text-white">✓</span>}
                                                    </div>
                                                    <span className={`text-xs ${isSubSelected(sub) ? 'text-text font-medium' : 'text-text-dim'}`}>{sub}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
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
                            {selectedLocations.length > 0 ? selectedLocations.join(', ') : 'Anywhere'}
                        </span>
                        <span className="text-text-dim text-xs ml-2">▼</span>
                    </div>

                    {showLocationDropdown && (
                        <div className="absolute top-full left-0 w-full mt-2 glass rounded-xl border-white/10 overflow-hidden shadow-2xl z-30 max-h-60 overflow-y-auto p-2 animate-in fade-in slide-in-from-top-2 duration-200">
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
