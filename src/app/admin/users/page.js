'use client';

import { useState, useEffect } from 'react';

export default function UserManagementPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        const res = await fetch('/api/users');
        const data = await res.json();
        if (res.ok) setUsers(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleRoleChange = async (userId, newRole) => {
        const res = await fetch('/api/users', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, role: newRole }),
        });

        if (res.ok) {
            setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
        }
    };

    if (loading) return <div>Loading users...</div>;

    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-4xl font-bold">User Management</h1>
                <p className="text-zinc-500 mt-2">Promote customers to staff or manage permissions.</p>
            </div>

            <div className="glass-card !p-0 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-zinc-900 border-b border-zinc-800">
                        <tr>
                            <th className="p-4 font-semibold">User</th>
                            <th className="p-4 font-semibold">Email</th>
                            <th className="p-4 font-semibold">Current Role</th>
                            <th className="p-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="border-b border-zinc-900 hover:bg-zinc-950 transition-colors">
                                <td className="p-4">{user.name || 'No Name'}</td>
                                <td className="p-4 text-zinc-400">{user.email}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${user.role === 'ADMIN' ? 'bg-purple-900 text-purple-200' :
                                            user.role === 'STAFF' ? 'bg-yellow-900 text-yellow-200' :
                                                'bg-zinc-800 text-zinc-300'
                                        }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="p-4 text-right flex justify-end gap-2">
                                    <button
                                        onClick={() => handleRoleChange(user.id, 'CUSTOMER')}
                                        className={`text-xs px-2 py-1 rounded ${user.role === 'CUSTOMER' ? 'bg-zinc-700' : 'bg-transparent border border-zinc-700 hover:bg-zinc-900'}`}
                                    >
                                        Set Customer
                                    </button>
                                    <button
                                        onClick={() => handleRoleChange(user.id, 'STAFF')}
                                        className={`text-xs px-2 py-1 rounded ${user.role === 'STAFF' ? 'bg-yellow-600' : 'bg-transparent border border-yellow-600 hover:bg-zinc-900 text-yellow-600'}`}
                                    >
                                        Promote to Staff
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
