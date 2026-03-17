import React, { useState, useEffect } from 'react';
import { Activity, AlertCircle, BarChart3, Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockData = [
  { time: '12:00', invocations: 45 },
  { time: '12:05', invocations: 52 },
  { time: '12:10', invocations: 48 },
  { time: '12:15', invocations: 61 },
  { time: '12:20', invocations: 55 },
  { time: '12:25', invocations: 67 },
];

const StatCard = ({ title, value, icon: Icon, color }: any) => (
  <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl backdrop-blur-sm">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-slate-400 text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
      </div>
      <div className={`p-2 rounded-lg bg-slate-800 ${color}`}>
        <Icon size={20} />
      </div>
    </div>
  </div>
);

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold">Network Overview</h2>
          <p className="text-slate-400 mt-1">Real-time health of your Soroban contracts.</p>
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-bold flex items-center gap-1">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            LIVE
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Invocations" value="12.4k" icon={Activity} color="text-blue-400" />
        <StatCard title="Error Rate" value="0.2%" icon={AlertCircle} color="text-emerald-400" />
        <StatCard title="Avg. CPU usage" value="1.2M" icon={BarChart3} color="text-purple-400" />
        <StatCard title="Next TTL Expiry" value="12h" icon={Clock} color="text-orange-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 p-6 rounded-xl h-[400px]">
          <h3 className="text-lg font-semibold mb-6">Invocation Volume</h3>
          <ResponsiveContainer width="100%" height="90%">
            <LineChart data={mockData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }}
                itemStyle={{ color: '#fff' }}
              />
              <Line type="monotone" dataKey="invocations" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl">
          <h3 className="text-lg font-semibold mb-4">Live Incident Feed</h3>
          <div className="space-y-4">
            {[1,2,3].map(i => (
              <div key={i} className="flex gap-4 p-3 border-l-2 border-emerald-500 bg-emerald-500/5 rounded-r-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium">Successful swap</p>
                  <p className="text-xs text-slate-500 mt-1">Contract: CA...123 • 2m ago</p>
                </div>
                <span className="text-[10px] bg-slate-800 px-2 py-1 rounded h-fit">200ms</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
