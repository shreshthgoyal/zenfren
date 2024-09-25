import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { MessageCircle, Users, Sunrise } from 'lucide-react';
import BreathingExercise from '@/components/BreathingExercise';
import MeditationComponent from '@/components/MeditationComponent';

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
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7C3AED">
                  <animate attributeName="offset" values="0;1;0" dur="20s" repeatCount="indefinite" />
                </stop>
                <stop offset="100%" stopColor="#3B82F6">
                  <animate attributeName="offset" values="1;0;1" dur="20s" repeatCount="indefinite" />
                </stop>
              </linearGradient>
            </defs>
            <path d="M100,10 C150,10 190,50 190,100 C190,150 150,190 100,190 C50,190 10,150 10,100 C10,50 50,10 100,10 Z" fill="none" stroke="url(#gradient)" strokeWidth="4">
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 100 100"
                to="360 100 100"
                dur="20s"
                repeatCount="indefinite"
              />
            </path>
            <path d="M100,30 C130,30 160,60 160,100 C160,140 130,170 100,170 C70,170 40,140 40,100 C40,60 70,30 100,30 Z" fill="none" stroke="url(#gradient)" strokeWidth="4">
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="360 100 100"
                to="0 100 100"
                dur="15s"
                repeatCount="indefinite"
              />
            </path>
          </svg>
        </motion.div>
        
        <motion.h1 
          className="text-5xl md:text-6xl font-bold mb-6 leading-tight"
          variants={itemVariants}
        >
          Hey there! Welcome to <span className="text-[#7C3AED]">ZenFren</span>
        </motion.h1>
        
        <motion.p 
          className="text-xl md:text-2xl mb-12 text-[#5A5A7D]"
          variants={itemVariants}
        >
          A warm hug for your soul.
        </motion.p>
        
        <motion.button 
          onClick={() => router.push('/express')}
          className="bg-[#7C3AED] text-white px-10 py-4 rounded-full text-xl font-medium hover:bg-[#9F7AEA] transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 shadow-lg"
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Take the first step.
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
            <MeditationComponent triggerType="icon"/>
            <BreathingExercise triggerType="icon"/>
          </div>
        </motion.div>

        <motion.p 
          className="mt-16 text-lg text-[#5A5A7D]"
          variants={itemVariants}
        >
          Take a deep breath, you've got this. ZenFren is by your side.
        </motion.p>
      </motion.div>
    </div>
  );
}