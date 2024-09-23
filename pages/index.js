import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { MessageCircle, Users, Sunrise, Leaf } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E6F0FF] to-[#F0E6FF] text-[#3A3A5C] font-sans overflow-hidden flex items-center justify-center">
      <motion.div 
        className="max-w-3xl w-full px-6 py-12 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="mb-12 relative"
          variants={itemVariants}
        >
          <svg className="w-40 h-40 mx-auto" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="90" stroke="#7C3AED" strokeWidth="2" strokeDasharray="565" strokeDashoffset="565">
              <animate attributeName="stroke-dashoffset" from="565" to="0" dur="5s" repeatCount="indefinite" />
            </circle>
            <path d="M100 10 Q 110 50 150 90 Q 190 130 100 190 Q 10 130 50 90 Q 90 50 100 10" fill="none" stroke="#7C3AED" strokeWidth="2">
              <animate attributeName="d" 
                values="
                  M100 10 Q 110 50 150 90 Q 190 130 100 190 Q 10 130 50 90 Q 90 50 100 10;
                  M100 10 Q 150 50 170 100 Q 190 150 100 190 Q 10 150 30 100 Q 50 50 100 10;
                  M100 10 Q 110 50 150 90 Q 190 130 100 190 Q 10 130 50 90 Q 90 50 100 10"
                dur="10s" repeatCount="indefinite" />
            </path>
          </svg>
        </motion.div>
        
        <motion.h1 
          className="text-5xl md:text-6xl font-bold mb-6 leading-tight"
          variants={itemVariants}
        >
          Welcome to <span className="text-[#7C3AED]">ZenFren</span>
        </motion.h1>
        
        <motion.p 
          className="text-xl md:text-2xl mb-12 text-[#5A5A7D]"
          variants={itemVariants}
        >
          Your companion on the journey to inner peace.
        </motion.p>
        
        <motion.button 
          onClick={() => router.push('/express')}
          className="bg-[#7C3AED] text-white px-10 py-4 rounded-full text-xl font-medium hover:bg-[#9F7AEA] transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 shadow-lg"
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Begin Your Journey
        </motion.button>
        
        <motion.div 
          className="mt-16"
          variants={containerVariants}
        >
          <p className="text-lg mb-6">Discover paths to tranquility:</p>
          <div className="flex justify-center space-x-8">
            {[
              { icon: MessageCircle, label: "Reflect" },
              { icon: Users, label: "Connect" },
              { icon: Sunrise, label: "Grow" },
              { icon: Leaf, label: "Breathe" }
            ].map((item, index) => (
              <motion.div 
                key={index}
                className="text-center cursor-pointer"
                variants={itemVariants}
                whileHover={{ scale: 1.1 }}
              >
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-2 shadow-md">
                  <item.icon className="w-8 h-8 text-[#7C3AED]" />
                </div>
                <p className="text-sm font-medium">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.p 
          className="mt-16 text-lg text-[#5A5A7D]"
          variants={itemVariants}
        >
          Find balance in every moment with ZenFren.
        </motion.p>
      </motion.div>
    </div>
  );
}