import { CustomError } from "./CustomError";
import { getAuthToken } from "../auth";

// Backend API endpoint
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
const STT_API_ENDPOINT = `${API_BASE_URL}/api/stt`;

export interface SpeechToTextOptions {
  model?: 'whisper-1';
  language?: string; // 'auto' or ISO language code like 'en', 'id', etc.
}

export class SpeechToTextService {
  private static mediaRecorder: MediaRecorder | null = null;
  private static audioChunks: Blob[] = [];
  private static isRecording = false;

  // Helper function to get authenticated headers
  private static async getAuthHeaders(): Promise<Record<string, string>> {
    const token = await getAuthToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json"
    };
    
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    
    return headers;
  }

  // Check if browser supports audio recording
  static isSupported(): boolean {
    return !!(navigator.mediaDevices &&
              typeof MediaRecorder !== 'undefined');
  }

  // Start recording audio
  static async startRecording(): Promise<void> {
    if (!this.isSupported()) {
      throw new Error('Audio recording is not supported in this browser');
    }

    if (this.isRecording) {
      throw new Error('Recording is already in progress');
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000
        } 
      });

      this.audioChunks = [];
      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.start();
      this.isRecording = true;
      
      console.log('🎤 Recording started');
    } catch (error) {
      console.error('Error starting recording:', error);
      throw new CustomError('Failed to start recording. Please check microphone permissions.', error);
    }
  }

  // Stop recording and return audio blob
  static async stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder || !this.isRecording) {
        reject(new Error('No recording in progress'));
        return;
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        this.isRecording = false;
        
        // Stop all media tracks
        if (this.mediaRecorder?.stream) {
          this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
        }
        
        console.log('🎤 Recording stopped, audio size:', audioBlob.size);
        resolve(audioBlob);
      };

      this.mediaRecorder.stop();
    });
  }

  // Convert audio blob to base64
  static async blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  // Convert speech to text using OpenAI Whisper
  static async speechToText(audioBlob: Blob, options: SpeechToTextOptions = {}): Promise<string> {
    try {
      const headers = await this.getAuthHeaders();
      const base64Audio = await this.blobToBase64(audioBlob);

      const requestBody = {
        audio: base64Audio,
        model: options.model || 'whisper-1',
        language: options.language || 'auto'
      };

      const response = await fetch(STT_API_ENDPOINT, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const err = await response.json();
        throw new CustomError(err.error || 'Speech-to-text conversion failed', err);
      }

      const data = await response.json();
      return data.text || '';
    } catch (error: any) {
      console.error('Speech-to-text error:', error);
      throw new CustomError(error.message || 'Failed to convert speech to text', error);
    }
  }

  // Record audio and convert to text in one step
  static async recordAndTranscribe(options: SpeechToTextOptions = {}): Promise<string> {
    await this.startRecording();
    
    // Wait for user to stop recording
    return new Promise((resolve, reject) => {
      // Set up a one-time listener for when recording stops
      const checkStop = setInterval(async () => {
        if (!this.isRecording) {
          clearInterval(checkStop);
          try {
            const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
            const text = await this.speechToText(audioBlob, options);
            resolve(text);
          } catch (error) {
            reject(error);
          }
        }
      }, 100);
    });
  }

  // Get recording status
  static getRecordingStatus(): { isRecording: boolean; isSupported: boolean } {
    return {
      isRecording: this.isRecording,
      isSupported: this.isSupported()
    };
  }
}
