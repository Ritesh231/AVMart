import React from 'react';

const Orderstats = ({ title, number, statement, icon, variant = 'normal' }) => {

  const specialStyles =
    "bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-500 text-white";

  const normalStyles =
    "bg-slate-50 text-slate-900 border border-slate-200";

  return (
    <div
      className={`relative flex flex-col justify-between p-5 rounded-2xl w-full min-h-[160px] shadow-sm transition-transform hover:scale-[1.02]
      ${variant === 'special' ? specialStyles : normalStyles}`}
    >

      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <span
            className={`h-2.5 w-2.5 rounded-full 
            ${variant === 'special' ? 'bg-white' : 'bg-slate-900'}`}
          />
          <h3 className="text-lg font-medium opacity-90">{title}</h3>
        </div>

        {/* Icon */}
        <div
          className={`flex items-center justify-center h-12 w-12 rounded-full shadow-inner
          ${variant === 'special'
            ? 'bg-white text-slate-900'
            : 'bg-slate-900 text-white'
          }`}
        >
          {icon}
        </div>
      </div>

      {/* Content */}
      <div className="mt-4">
        <h3 className="text-5xl font-bold tracking-tight">{number}</h3>
        <p
          className={`mt-3 text-xs font-semibold
          ${variant === 'special' ? 'text-white/80' : 'text-slate-600'}`}
        >
          {statement}
        </p>
      </div>

    </div>
  );
};

export default Orderstats;
