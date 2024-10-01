import React, { useState, useEffect } from 'react';
import { Circle, Volume2, VolumeX, Info, Clock, Leaf, Play, Pause, Square } from 'lucide-react';
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

const BreathingExercise = ({ triggerType = "button", triggerText = "Open Breathing Exercise" }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState('ready');
  const [count, setCount] = useState(0);
  const [isVoiceOn, setIsVoiceOn] = useState(true);
  const [timer, setTimer] = useState(300);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showTimerSelect, setShowTimerSelect] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(5);

  useEffect(() => {
    let interval;
    if (isActive && isDrawerOpen) {
      interval = setInterval(() => {
        setCount((prevCount) => {
          const newCount = (prevCount + 1) % 5;
          if (newCount === 0) {
            setPhase((prevPhase) => {
              const newPhase = prevPhase === 'inhale' ? 'exhale' : 'inhale';
              if (isVoiceOn) speak(newPhase === 'inhale' ? 'Breathe in' : 'Breathe out');
              return newPhase;
            });
          }
          return newCount;
        });

        setTimer((prevTimer) => {
          if (prevTimer > 0) return prevTimer - 1;
          stopExercise();
          return 0;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, isVoiceOn, isDrawerOpen]);

  useEffect(() => {
    if (!isDrawerOpen && isActive) {
      pauseExercise();
    }
  }, [isDrawerOpen]);

  const speak = (text) => {
    if (isVoiceOn) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.7;
      utterance.pitch = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const startExercise = () => {
    setIsActive(true);
    setPhase('inhale');
    setCount(0);
    setTimer(selectedDuration * 60);
    if (isVoiceOn) speak("Let's begin. Breathe in through your nose.");
  };

  const stopExercise = () => {
    setIsActive(false);
    setPhase('ready');
    setTimer(selectedDuration * 60);
    setCount(0);
    if (isVoiceOn) speak("Exercise stopped.");
  };

  const pauseExercise = () => {
    setIsActive(false);
    if (isVoiceOn) speak("Exercise paused.");
  };

  const resumeExercise = () => {
    setIsActive(true);
    if (isVoiceOn) speak("Resuming exercise.");
  };

  const toggleVoice = () => setIsVoiceOn((prev) => !prev);
  const toggleInstructions = () => setShowInstructions((prev) => !prev);
  const toggleTimerSelect = () => setShowTimerSelect((prev) => !prev);

  const setDuration = (minutes) => {
    setSelectedDuration(minutes);
    setTimer(minutes * 60);
    setShowTimerSelect(false);
  };

  const circleStyle = {
    transition: 'all 1s ease-in-out',
    transform: `scale(${isActive ? (phase === 'inhale' ? 1 + count * 0.1 : 1.5 - count * 0.1) : 1})`,
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const TriggerComponent = triggerType === "icon" ? (
    <div className="text-center cursor-pointer hover:scale-105">
      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-2 shadow-md">
        <Leaf className="w-8 h-8 text-[#7C3AED]" />
      </div>
      <p className="text-sm font-medium text-indigo-700">Breathe</p>
    </div>
  ) : (
    <Button variant="outline" className="border-indigo-300 text-indigo-600 hover:bg-indigo-200">
      {triggerText}
    </Button>
  );

  return (
    <Drawer onOpenChange={(open) => setIsDrawerOpen(open)}>
      <DrawerTrigger asChild>
        {TriggerComponent}
      </DrawerTrigger>
      <DrawerContent className="bg-gradient-to-b from-blue-50 to-indigo-100 border-t border-indigo-200 h-auto">
        <div className="max-w-md mx-auto w-full">
          <DrawerHeader>
            <DrawerTitle className="text-2xl font-bold text-indigo-700">Breathing Exercise</DrawerTitle>
            <DrawerDescription className="text-indigo-600">Take a moment to breathe and relax.</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 flex flex-col items-center">
            <div className="relative mb-4">
              <Circle
                size={200}
                className="text-indigo-300"
                style={circleStyle}
              />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <span className="text-xl font-semibold text-indigo-700">
                  {isActive ? (phase === 'inhale' ? 'Breathe In' : 'Breathe Out') : 'Ready'}
                </span>
                {isActive && (
                  <p className="text-3xl font-bold text-indigo-600 mt-2">
                    {phase === 'inhale' ? count + 1 : 5 - count}
                  </p>
                )}
              </div>
            </div>
            <p className="text-2xl font-bold text-indigo-600 mb-4 h-8">
              {formatTime(timer)}
            </p>
            <div className="flex items-center gap-2 mb-4">
              <Button 
                onClick={isActive ? pauseExercise : (timer < selectedDuration * 60 ? resumeExercise : startExercise)} 
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                {isActive ? <Pause size={20} /> : <Play size={20} />}
              </Button>
              <Button 
                onClick={stopExercise} 
                className="bg-red-500 hover:bg-red-600 text-white"
                disabled={!isActive && timer === selectedDuration * 60}
              >
                <Square size={20} />
              </Button>
              <Button variant="outline" size="icon" onClick={toggleVoice} className="border-indigo-300 text-indigo-600 hover:bg-indigo-100">
                {isVoiceOn ? <Volume2 size={20} /> : <VolumeX size={20} />}
              </Button>
              <Button variant="outline" size="icon" onClick={toggleInstructions} className="border-indigo-300 text-indigo-600 hover:bg-indigo-100">
                <Info size={20} />
              </Button>
              <Button variant="outline" size="icon" onClick={toggleTimerSelect} className="border-indigo-300 text-indigo-600 hover:bg-indigo-100">
                <Clock size={20} />
              </Button>
            </div>
            {showInstructions && (
              <div className="text-sm mb-4 w-full text-indigo-800">
                <h3 className="font-semibold mb-2 text-indigo-700">Instructions:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Sit comfortably with feet on the ground</li>
                  <li>Breathe deeply into your belly</li>
                  <li>Inhale through nose for 5 counts</li>
                  <li>Exhale through mouth for 5 counts</li>
                  <li>Continue for the selected duration</li>
                </ul>
              </div>
            )}
            {showTimerSelect && (
              <div className="flex gap-2 mb-4">
                {[2, 3, 5].map((minutes) => (
                  <Button
                    key={minutes}
                    variant={selectedDuration === minutes ? "default" : "outline"}
                    onClick={() => setDuration(minutes)}
                    className={selectedDuration === minutes ? "bg-indigo-600 text-white" : "border-indigo-300 text-indigo-600 hover:bg-indigo-100"}
                  >
                    {minutes} min
                  </Button>
                ))}
              </div>
            )}
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline" className="border-indigo-300 text-indigo-600 hover:bg-indigo-100">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default BreathingExercise;