import React from 'react'

const DetailCard = ({ title, value, icon }) => (
  <div className="bg-white p-3 rounded-xl border border-emerald-50 flex items-center gap-4 hover:shadow-md transition-shadow">
    <span className="text-2xl">{icon}</span>
    <div>
      <h3 className="text-sm text-gray-500 mb-1">{title}</h3>
      <p className="font-semibold text-gray-800 capitalize">
        {value || 'Not specified'}
      </p>
    </div>
  </div>
);

export default DetailCard