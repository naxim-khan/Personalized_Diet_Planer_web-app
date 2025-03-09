import React from 'react'

const DetailCard = ({ title, value, icon }) => (
  <div className="group bg-white p-2.5 rounded-lg border border-emerald-50 hover:border-emerald-100 transition-all duration-200 hover:shadow-sm flex items-center gap-3 hover:-translate-y-0.5">
    <div className="min-w-[36px] h-9 flex items-center justify-center rounded-lg bg-emerald-100/50 text-emerald-700">
      <span className="text-xl transition-transform group-hover:scale-110">{icon}</span>
    </div>
    <div className="flex-1 min-w-0">
      <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">
        {title}
      </h3>
      <p className="text-sm font-medium text-gray-700 truncate">
        {value || 'Not specified'}
      </p>
    </div>
  </div>
);

export default DetailCard