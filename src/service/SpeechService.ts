import {OpenAIModel} from "../models/model";
import {CustomError} from "./CustomError";
import {SpeechSettings} from "../models/SpeechSettings";
import { getAuthToken } from "../auth";

// Backend API endpoints
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
const TTS_API_ENDPOINT = `${API_BASE_URL}/api/tts`;
const MODELS_API_ENDPOINT = `${API_BASE_URL}/api/models`;

export class SpeechService {
  private static models: Promise<OpenAIModel[]> | null = null;

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

  static async textToSpeech(text: string, settings: SpeechSettings): Promise<string> {
    const endpoint = TTS_API_ENDPOINT;
    const headers = await this.getAuthHeaders();

    if (text.length > 4096) {
      throw new Error("Input text exceeds the maximum length of 4096 characters.");
    }

    if (settings.speed < 0.25 || settings.speed > 4.0) {
      throw new Error("Speed must be between 0.25 and 4.0.");
    }

    const requestBody = {
      model: settings.id,
      voice: settings.voice,
      text: text,
      speed: settings.speed,
      response_format: "mp3",
    };

    const response = await fetch(endpoint, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new CustomError(err.error.message, err);
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  }

  static getModels = (): Promise<OpenAIModel[]> => {
    return SpeechService.fetchModels();
  };

  static async fetchModels(): Promise<OpenAIModel[]> {
    if (this.models !== null) {
      return this.models;
    }

    try {
      const headers = await this.getAuthHeaders();
      
      const response = await fetch(MODELS_API_ENDPOINT, {
        headers: headers,
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error.message);
      }

      const data = await response.json();
      const models: OpenAIModel[] = data.data.filter((model: OpenAIModel) => model.id.includes("tts"));
      this.models = Promise.resolve(models);
      return models;
    } catch (err: any) {
      throw new Error(err.message || err);
    }
  }
}
