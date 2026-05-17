"use client";

import { motion } from "framer-motion";
import { Activity, Users, Settings, Database } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 flex justify-between items-end"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-600 mt-2">System overview and management.</p>
        </div>
        <button className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
          Generate Report
        </button>
      </motion.div>

      <div className="grid md:grid-cols-4 gap-6 mb-10">
        {[
          { title: "System Status", value: "Healthy", icon: <Activity size={20} className="text-emerald-600" /> },
          { title: "Active Doctors", value: "45", icon: <Users size={20} className="text-blue-600" /> },
          { title: "Redis Cache Hits", value: "98.2%", icon: <Database size={20} className="text-indigo-600" /> },
          { title: "AI API Latency", value: "240ms", icon: <Settings size={20} className="text-purple-600" /> },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6 flex flex-col"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-sm font-medium text-slate-500">{stat.title}</h3>
              <div className="p-2 bg-slate-50 rounded-lg">{stat.icon}</div>
            </div>
            <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="glass-panel p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-6">Doctor Management</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 uppercase">
              <tr>
                <th className="px-6 py-3 rounded-tl-lg">Doctor Name</th>
                <th className="px-6 py-3">Specialty</th>
                <th className="px-6 py-3">Patients</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 rounded-tr-lg">Action</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">Dr. Sarah Jenkins</td>
                  <td className="px-6 py-4">Cardiology</td>
                  <td className="px-6 py-4">124</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">Active</span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-primary-600 hover:text-primary-800 font-medium">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
