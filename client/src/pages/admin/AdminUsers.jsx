import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ['admin', 'users', searchTerm],
    queryFn: () => api.get(`/admin/users?search=${searchTerm}`).then(res => res.data),
    enabled: true, 
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, newRole }) => 
      api.patch(`/admin/users/${userId}/role`, { role: newRole }),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin', 'users']);
    }
  });

  if (isLoading) return <div>Searching Users...</div>;

  return (
    <div>
      <h1>User & Staff Management</h1>

      <div style={styles.searchContainer}>
        <input 
          type="text" 
          placeholder="Search by name or email..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Current Role</th>
            <th>Promote To</th>
          </tr>
        </thead>
        <tbody>
          {users?.map(user => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td><strong>{user.role.toUpperCase()}</strong></td>
              <td>
                <select 
                  onChange={(e) => updateRoleMutation.mutate({ userId: user._id, newRole: e.target.value })}
                  value={user.role}
                >
                  <option value="customer">Customer</option>
                  <option value="staff">Staff</option>
                  <option value="delivery">Delivery</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  searchContainer: { marginBottom: '20px' },
  searchInput: { padding: '10px', width: '300px', borderRadius: '5px', border: '1px solid #ccc' },
  table: { width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' },
};

export default AdminUsers;