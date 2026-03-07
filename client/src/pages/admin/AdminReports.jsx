import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMonthlyReport } from '../../redux/slices/adminSlice';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminReports = () => {
    const dispatch = useDispatch();
    const { monthlyReport, loading } = useSelector((state) => state.admin);
    const currentYear = new Date().getFullYear();
    const [year, setYear] = useState(currentYear);

    useEffect(() => { dispatch(fetchMonthlyReport(year)); }, [dispatch, year]);

    const totalRevenue = monthlyReport.reduce((sum, m) => sum + m.revenue, 0);
    const totalOrders = monthlyReport.reduce((sum, m) => sum + m.orders, 0);
    const totalDiscount = monthlyReport.reduce((sum, m) => sum + m.discount, 0);
    const bestMonth = monthlyReport.reduce((best, m) => m.revenue > best.revenue ? m : best, { revenue: 0, month: '-' });

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-white">Sales Reports</h1>
                    <p className="text-sm text-gray-400">Monthly revenue and orders overview</p>
                </div>
                <select value={year} onChange={e => setYear(e.target.value)} className="select-field w-auto text-sm py-2.5">
                    {[currentYear, currentYear - 1, currentYear - 2].map(y => <option key={y} value={y}>{y}</option>)}
                </select>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, color: 'text-primary-400' },
                    { label: 'Total Orders', value: totalOrders, color: 'text-blue-400' },
                    { label: 'Total Discounts', value: `₹${totalDiscount.toLocaleString()}`, color: 'text-emerald-400' },
                    { label: 'Best Month', value: bestMonth.month, color: 'text-green-400' },
                ].map(({ label, value, color }) => (
                    <div key={label} className="card p-4">
                        <p className="text-xs text-gray-400">{label}</p>
                        <p className={`text-xl font-bold mt-1 ${color}`}>{value}</p>
                    </div>
                ))}
            </div>

            {loading ? <LoadingSpinner /> : (
                <>
                    {/* Revenue Bar Chart */}
                    <div className="card p-6">
                        <h3 className="font-semibold text-white mb-5">Monthly Revenue - {year}</h3>
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={monthlyReport} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                                <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v}`} />
                                <Tooltip contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: '12px', color: '#fff' }}
                                    formatter={(val, name) => [name === 'Revenue' ? `₹${val}` : val, name]} />
                                <Legend wrapperStyle={{ color: '#9ca3af', fontSize: '12px' }} />
                                <Bar dataKey="revenue" name="Revenue" fill="#6366f1" radius={[6, 6, 0, 0]} />
                                <Bar dataKey="orders" name="Orders" fill="#6366f1" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Table */}
                    <div className="card overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-800 text-gray-400">
                                        <th className="text-left px-4 py-3">Month</th>
                                        <th className="text-left px-4 py-3">Orders</th>
                                        <th className="text-left px-4 py-3">Revenue</th>
                                        <th className="text-left px-4 py-3">Discounts</th>
                                        <th className="text-left px-4 py-3">Net Revenue</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {monthlyReport.map((row) => (
                                        <tr key={row.month} className="border-b border-gray-800/50 hover:bg-gray-800/20">
                                            <td className="px-4 py-3 text-white font-medium">{row.month}</td>
                                            <td className="px-4 py-3 text-gray-400">{row.orders}</td>
                                            <td className="px-4 py-3 text-primary-400 font-semibold">₹{row.revenue.toLocaleString()}</td>
                                            <td className="px-4 py-3 text-emerald-400">₹{row.discount?.toLocaleString() || 0}</td>
                                            <td className="px-4 py-3 text-green-400 font-semibold">₹{(row.revenue - (row.discount || 0)).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminReports;
