import React, { useState, useEffect } from 'react';
import { getAllOrders, updateOrderStatus } from '../../utils/api';
import { formatPrice } from '../../utils/formatters';

const AdminOrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    const { error, data } = await getAllOrders();
    if (!error) {
      setOrders(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    const { error } = await updateOrderStatus(id, newStatus);
    if (!error) {
      // Refresh data lokal agar tampilan berubah
      setOrders((prevOrders) => 
        prevOrders.map(order => 
          order.id === id ? { ...order, status: newStatus } : order
        )
      );
    }
  };

  if (loading) return <p className="p-8 text-center">Memuat pesanan...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Kelola Pesanan</h1>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border dark:border-gray-700">
        <table className="w-full text-left">
          <thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 border-b dark:border-gray-600">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Pelanggan</th>
              <th className="p-4">Total</th>
              <th className="p-4">Tanggal</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-gray-700">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="p-4 text-sm">#{order.id}</td>
                <td className="p-4">
                    <p className="font-medium">{order.contactName}</p>
                    <p className="text-xs text-gray-500">{order.contactPhone}</p>
                </td>
                <td className="p-4 font-bold text-orange-500">
                  {formatPrice(order.totalAmount)}
                </td>
                <td className="p-4 text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString('id-ID')}
                </td>
                <td className="p-4">
                  <select 
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase cursor-pointer border-none outline-none focus:ring-2 ${
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        order.status === 'paid' ? 'bg-blue-100 text-blue-700' :
                        order.status === 'shipped' ? 'bg-indigo-100 text-indigo-700' :
                        order.status === 'completed' ? 'bg-green-100 text-green-700' :
                        'bg-red-100 text-red-700'
                    }`}
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="shipped">Shipped</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrderList;