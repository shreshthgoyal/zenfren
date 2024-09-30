// components/EmailModal.js
import React, { useState } from 'react';
import Modal from 'react-modal';

// Set the app element for accessibility
Modal.setAppElement('#__next');

export default function EmailModal({ isOpen, onRequestClose, onSubmit }) {
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    if (email) {
      onSubmit(email);
      setEmail('');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Email Modal"
      style={{
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          width: '400px',
          padding: '20px',
          borderRadius: '10px',
        },
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
        },
      }}
    >
      <h2 className="text-xl font-bold mb-4">Enter your Email</h2>
      <input
        type="email"
        placeholder="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 mb-4 border rounded-md"
      />
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-all"
      >
        Submit
      </button>
      <button
        onClick={onRequestClose}
        className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-all"
      >
        Close
      </button>
    </Modal>
  );
}
