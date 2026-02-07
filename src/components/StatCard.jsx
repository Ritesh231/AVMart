import React from 'react';

const StatCard = ({ title, number, statement, icon, variant = 'normal' }) => {
    // Styles for the "Special" Gradient Card
    const specialStyles = "bg-gradient-to-br from-[#1E294B] via-[#1E294B] to-[#49D1B1] text-white";
     
    // Styles for the "Normal" Light Card
    const normalStyles = "bg-brand-soft text-brand-navy border border-transparent";
    
    return (
        <div className={`relative flex flex-col justify-between p-5 rounded-2xl w-full min-h-[160px] shadow-sm transition-transform hover:scale-[1.02] ${variant === 'special' ? specialStyles : normalStyles}`}>

            {/* Header: Dot + Title + Icon */}
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${variant === 'special' ? 'bg-white' : 'bg-brand-navy'}`}></span>
                    <h3 className="text-lg font-medium opacity-90">{title}</h3>
                </div>

                {/* Icon Circle */}
                <div className={`flex items-center justify-center h-12 w-12 rounded-full shadow-inner 
          ${variant === 'special' ? 'bg-white text-brand-navy' : 'bg-brand-navy text-white'}`}>
                    {icon}
                </div>
            </div>

            {/* Content: Number + Statement */}
            <div className="mt-4">
                <h3 className="text-5xl font-bold tracking-tight">{number}</h3>
                <p className={`mt-3 text-xs font-semibold ${variant === 'special' ? 'text-white/80' : 'text-brand-navy/70'}`}>
                    {statement}
                </p>
            </div>
        </div>
    );
};

export default StatCard;