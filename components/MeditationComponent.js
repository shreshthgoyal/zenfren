import React, { useState, useEffect, useRef } from 'react';
import { Circle, Volume2, VolumeX, Clock, HeartHandshake, Play, Pause, Square } from 'lucide-react';
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
  "Find a comfortable seated position",
  "Close your eyes and take a deep breath",
  "Focus on your breath, inhaling deeply",
  "Exhale slowly, releasing any tension",
  "Notice any thoughts without judgment",
  "Gently return your focus to your breath",
  "Feel the rhythm of your breathing",
  "Scan your body for any areas of tension",
  "Relax those areas with each exhale",
  "Cultivate a sense of calm and peace",
];

const MeditationComponent = ({ triggerType = "button", triggerText = "Open Meditation" }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isVoiceOn, setIsVoiceOn] = useState(true);
  const [timer, setTimer] = useState(600); // 10 minutes default
  const [showTimerSelect, setShowTimerSelect] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(10);
  const [currentStep, setCurrentStep] = useState(0);
  const [fadeIn, setFadeIn] = useState(false);
  const intervalRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (isActive && isDrawerOpen) {
      intervalRef.current = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer > 0) {
            if (prevTimer % 30 === 0) {
              changeStep();
            }
            return prevTimer - 1;
          }
          stopSession();
          return 0;
        });
      }, 1000);

      animationRef.current = requestAnimationFrame(animateBreath);
    }
    return () => {
      clearInterval(intervalRef.current);
      cancelAnimationFrame(animationRef.current);
    };
  }, [isActive, isDrawerOpen]);

  useEffect(() => {
    if (!isDrawerOpen && isActive) {
      pauseSession();
    }
  }, [isDrawerOpen]);

  const changeStep = () => {
    setCurrentStep((prevStep) => {
      const nextStep = (prevStep + 1) % meditationSteps.length;
      speak(meditationSteps[nextStep]);
      setFadeIn(true);
      setTimeout(() => setFadeIn(false), 500);
      return nextStep;
    });
  };

  const animateBreath = (timestamp) => {
    const breathDuration = 5000; // 5 seconds per breath cycle
    const scale = 1 + 0.1 * Math.sin((timestamp / breathDuration) * Math.PI);
    document.querySelector('.breathing-circle').style.transform = `scale(${scale})`;
    animationRef.current = requestAnimationFrame(animateBreath);
  };

  const speak = (text) => {
    if (isVoiceOn) {
      speechSynthesis.cancel(); // Cancel any ongoing speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9; // Slightly faster speech
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  const startSession = () => {
    setIsActive(true);
    setTimer(selectedDuration * 60);
    setCurrentStep(0);
    speak("Let's begin our meditation. " + meditationSteps[0]);
    setFadeIn(true);
    setTimeout(() => setFadeIn(false), 500);
  };

  const stopSession = () => {
    setIsActive(false);
    setTimer(selectedDuration * 60);
    setCurrentStep(0);
    speak("Meditation session completed. Well done.");
    clearInterval(intervalRef.current);
    cancelAnimationFrame(animationRef.current);
  };

  const pauseSession = () => {
    setIsActive(false);
    speak("Meditation paused.");
    clearInterval(intervalRef.current);
    cancelAnimationFrame(animationRef.current);
  };

  const resumeSession = () => {
    setIsActive(true);
    speak("Resuming meditation. " + meditationSteps[currentStep]);
    animationRef.current = requestAnimationFrame(animateBreath);
  };

  const toggleVoice = () => setIsVoiceOn((prev) => !prev);
  const toggleTimerSelect = () => setShowTimerSelect((prev) => !prev);

  const setDuration = (minutes) => {
    setSelectedDuration(minutes);
    setTimer(minutes * 60);
    setShowTimerSelect(false);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

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

  return (
    <Drawer onOpenChange={(open) => setIsDrawerOpen(open)}>
      <DrawerTrigger asChild>
        {TriggerComponent}
      </DrawerTrigger>
      <DrawerContent className="bg-gradient-to-b from-purple-50 to-indigo-100 border-t border-purple-200">
        <div className="max-w-md mx-auto w-full">
          <DrawerHeader>
            <DrawerTitle className="text-2xl font-bold text-purple-700">Guided Meditation</DrawerTitle>
            <DrawerDescription className="text-purple-600">Find your inner peace and balance.</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 flex flex-col items-center">
            <div className="relative mb-4">
              <Circle size={200} className="text-purple-300 breathing-circle transition-transform duration-300 ease-in-out" />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <p className="text-lg font-semibold text-purple-700">Breathe</p>
                <p className="text-2xl font-bold text-purple-600">{formatTime(timer)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <Button 
                onClick={isActive ? pauseSession : (timer < selectedDuration * 60 ? resumeSession : startSession)} 
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                {isActive ? <Pause size={20} /> : <Play size={20} />}
              </Button>
              <Button 
                onClick={stopSession} 
                className="bg-red-500 hover:bg-red-600 text-white"
                disabled={!isActive && timer === selectedDuration * 60}
              >
                <Square size={20} />
              </Button>
              <Button variant="outline" size="icon" onClick={toggleVoice} className="border-purple-300 text-purple-600 hover:bg-purple-100">
                {isVoiceOn ? <Volume2 size={20} /> : <VolumeX size={20} />}
              </Button>
              <Button variant="outline" size="icon" onClick={toggleTimerSelect} className="border-purple-300 text-purple-600 hover:bg-purple-100">
                <Clock size={20} />
              </Button>
            </div>
            <div className={`text-center mb-4 w-full text-purple-800 transition-opacity duration-500 ${fadeIn ? 'opacity-100' : 'opacity-70'}`}>
              <p className="text-lg">{meditationSteps[currentStep]}</p>
            </div>
            {showTimerSelect && (
              <div className="flex gap-2 mb-4">
                {[5, 10, 15, 20].map((minutes) => (
                  <Button
                    key={minutes}
                    variant={selectedDuration === minutes ? "default" : "outline"}
                    onClick={() => setDuration(minutes)}
                    className={selectedDuration === minutes ? "bg-purple-600 text-white" : "border-purple-300 text-purple-600 hover:bg-purple-100"}
                  >
                    {minutes} min
                  </Button>
                ))}
              </div>
            )}
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