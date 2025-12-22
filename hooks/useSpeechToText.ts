import { useState, useEffect, useCallback, useRef } from 'react';
import { SpeechRecognition } from '../types';

interface UseSpeechToTextReturn {
  isListening: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  hasRecognition: boolean;
}

export const useSpeechToText = (): UseSpeechToTextReturn => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const hasRecognition = !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  useEffect(() => {
    if (!hasRecognition) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true; // Keep listening even after pauses
    recognition.interimResults = true; // Show results as they are being spoken
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      
      // Iterate through results to build the transcript
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      
      if (finalTranscript) {
          setTranscript((prev) => {
              // Add space if previous content exists and no trailing space
              const prefix = prev && !prev.endsWith(' ') ? ' ' : '';
              return prev + prefix + finalTranscript;
          });
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      // Ignore 'aborted' error as it is usually intentional (cleanup or manual stop)
      // Ignore 'no-speech' as it just means the user stopped talking or didn't say anything
      if (event.error === 'aborted' || event.error === 'no-speech') {
        setIsListening(false);
        return;
      }
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
        if(recognitionRef.current) {
            recognitionRef.current.abort();
        }
    }
  }, [hasRecognition]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.warn("Failed to start recognition", err);
      }
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
        setIsListening(false);
      } catch (err) {
        console.warn("Failed to stop recognition", err);
      }
    }
  }, [isListening]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    hasRecognition
  };
};