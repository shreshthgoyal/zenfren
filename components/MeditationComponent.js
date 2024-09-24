import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Pause, Play, Volume2, VolumeX, HeartHandshake } from 'lucide-react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

const meditationSteps = [
  "Find a comfortable place to sit, lie, or stand. Just be with your body and breathe.",
  "Close your eyes or bring your gaze low until a crease of light shines through.",
  "Notice what's coming up for you, what the body is aware of right now.",
  // ... (other steps remain the same)
  "As we exhale, bow the head down and honor those who can't breathe.",
];

const MeditationComponent = ({ triggerType = "button", triggerText = "Start Meditation" }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isVoiceOn, setIsVoiceOn] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [isBrowser, setIsBrowser] = useState(false);
  const synth = useRef(null);
  const utteranceRef = useRef(null);
  const stepIntervalRef = useRef(null);
  const startTimeRef = useRef(0);
  const lastStepTimeRef = useRef(0);

  useEffect(() => {
    setIsBrowser(true);
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      synth.current = window.speechSynthesis;
    }
  }, []);

  const speak = useCallback((text, startOffset = 0) => {
    if (isVoiceOn && synth.current) {
      if (utteranceRef.current) {
        synth.current.cancel();
      }
      utteranceRef.current = new SpeechSynthesisUtterance(text);
      utteranceRef.current.rate = 0.8;
      utteranceRef.current.pitch = 1;
      
      if (startOffset > 0) {
        const words = text.split(' ');
        const wordsToSkip = Math.floor(words.length * (startOffset / 10000));
        utteranceRef.current.text = words.slice(wordsToSkip).join(' ');
      }
      
      synth.current.speak(utteranceRef.current);
    }
  }, [isVoiceOn]);

  const nextStep = useCallback(() => {
    setCurrentStep((prevStep) => {
      const nextStep = (prevStep + 1) % meditationSteps.length;
      speak(meditationSteps[nextStep]);
      lastStepTimeRef.current = Date.now();
      return nextStep;
    });
  }, [speak]);

  const startMeditation = useCallback(() => {
    setIsActive(true);
    startTimeRef.current = Date.now();
    lastStepTimeRef.current = Date.now();
    stepIntervalRef.current = setInterval(nextStep, 10000);
    speak(meditationSteps[currentStep]);
  }, [nextStep, speak, currentStep]);

  const pauseMeditation = useCallback(() => {
    setIsActive(false);
    clearInterval(stepIntervalRef.current);
    if (synth.current) {
      synth.current.cancel();
    }
  }, []);

  const resumeMeditation = useCallback(() => {
    setIsActive(true);
    const now = Date.now();
    const elapsedSinceLastStep = now - lastStepTimeRef.current;
    const timeUntilNextStep = 10000 - (elapsedSinceLastStep % 10000);
    
    speak(meditationSteps[currentStep], elapsedSinceLastStep % 10000);
    
    stepIntervalRef.current = setInterval(nextStep, 10000);
    setTimeout(() => {
      clearInterval(stepIntervalRef.current);
      stepIntervalRef.current = setInterval(nextStep, 10000);
    }, timeUntilNextStep);

  }, [nextStep, speak, currentStep]);

  const toggleMeditation = useCallback(() => {
    if (isActive) {
      pauseMeditation();
    } else {
      if (currentStep === 0 && startTimeRef.current === 0) {
        startMeditation();
      } else {
        resumeMeditation();
      }
    }
  }, [isActive, currentStep, startMeditation, pauseMeditation, resumeMeditation]);

  const toggleVoice = useCallback(() => {
    setIsVoiceOn((prev) => {
      if (!prev && isActive && synth.current) {
        const now = Date.now();
        const elapsedSinceLastStep = now - lastStepTimeRef.current;
        speak(meditationSteps[currentStep], elapsedSinceLastStep % 10000);
      } else if (prev && synth.current) {
        synth.current.cancel();
      }
      return !prev;
    });
  }, [isActive, currentStep, speak]);

  useEffect(() => {
    return () => {
      clearInterval(stepIntervalRef.current);
      if (synth.current) {
        synth.current.cancel();
      }
    };
  }, []);

  const TriggerComponent = triggerType === "icon" ? (
    <div className="text-center cursor-pointer">
      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-2 shadow-md">
        <HeartHandshake className="w-8 h-8 text-[#7C3AED]" />
      </div>
      <p className="text-sm font-medium text-indigo-700">Meditate</p>
    </div>
  ) : (
    <Button variant="outline" className="border-purple-300 text-purple-600 hover:bg-purple-100">
      {triggerText}
    </Button>
  );

  if (!isBrowser) {
    return null; // or a loading spinner
  }

  return (
    <Drawer onOpenChange={setIsDrawerOpen}>
      <DrawerTrigger asChild>
        {TriggerComponent}
      </DrawerTrigger>
      <DrawerContent className="bg-gradient-to-b from-purple-50 to-indigo-100 border-t border-purple-200">
        <style jsx>{`
          @keyframes flow {
            0%, 100% { 
              d: path("M10,50 Q50,30 90,50 T170,50 T250,50 T330,50"); 
            }
            50% { 
              d: path("M10,50 Q50,70 90,50 T170,50 T250,50 T330,50"); 
            }
          }
          .flowing-path {
            animation: flow 8s ease-in-out infinite;
          }
        `}</style>
        <div className="max-w-md mx-auto w-full">
          <DrawerHeader>
            <DrawerTitle className="text-2xl font-bold text-purple-700">Guided Meditation</DrawerTitle>
            <DrawerDescription className="text-purple-600">Find your inner peace and balance.</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 flex flex-col items-center">
            <div className="relative mb-8 w-80 h-40 overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 340 100" preserveAspectRatio="none">
                <path
                  className="flowing-path"
                  fill="none"
                  stroke="#8B5CF6"
                  strokeWidth="2"
                  d="M10,50 Q50,30 90,50 T170,50 T250,50 T330,50"
                />
                <path
                  className="flowing-path"
                  fill="none"
                  stroke="#A78BFA"
                  strokeWidth="2"
                  d="M10,50 Q50,70 90,50 T170,50 T250,50 T330,50"
                  style={{ animationDelay: "-2s" }}
                />
                <path
                  className="flowing-path"
                  fill="none"
                  stroke="#C4B5FD"
                  strokeWidth="2"
                  d="M10,50 Q50,50 90,50 T170,50 T250,50 T330,50"
                  style={{ animationDelay: "-4s" }}
                />
              </svg>
            </div>
            <div className="flex items-center gap-4 mb-6">
              <Button 
                onClick={toggleMeditation} 
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2"
              >
                {isActive ? <Pause size={24} /> : <Play size={24} />}
              </Button>
              <Button variant="outline" size="icon" onClick={toggleVoice} className="border-purple-300 text-purple-600 hover:bg-purple-100">
                {isVoiceOn ? <Volume2 size={24} /> : <VolumeX size={24} />}
              </Button>
            </div>
            <div className="text-center mb-6 w-full">
              <p className="text-lg text-purple-800 transition-opacity duration-500 ease-in-out">
                {meditationSteps[currentStep]}
              </p>
            </div>
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline" className="border-purple-300 text-purple-600 hover:bg-purple-100">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MeditationComponent;