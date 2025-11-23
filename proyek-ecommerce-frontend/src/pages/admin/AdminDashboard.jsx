import React, { useState, useEffect } from 'react';
import { getDashboardStats } from '../../utils/api'; // Import API baru
import { FaBox, FaClipboardList, FaChartPie, FaLayerGroup } from 'react-icons/fa';
import { formatPrice } from '../../utils/formatters';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalStock: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const { error, data } = await getDashboardStats();
      if (!error && data) {
        setStats(data);
      }
      setLoading(false);
    };

    fetchStats();
  }, []);

  if (loading) {
      return <div className="p-8 text-center">Memuat data dashboard...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Kartu Total Pendapatan */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border-l-4 border-orange-500 flex items-center justify-between transition hover:shadow-md">
            <div>
                <h3 className="text-gray-500 dark:text-gray-400 text-sm uppercase font-semibold">Total Pendapatan</h3>
                <p className="text-2xl font-bold mt-2 text-gray-900 dark:text-white">
                  {formatPrice(stats.totalRevenue)}
                </p>
                <p className="text-xs text-gray-400 mt-1">*Paid/Shipped/Completed</p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full">
               <FaChartPie className="text-orange-500 text-2xl" />
            </div>
        </div>

        {/* Kartu Total Pesanan */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border-l-4 border-blue-500 flex items-center justify-between transition hover:shadow-md">
            <div>
                <h3 className="text-gray-500 dark:text-gray-400 text-sm uppercase font-semibold">Total Pesanan</h3>
                <p className="text-2xl font-bold mt-2 text-gray-900 dark:text-white">
                  {stats.totalOrders}
                </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
               <FaClipboardList className="text-blue-500 text-2xl" />
            </div>
        </div>

        {/* Kartu Total Produk */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border-l-4 border-green-500 flex items-center justify-between transition hover:shadow-md">
            <div>
                <h3 className="text-gray-500 dark:text-gray-400 text-sm uppercase font-semibold">Total Produk</h3>
                <p className="text-2xl font-bold mt-2 text-gray-900 dark:text-white">
                  {stats.totalProducts}
                </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
               <FaBox className="text-green-500 text-2xl" />
            </div>
        </div>

        {/* Kartu Total Stok */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border-l-4 border-purple-500 flex items-center justify-between transition hover:shadow-md">
            <div>
                <h3 className="text-gray-500 dark:text-gray-400 text-sm uppercase font-semibold">Total Stok Unit</h3>
                <p className="text-2xl font-bold mt-2 text-gray-900 dark:text-white">
                  {stats.totalStock}
                </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
               <FaLayerGroup className="text-purple-500 text-2xl" />
            </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;