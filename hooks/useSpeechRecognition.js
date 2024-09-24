import { useState, useEffect, useRef } from 'react';
import * as speechServices from '../services/speechServices';

export function useSpeechRecognition({ onResult, setIsBotSpeaking }) {
    const [listening, setListening] = useState(false);
    const recognitionRef = useRef(null);

    useEffect(() => {
        recognitionRef.current = speechServices.initSpeechRecognition({
            onResult: (transcript) => {
                onResult(transcript);
                setIsBotSpeaking(false); 
            },
            onError: (error) => {
                console.error('Speech recognition error:', error);
                setListening(false);
            },
            onEnd: () => {
                console.log('Speech recognition ended');
                setListening(false);
            },
            onStart: () => {
                console.log('Speech recognition started');
                setListening(true);
            },
            setListening
        });

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.abort(); 
            }
        };
    }, [onResult, setIsBotSpeaking]);

    const startRecognition = () => {
        if (recognitionRef.current && !listening) {
            recognitionRef.current.start();
        }
    };

    const stopRecognition = () => {
        if (recognitionRef.current && listening) {
            recognitionRef.current.stop();
        }
    };

    return {
        startRecognition,
        stopRecognition,
        listening
    };
}
