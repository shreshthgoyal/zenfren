import { useRouter } from 'next/router';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Users } from 'lucide-react';
import BreathingExercise from '@/components/BreathingExercise';
import MeditationComponent from '@/components/MeditationComponent';
import Modal from 'react-modal';

// Set the app element for accessibility purposes
Modal.setAppElement('#__next');

export default function Home() {
  const router = useRouter();
  const [loadingReflect, setLoadingReflect] = useState(false);
  const [loadingConnect, setLoadingConnect] = useState(false);
  const [showEmailPopup, setShowEmailPopup] = useState(false);
  const [email, setEmail] = useState('');
  const [currentAction, setCurrentAction] = useState(null); // Keep track of which button was clicked

  // Function to handle Reflect click event
  const handleReflectClick = async () => {
    setLoadingReflect(true);
    let docId = localStorage.getItem('docId'); // Check if docId exists in local storage

    if (docId) {
      // If docId exists, redirect to the existing document
      window.open(`https://docs.google.com/document/d/${docId}/edit`);
    } else {
      setCurrentAction('reflect'); // Set action to 'reflect'
      setShowEmailPopup(true); // Show the email popup if no docId found
    }
    setLoadingReflect(false);
  };

  // Function to handle Connect click event
  const handleConnectClick = async () => {
    setLoadingConnect(true);
    let sheetId = localStorage.getItem('sheetId'); // Check if sheetId exists in local storage

    if (sheetId) {
      // If sheetId exists, redirect to the existing sheet
      window.open(`https://docs.google.com/spreadsheets/d/${sheetId}/edit`);
    } else {
      setCurrentAction('connect'); // Set action to 'connect'
      setShowEmailPopup(true); // Show the email popup if no sheetId found
    }
    setLoadingConnect(false);
  };

  // Function to handle document or sheet creation based on the current action
  const handleCreateDocOrSheet = async () => {
    try {
      const endpoint = currentAction === 'reflect' ? '/api/createDoc' : '/api/createSheet';
      // Call the appropriate API based on the action
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }), // Send email to the backend
      });

      const data = await response.json();
      const { docId, sheetId } = data;

      // Save the new docId or sheetId to local storage
      if (currentAction === 'reflect') {
        localStorage.setItem('docId', docId);
        window.open(`https://docs.google.com/document/d/${docId}/edit`);
      } else {
        localStorage.setItem('sheetId', sheetId);
        window.open(`https://docs.google.com/spreadsheets/d/${sheetId}/edit`);
      }

      // Close the popup
      setShowEmailPopup(false);
    } catch (error) {
      console.error('Error creating document or sheet:', error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E6F0FF] to-[#F0E6FF] text-[#3A3A5C] font-sans overflow-hidden flex items-center justify-center">
      <motion.div
        className="max-w-3xl w-full px-6 py-12 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Main Content */}
        <motion.h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight" variants={itemVariants}>
          Hey there! Welcome to <span className="text-[#7C3AED]">ZenFren</span>
        </motion.h1>

        <motion.p className="text-xl md:text-2xl mb-12 text-[#5A5A7D]" variants={itemVariants}>
          A warm hug for your soul.
        </motion.p>

        {/* Call to Action Button */}
        <motion.button
          onClick={() => router.push('/express')}
          className="bg-[#7C3AED] text-white px-10 py-4 rounded-full text-xl font-medium hover:bg-[#9F7AEA] transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 shadow-lg"
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Take the first step.
        </motion.button>

        {/* Options for Reflect and Connect */}
        <motion.div className="mt-16" variants={containerVariants}>
          <p className="text-lg mb-6">Discover paths to tranquility:</p>
          <div className="flex justify-center space-x-8">
            {[
              { icon: MessageCircle, label: 'Reflect', onClick: handleReflectClick },
              { icon: Users, label: 'Connect', onClick: handleConnectClick },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="text-center cursor-pointer text-[#7C3AED]"
                onClick={item.onClick}
                variants={itemVariants}
                whileHover={{ scale: 1.1 }}
              >
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-2 shadow-md">
                  <item.icon className="w-8 h-8 text-[#7C3AED]" />
                </div>
                <p className="text-sm font-medium">{item.label}</p>
              </motion.div>
            ))}
            <MeditationComponent triggerType="icon" />
            <BreathingExercise triggerType="icon" />
          </div>
        </motion.div>

        <motion.p className="mt-16 text-lg text-[#5A5A7D]" variants={itemVariants}>
          Take a deep breath, you've got this. ZenFren is by your side.
        </motion.p>

        {/* Email Modal Popup */}
        <Modal
          isOpen={showEmailPopup}
          onRequestClose={() => setShowEmailPopup(false)}
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
          <h2 className="text-2xl font-semibold mb-4">Enter your Email</h2>
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mb-4 border rounded-md"
          />
          <button
            onClick={handleCreateDocOrSheet}
            className="bg-[#7C3AED] text-white px-6 py-3 rounded-full text-lg font-medium hover:bg-[#9F7AEA] transition-all duration-300 ease-in-out"
          >
            Submit
          </button>
        </Modal>
      </motion.div>
    </div>
  );
}
