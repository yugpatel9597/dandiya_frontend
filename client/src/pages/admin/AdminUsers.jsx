import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsers, deleteUser } from '../../redux/slices/adminSlice';
import LoadingSpinner from '../../components/LoadingSpinner';
import { FiTrash2, FiUser } from 'react-icons/fi';

const AdminUsers = () => {
    const dispatch = useDispatch();
    const { users, loading, total, pages } = useSelector((state) => state.admin);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => { dispatch(fetchAllUsers({ page: currentPage, pageSize: 20 })); }, [dispatch, currentPage]);

    const handleDelete = (id, name) => {
        if (!window.confirm(`Delete user "${name}"?`)) return;
        dispatch(deleteUser(id));
    };

    return (
        <div className="space-y-5 animate-fade-in">
            <div>
                <h1 className="text-xl font-bold text-white">Users</h1>
                <p className="text-sm text-gray-400">{total} registered users</p>
            </div>

            {loading ? <LoadingSpinner /> : (
                <div className="card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-800 text-gray-400">
                                    <th className="text-left px-4 py-3">User</th>
                                    <th className="text-left px-4 py-3 hidden md:table-cell">Email</th>
                                    <th className="text-left px-4 py-3">Role</th>
                                    <th className="text-left px-4 py-3 hidden lg:table-cell">Joined</th>
                                    <th className="text-left px-4 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user._id} className="border-b border-gray-800/50 hover:bg-gray-800/20 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-gold-500 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                                    {user.name?.charAt(0).toUpperCase()}
                                                </div>
                                                <p className="text-white font-medium">{user.name}</p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-gray-400 hidden md:table-cell">{user.email}</td>
                                        <td className="px-4 py-3">
                                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${user.role === 'admin' ? 'badge-gold' : 'badge-primary'}`}>
                                                {user.role === 'admin' ? '👑 Admin' : '👤 User'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-400 text-xs hidden lg:table-cell">
                                            {new Date(user.createdAt).toLocaleDateString('en-IN')}
                                        </td>
                                        <td className="px-4 py-3">
                                            {user.role !== 'admin' && (
                                                <button onClick={() => handleDelete(user._id, user.name)}
                                                    className="w-8 h-8 rounded-lg bg-red-900/30 text-red-400 hover:bg-red-800/50 flex items-center justify-center transition-all">
                                                    <FiTrash2 className="text-xs" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;
