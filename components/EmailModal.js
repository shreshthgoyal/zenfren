import Modal from 'react-modal';
import { useState } from 'react';

Modal.setAppElement('#__next');

export default function EmailModal({ isOpen, onClose, onSubmit, action }) {
  const [email, setEmail] = useState('');

  const handleSubmit = async () => {
    if (email) {
      await onSubmit(email, action);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Email Modal"
      className="fixed inset-0 flex items-center justify-center outline-none"
      overlayClassName="fixed inset-0 bg-black bg-opacity-75"
    >
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 space-y-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          aria-label="Close"
        >
          &#x2715;
        </button>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Let's Take a Step Towards a Healthier Mind
        </h2>
        <input
          type="email"
          placeholder="Enter your gmail address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          onClick={handleSubmit}
          className="w-full bg-[#7C3AED] text-white px-6 py-3 rounded-full text-lg font-medium hover:bg-[#9F7AEA] transition-all duration-300 ease-in-out"
        >
          Begin Your Healing Journey
        </button>
        <hr className="border-t border-gray-300 my-2" />
        <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
          We value your privacy. The email you provide will be used solely to ensure secure access to the shared resources.
        </p>
      </div>
    </Modal>
  );
}
