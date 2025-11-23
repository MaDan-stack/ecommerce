import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const AddTestimonial = ({ onAdd }) => {
  const { authedUser } = useContext(AuthContext);
  const [text, setText] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!authedUser) {
      alert("Anda harus login untuk memberikan testimoni.");
      navigate('/login');
      return;
    }
    if (!text) {
      alert("Testimoni tidak boleh kosong.");
      return;
    }
    onAdd({ name: authedUser.name, text });
    setText('');
  };

  return (
    <div className="py-10 flex items-center justify-center">
      <div className="container">
        <div className="max-w-xl mx-auto">
          <h1 className="text-2xl font-bold text-center mb-4">Bagikan Pendapat Anda</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Nama Anda"
              value={authedUser ? authedUser.name : ''}
              disabled={!!authedUser}
              className="w-full rounded-full border border-gray-300 dark:border-gray-500 dark:bg-gray-800 px-4 py-2 bg-gray-100"
            />
            <textarea
              placeholder="Tulis testimoni Anda di sini..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows="4"
              className="w-full rounded-2xl border border-gray-300 dark:border-gray-500 dark:bg-gray-800 px-4 py-2"
            />
            <div className="text-center">
              <button type="submit" className="bg-gradient-to-r from-red-500 to-orange-500 text-white py-2 px-8 rounded-full">
                Kirim Testimoni
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

AddTestimonial.propTypes = {
  onAdd: PropTypes.func.isRequired,
};

export default AddTestimonial;