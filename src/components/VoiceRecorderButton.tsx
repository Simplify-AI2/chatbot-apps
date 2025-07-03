import React, { useState, useEffect } from 'react';
import { MicrophoneIcon, StopIcon } from '@heroicons/react/24/outline';
import { SpeechToTextService } from '../service/SpeechToTextService';
import Tooltip from './Tooltip';
import { FeatureService } from '../service/FeatureService';

interface VoiceRecorderButtonProps {
  onTranscription: (text: string) => void;
  onError?: (error: string) => void;
  disabled?: boolean;
  className?: string;
}

const VoiceRecorderButton: React.FC<VoiceRecorderButtonProps> = ({
  onTranscription,
  onError,
  disabled = false,
  className = ''
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [isSTTEnabled, setIsSTTEnabled] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  useEffect(() => {
    setIsSupported(SpeechToTextService.isSupported());
    FeatureService.isSTTEnabled().then(setIsSTTEnabled);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRecording]);

  const handleStartRecording = async () => {
    if (!isSupported) {
      onError?.('Voice recording is not supported in this browser');
      return;
    }

    if (isRecording) {
      return;
    }

    try {
      await SpeechToTextService.startRecording();
      setIsRecording(true);
      setRecordingTime(0);
    } catch (error: any) {
      console.error('Failed to start recording:', error);
      onError?.(error.message || 'Failed to start recording');
    }
  };

  const handleStopRecording = async () => {
    if (!isRecording) {
      return;
    }

    try {
      setIsProcessing(true);
      setIsRecording(false);
      
      const audioBlob = await SpeechToTextService.stopRecording();
      const text = await SpeechToTextService.speechToText(audioBlob, { 
        language: 'auto' // Auto-detect language
      });
      
      if (text.trim()) {
        onTranscription(text);
      } else {
        onError?.('No speech detected. Please try again.');
      }
    } catch (error: any) {
      console.error('Failed to process recording:', error);
      onError?.(error.message || 'Failed to process recording');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleToggleRecording = () => {
    if (isRecording) {
      handleStopRecording();
    } else {
      handleStartRecording();
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isSupported || !isSTTEnabled) {
    return null; // Don't render if not supported or disabled
  }

  return (
    <div className="flex items-center gap-2">
      <Tooltip 
        title={
          isRecording 
            ? `Recording... ${formatTime(recordingTime)} - Click to stop`
            : isProcessing 
            ? 'Processing speech...'
            : 'Click to start voice recording'
        }
        side="top"
        sideOffset={5}
      >
        <button
          onClick={handleToggleRecording}
          disabled={disabled || isProcessing}
          className={`
            p-2 rounded-full transition-all duration-200 
            ${isRecording 
              ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
              : isProcessing
              ? 'bg-blue-500 text-white cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 text-white hover:scale-105'
            }
            ${disabled || isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
            ${className}
          `}
        >
          {isProcessing ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : isRecording ? (
            <StopIcon className="w-5 h-5" />
          ) : (
            <MicrophoneIcon className="w-5 h-5" />
          )}
        </button>
      </Tooltip>
      
      {isRecording && (
        <div className="flex items-center gap-2 text-sm text-red-600">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="font-mono">{formatTime(recordingTime)}</span>
        </div>
      )}
    </div>
  );
};

export default VoiceRecorderButton;
