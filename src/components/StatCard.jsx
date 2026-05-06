import React from 'react';

const StatCard = ({ title, number, statement, icon, variant = 'normal', onClick, className }) => {
    // Styles for the "Special" Gradient Card
    const specialStyles = "bg-[#1E294B] text-white overflow-hidden";

    // Styles for the "Normal" Light Card
    const normalStyles = "bg-brand-blue/50 text-brand-navy border border-transparent";

    return (
        <div
            onClick={onClick}
            className={`relative pointer-events-auto z-10 flex flex-col justify-between p-5 rounded-2xl w-full min-h-[160px] shadow-sm transition-transform hover:scale-[1.02] 
    ${variant === 'special' ? specialStyles : normalStyles} 
    ${className || ""} 
    ${onClick ? "cursor-pointer" : ""}`}
        >

            {/* Glow */}
            {variant === 'special' && (
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[#FF8800]/60 rounded-full blur-[60px]"></div>
            )}

            {/* Content Wrapper */}
            <div className="relative z-10 flex flex-col justify-between h-full">

                {/* Header */}
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${variant === 'special' ? 'bg-white' : 'bg-brand-navy'}`}></span>
                        <h3 className="text-lg font-medium opacity-90">{title}</h3>
                    </div>

                    <div className={`flex items-center justify-center h-12 w-12 rounded-full shadow-inner 
            ${variant === 'special' ? 'bg-white text-brand-navy' : 'bg-brand-navy text-white'}`}>
                        {icon}
                    </div>
                </div>

                {/* Content */}
                <div className="mt-4">
                    <h3 className="text-4xl font-bold tracking-tight">{number}</h3>
                    <p className={`mt-3 text-xs font-semibold ${variant === 'special' ? 'text-white/80' : 'text-brand-navy/70'}`}>
                        {statement}
                    </p>
                </div>

            </div>
        </div>
    );
};

export default StatCard;