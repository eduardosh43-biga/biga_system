import React from 'react';

const CategoryTabs = ({ tabs, activeCategory, setActiveCategory }) => {
    return (
        <div className="flex items-center gap-1.5 overflow-x-auto lg:overflow-visible pb-2 no-scrollbar">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveCategory(tab.id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black text-xs uppercase tracking-widest transition-all whitespace-nowrap
            ${activeCategory === tab.id    
                            ? "bg-slate-800 text-white shadow-lg scale-105"
                            : "bg-white text-gray-400 hover:bg-gray-50 border-2 border-transparent"
                        }`}
                >
                    {tab.icon}
                    {tab.label}
                </button>
            ))}
        </div>
    );
};

export default CategoryTabs;