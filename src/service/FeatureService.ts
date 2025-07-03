// Feature flags service
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
const FEATURES_API_ENDPOINT = `${API_BASE_URL}/api/features`;

export interface FeatureFlags {
  tts: boolean;
  stt: boolean;
}

export class FeatureService {
  private static features: FeatureFlags | null = null;
  private static fetchPromise: Promise<FeatureFlags> | null = null;

  // Fetch feature flags from backend
  static async getFeatures(): Promise<FeatureFlags> {
    // Return cached result if available
    if (this.features) {
      return this.features;
    }

    // Return existing promise if already fetching
    if (this.fetchPromise) {
      return this.fetchPromise;
    }

    // Start new fetch
    this.fetchPromise = this.fetchFeatures();
    
    try {
      this.features = await this.fetchPromise;
      return this.features;
    } catch (error) {
      // Reset promise on error so we can retry
      this.fetchPromise = null;
      throw error;
    }
  }

  private static async fetchFeatures(): Promise<FeatureFlags> {
    try {
      const response = await fetch(FEATURES_API_ENDPOINT, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch features: ${response.status}`);
      }

      const features = await response.json();
      console.log('🏁 Feature flags loaded:', features);
      
      return features;
    } catch (error) {
      console.error('❌ Failed to fetch feature flags:', error);
      // Return default values on error
      return {
        tts: false,
        stt: false
      };
    }
  }

  // Check if TTS is enabled
  static async isTTSEnabled(): Promise<boolean> {
    try {
      const features = await this.getFeatures();
      return features.tts;
    } catch (error) {
      console.error('Error checking TTS feature:', error);
      return false;
    }
  }

  // Check if STT is enabled
  static async isSTTEnabled(): Promise<boolean> {
    try {
      const features = await this.getFeatures();
      return features.stt;
    } catch (error) {
      console.error('Error checking STT feature:', error);
      return false;
    }
  }

  // Clear cache (useful for testing or when features change)
  static clearCache(): void {
    this.features = null;
    this.fetchPromise = null;
  }

  // Get cached features without fetching (returns null if not cached)
  static getCachedFeatures(): FeatureFlags | null {
    return this.features;
  }
}
