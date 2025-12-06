import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { IoCloseOutline } from "react-icons/io5";
import { FaTrash } from "react-icons/fa";
import PropTypes from 'prop-types';
import { useCart } from "../../contexts/CartContext";
import { formatPrice } from '../../utils/formatters';

const CartSidebar = ({ isOpen, toggleCart }) => {
  const { cartItems, removeFromCart, updateQuantity, total } = useCart();
  const dialogRef = useRef(null);

  // Efek untuk membuka/menutup dialog secara programatik
  useEffect(() => {
    const dialogNode = dialogRef.current;
    if (dialogNode) {
      if (isOpen) {
        dialogNode.showModal(); // Buka dialog
      } else {
        dialogNode.close(); // Tutup dialog
      }
    }
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      // Mencegah dialog tertutup saat tombol Esc atau backdrop diklik
      onClose={(e) => e.preventDefault()}
      className="backdrop:bg-black/50 backdrop:backdrop-blur-sm p-0 m-0 ml-auto bg-transparent max-h-full"
    >
      {/* Konten panel sidebar */}
      <div className="h-full w-full max-w-sm bg-white dark:bg-gray-900 shadow-lg p-6 flex flex-col">
        <div className="flex items-center justify-between border-b pb-4 dark:border-gray-700">
          <h1 className="text-xl font-bold">Keranjang Belanja</h1>
          <button onClick={toggleCart} aria-label="Tutup keranjang belanja" className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            <IoCloseOutline className="text-2xl" />
          </button>
        </div>

        {cartItems.length > 0 ? (
          <>
            <ul className="flex-grow overflow-y-auto my-4 divide-y dark:divide-gray-700">
              {cartItems.map(item => (
                <li key={item.id} className="flex items-start gap-4 py-4">
                  <img src={item.product.img} alt={item.product.title} className="w-20 h-20 object-cover rounded-md" />
                  <div className="flex-grow">
                    <h3 className="font-semibold line-clamp-2">{item.product.title}</h3>
                    <p className="text-sm text-gray-500">Ukuran: {item.variant.size}</p>
                    <p className="font-bold text-orange-500">{formatPrice(item.variant.price)}</p>
                    <div className="flex items-center border rounded-full w-fit mt-2 dark:border-gray-600">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-1">-</button>
                      <span className="px-3 text-sm">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-1">+</button>
                    </div>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500" title="Hapus item">
                    <FaTrash />
                  </button>
                </li>
              ))}
            </ul>
            <div className="border-t pt-4 dark:border-gray-700">
              <div className="flex justify-between font-bold text-lg mb-4">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
              <Link to="/checkout" onClick={toggleCart}>
                <button className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white py-2 rounded-full font-bold hover:scale-105 duration-200">
                  Lanjutkan ke Checkout
                </button>
              </Link>
            </div>
          </>
        ) : (
          <p className="flex-grow flex items-center justify-center text-center text-gray-500 my-10">
            Keranjang Anda masih kosong.
          </p>
        )}
      </div>
    </dialog>
  );
};

CartSidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggleCart: PropTypes.func.isRequired,
};

export default CartSidebar;