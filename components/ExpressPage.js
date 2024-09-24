import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Heart } from 'lucide-react';
import MicButton from './MicButton';

export default function ExpressPage({
  phase,
  pageVariants,
  pageTransition,
  input,
  setInput,
  handleMicClick,
  listening,
  handleExpress,
  isLoadingQuote,
  quote,
}) {
  const [showAlert, setShowAlert] = useState(false);

  const handleExpressWithValidation = () => {
    if (input.trim() === '') {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    } else {
      handleExpress();
    }
  };

  const alertVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return phase === 'express' && (
    <motion.div
      key="express"
      variants={pageVariants}
      initial="initial"
      animate="in"
      exit="out"
      transition={pageTransition}
      className="w-full max-w-2xl flex flex-col items-center relative"
    >
      <h1 className="text-4xl font-bold mb-4 text-indigo-700">
        Express Yourself
      </h1>
      <p className="text-xl text-indigo-600 italic mb-2">
        Feel free to share your thoughts...
      </p>
      <div className="w-full flex justify-center items-center mb-6">
        <textarea
          className="w-full h-48 p-4 text-xl bg-transparent rounded-xl resize-none overflow-auto transition duration-300 ease-in-out focus:outline-none scrollbar"
          placeholder="Start typing your thoughts here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <MicButton listening={listening} handleMicClick={handleMicClick} />
      </div>
      <button
        className="px-8 py-3 bg-indigo-600 text-white text-lg font-semibold rounded-full hover:bg-indigo-700 transition duration-300 ease-in-out focus:outline-none"
        onClick={handleExpressWithValidation}
      >
        Share Thoughts
      </button>
      <AnimatePresence>
        {showAlert && (
          <motion.div
            variants={alertVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="w-full mt-4"
          >
            <Alert variant="default" className="bg-indigo-100 border-indigo-300">
              <Heart className="h-4 w-4 text-pink-500 mr-2" />
              <AlertDescription className="text-indigo-700">
                We'd love to hear from you! Feel free to share any thoughts when you're ready.
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>
      {!isLoadingQuote && quote && (
        <div className="w-full flex justify-center mt-6 pointer-events-none">
          <p
            className="text-lg text-indigo-600 italic opacity-50 text-center"
            style={{
              fontWeight: '300',
              textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)',
            }}
          >
            "{quote.quote}" - {quote.author}
          </p>
        </div>
      )}
    </motion.div>
  );
}