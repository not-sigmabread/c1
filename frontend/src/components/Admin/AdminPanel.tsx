import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { User, UserRole } from '../../../../shared/types/user.types';

export const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const updateUserRole = async (userId: string, newRole: UserRole) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  // Only render if user is owner (sigmabread)
  if (user?.username !== 'sigmabread') {
    return <div>Access denied</div>;
  }

  return (
    <div className="admin-panel">
      <h2>Admin Panel</h2>
      <div className="users-list">
        {users.map(user => (
          <div key={user.id} className="user-item">
            <span>{user.username}</span>
            <select
              value={user.role}
              onChange={(e) => updateUserRole(user.id, e.target.value as UserRole)}
              disabled={user.username === 'sigmabread'}
            >
              {Object.values(UserRole).map(role => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};
