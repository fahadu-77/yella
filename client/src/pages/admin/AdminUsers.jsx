import { useState } from "react";
import { useUsers } from "../../hooks/useUsers.js";
import { useUpdateRole } from "../../hooks/useUpdateRole.js";
import { useDebounce } from "../../hooks/useDebounce.js";
import { Users, Search, ShieldAlert, UserCog } from "lucide-react";

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const debouncedSearch = useDebounce(searchTerm, 500);
  const { data: users, isPending, isError } = useUsers(debouncedSearch);
  const updateRoleMutation = useUpdateRole();

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <UserCog className="mr-3 text-primary-500" />
            User & Staff Management
          </h1>
          <p className="text-gray-500 mt-1 text-sm">Manage user roles and permissions.</p>
        </div>

        <div className="relative w-full md:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-4 py-2 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-sm shadow-sm outline-none backdrop-blur-sm"
          />
        </div>
      </div>

      {isError && (
        <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-center">
          <ShieldAlert className="mr-2" size={20} />
          Error while fetching users. Please try again.
        </div>
      )}

      <div className="glass rounded-2xl overflow-hidden shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="py-4 px-6 font-semibold text-gray-600 text-sm">Name</th>
                <th className="py-4 px-6 font-semibold text-gray-600 text-sm">Email</th>
                <th className="py-4 px-6 font-semibold text-gray-600 text-sm">Current Role</th>
                <th className="py-4 px-6 font-semibold text-gray-600 text-sm text-right">Promote To</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isPending && !users ? (
                <tr>
                  <td colSpan="4" className="py-12 text-center text-gray-500">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
                    Loading users...
                  </td>
                </tr>
              ) : users?.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 font-medium text-gray-900">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 text-primary-700 flex items-center justify-center font-bold text-xs mr-3 shrink-0">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="truncate">{user.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-600 text-sm truncate max-w-[150px]">{user.email}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${user.role === 'admin' ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                        user.role === 'staff' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                          user.role === 'delivery' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                            'bg-gray-100 text-gray-800 border border-gray-200'
                      }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <select
                      onChange={(e) =>
                        updateRoleMutation.mutate({
                          userId: user._id,
                          newRole: e.target.value,
                        })
                      }
                      value={user.role}
                      className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 px-3 py-1.5 outline-none font-medium cursor-pointer hover:bg-white transition-colors"
                      disabled={updateRoleMutation.isPending}
                    >
                      <option value="customer">Customer</option>
                      <option value="staff">Staff</option>
                      <option value="delivery">Delivery</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
              {users?.length === 0 && (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-gray-500">
                    No users found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
