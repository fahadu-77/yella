'use client';

import { useState, useEffect } from 'react';
import { User, Shield, Check, X, ArrowUpRight, Search, Loader2 } from 'lucide-react';

export default function UserManagementPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL'); // ALL, REQUESTS

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/users');
            const data = await res.json();
            if (res.ok) setUsers(data);
        } catch (err) { } finally { setLoading(false); }
    };

    useEffect(() => { fetchUsers(); }, []);

    const handleAction = async (userId, role) => {
        try {
            const res = await fetch('/api/users', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, role }),
            });
            if (res.ok) fetchUsers();
        } catch (err) { }
    };

    const filteredUsers = users.filter(u =>
        filter === 'ALL' ? true : u.isStaffRequested
    );

    if (loading) return (
        <div className="h-full flex flex-col items-center justify-center p-20 gap-4">
            <Loader2 className="animate-spin text-[var(--primary)]" size={40} />
            <p className="text-zinc-500 italic uppercase font-black text-xs tracking-widest">Scanning Identities...</p>
        </div>
    );

    const pendingCount = users.filter(u => u.isStaffRequested).length;

    return (
        <div className="flex flex-col gap-10">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-4xl font-black italic uppercase tracking-tighter">Identity <span className="neon-text">Matrix</span></h1>
                    <p className="text-zinc-500 mt-2 font-medium">Manage permissions and authorize elite staff.</p>
                </div>
                <div className="flex bg-zinc-900 p-1 rounded-2xl border border-zinc-800">
                    <button
                        onClick={() => setFilter('ALL')}
                        className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === 'ALL' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}
                    >
                        All Users
                    </button>
                    <button
                        onClick={() => setFilter('REQUESTS')}
                        className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all relative ${filter === 'REQUESTS' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}
                    >
                        Staff Requests
                        {pendingCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-[8px] border-2 border-zinc-950">
                                {pendingCount}
                            </span>
                        )}
                    </button>
                </div>
            </header>

            <div className="glass-card !p-0 overflow-hidden border border-zinc-900 rounded-[2rem]">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-zinc-900/50 text-zinc-600 text-[10px] font-black uppercase tracking-widest border-b border-zinc-900">
                            <tr>
                                <th className="p-6">User Identity</th>
                                <th className="p-6">Current Access</th>
                                <th className="p-6">Request Status</th>
                                <th className="p-6 text-right">Authorization</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-900">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-zinc-900/40 transition-colors group">
                                    <td className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center text-zinc-600 border border-zinc-800 group-hover:text-[var(--primary)] transition-colors">
                                                <User size={24} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-black truncate max-w-[150px]">{user.name || 'Anonymous'}</span>
                                                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">{user.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ${user.role === 'ADMIN' ? 'bg-purple-900/20 text-purple-400' :
                                                user.role === 'STAFF' ? 'bg-yellow-900/20 text-yellow-500' :
                                                    'bg-zinc-800 text-zinc-400'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="p-6">
                                        {user.isStaffRequested && user.role === 'CUSTOMER' ? (
                                            <div className="flex flex-col gap-1">
                                                <span className="text-red-500 text-[10px] font-black uppercase flex items-center gap-1">
                                                    <ArrowUpRight size={12} /> Pending Request
                                                </span>
                                                <span className="text-zinc-600 text-[9px] italic font-medium">Applied {new Date(user.staffRequestDate).toLocaleDateString()}</span>
                                            </div>
                                        ) : (
                                            <span className="text-zinc-600 text-[10px] font-bold uppercase italic">Clear</span>
                                        )}
                                    </td>
                                    <td className="p-6 text-right">
                                        <div className="flex justify-end gap-2">
                                            {user.role === 'CUSTOMER' && (
                                                <button
                                                    onClick={() => handleAction(user.id, 'STAFF')}
                                                    className="bg-white text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[var(--primary)] transition-all flex items-center gap-2"
                                                >
                                                    <Shield size={14} /> Promote
                                                </button>
                                            )}
                                            {user.role === 'STAFF' && (
                                                <button
                                                    onClick={() => handleAction(user.id, 'CUSTOMER')}
                                                    className="border border-zinc-800 text-zinc-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-900/20 hover:text-red-500 transition-all"
                                                >
                                                    Demote
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {!filteredUsers.length && (
                        <div className="p-20 text-center opacity-10 font-black uppercase text-4xl italic">No Identities</div>
                    )}
                </div>
            </div>
        </div>
    );
}
