import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getAllOrders } from '../utils/api'; 
import { formatPrice } from '../utils/formatters';
import Logo from "../assets/logo.png";

const InvoicePage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      const { data } = await getAllOrders(); 
      if (data) {
        const found = data.find(o => o.id === Number.parseInt(id, 10));
        setOrder(found);
        
        setTimeout(() => {
            globalThis.print();
        }, 1000);
      }
    };
    fetchOrder();
  }, [id]);

  if (!order) return <div>Memuat Invoice...</div>;

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white text-black font-sans" style={{ minHeight: '100vh' }}>
      {/* Header Invoice */}
      <div className="flex justify-between items-center border-b-2 border-gray-800 pb-4 mb-6">
        <div className="flex items-center gap-3">
            <img src={Logo} alt="Logo" className="w-12 grayscale" />
            <div>
                <h1 className="text-2xl font-bold uppercase tracking-widest">Invoice</h1>
                <p className="text-sm">LokalStyle Store</p>
            </div>
        </div>
        <div className="text-right">
            <p className="font-bold">Order #{order.id}</p>
            <p className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</p>
            {order.trackingNumber && <p className="text-sm font-mono mt-1">Resi: {order.trackingNumber}</p>}
        </div>
      </div>

      {/* Info Pengiriman */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
            <h3 className="font-bold border-b border-gray-300 mb-2 uppercase text-xs">Penerima</h3>
            <p className="font-semibold">{order.contactName}</p>
            <p>{order.contactPhone}</p>
            <p className="text-sm mt-1 text-gray-600 whitespace-pre-wrap">{order.shippingAddress}</p>
        </div>
        <div className="text-right">
            <h3 className="font-bold border-b border-gray-300 mb-2 uppercase text-xs">Status Pembayaran</h3>
            <span className="px-3 py-1 border border-black rounded-full text-sm font-bold uppercase">
                {order.status}
            </span>
        </div>
      </div>

      {/* Tabel Barang */}
      <table className="w-full mb-8">
        <thead>
            <tr className="border-b-2 border-black">
                <th className="text-left py-2">Produk</th>
                <th className="text-center py-2">Qty</th>
                <th className="text-right py-2">Harga</th>
                <th className="text-right py-2">Subtotal</th>
            </tr>
        </thead>
        <tbody>
            {/* Perbaikan S6582: Menggunakan Optional Chaining (?.) */}
            {order.order_items?.map((item) => (
                <tr key={item.id} className="border-b border-gray-200">
                    <td className="py-3">
                        <p className="font-bold">{item.productTitle}</p>
                        <p className="text-xs text-gray-500">Varian: {item.variantSize}</p>
                    </td>
                    <td className="text-center py-3">{item.quantity}</td>
                    <td className="text-right py-3">{formatPrice(item.price)}</td>
                    <td className="text-right py-3 font-medium">{formatPrice(item.price * item.quantity)}</td>
                </tr>
            ))}
        </tbody>
      </table>

      {/* Total */}
      <div className="flex justify-end">
        <div className="w-1/2 border-t-2 border-black pt-4">
            <div className="flex justify-between text-xl font-bold">
                <span>TOTAL</span>
                <span>{formatPrice(order.totalAmount)}</span>
            </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 text-center text-xs text-gray-500 border-t pt-4">
        <p>Terima kasih telah berbelanja di LokalStyle.</p>
        <p>Simpan struk ini sebagai bukti pembelian yang sah.</p>
      </div>
      
      <button 
        onClick={() => globalThis.print()} 
        className="print:hidden fixed bottom-8 right-8 bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg font-bold hover:bg-blue-700"
      >
        Cetak Invoice
      </button>
    </div>
  );
};

export default InvoicePage;