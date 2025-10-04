export interface ModelPrediction {
  probability: number;
  confidence: number;
  planetType: string;
  isHabitable: boolean;
  hasAtmosphere: boolean;
  hasWater: boolean;
  temperature: number;
  radius: number;
  distanceFromStar: number;
}

export interface LightCurveData {
  time: number[];
  flux: number[];
  error?: number[];
}

class MLModelService {
  private isModelLoaded = false;
  private loadingPromise: Promise<void> | null = null;

  /**
   * Load the combined_model.h5 file
   */
  async loadModel(): Promise<void> {
    if (this.isModelLoaded) {
      return;
    }

    if (this.loadingPromise) {
      return this.loadingPromise;
    }

    this.loadingPromise = this._loadModel();
    return this.loadingPromise;
  }

  private async _loadModel(): Promise<void> {
    try {
      console.log('Loading ML model...');
      
      // For now, we'll use a mock model that simulates the real model behavior
      // In production, you would load the actual TensorFlow.js model here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate loading time
      
      this.isModelLoaded = true;
      console.log('ML model loaded successfully (mock mode)');
    } catch (error) {
      console.error('Error loading ML model:', error);
      // Fallback to mock model for development
      this.isModelLoaded = true;
      console.log('Using mock model for development');
    }
  }

  /**
   * Preprocess light curve data for model input
   */
  private preprocessLightCurve(data: LightCurveData): number[] {
    const { time, flux, error } = data;
    
    // Normalize the data
    const normalizedFlux = this.normalizeArray(flux);
    const normalizedTime = this.normalizeArray(time);
    
    // Create feature vector
    const features = [
      ...normalizedTime,
      ...normalizedFlux,
      ...(error ? this.normalizeArray(error) : new Array(flux.length).fill(0))
    ];

    // Ensure we have the right input shape (assuming the model expects 1000 features)
    return this.padOrTruncate(features, 1000);
  }

  /**
   * Normalize array to 0-1 range
   */
  private normalizeArray(arr: number[]): number[] {
    const min = Math.min(...arr);
    const max = Math.max(...arr);
    const range = max - min;
    
    if (range === 0) return arr.map(() => 0.5);
    
    return arr.map(val => (val - min) / range);
  }

  /**
   * Pad or truncate array to target length
   */
  private padOrTruncate(arr: number[], targetLength: number): number[] {
    if (arr.length >= targetLength) {
      return arr.slice(0, targetLength);
    }
    
    const padding = new Array(targetLength - arr.length).fill(0);
    return [...arr, ...padding];
  }

  /**
   * Make prediction using the loaded model
   */
  async predict(data: LightCurveData): Promise<ModelPrediction> {
    try {
      await this.loadModel();

      // Preprocess the data
      const features = this.preprocessLightCurve(data);
      
      // Simulate model prediction based on data characteristics
      const probability = this.simulateModelPrediction(features, data);
      const confidence = Math.min(probability * 1.2, 1.0);
      
      return {
        probability,
        confidence,
        planetType: this.classifyPlanetType(probability, data),
        isHabitable: probability > 0.7,
        hasAtmosphere: probability > 0.6,
        hasWater: probability > 0.8,
        temperature: this.estimateTemperature(probability, data),
        radius: this.estimateRadius(probability, data),
        distanceFromStar: this.estimateDistance(probability, data)
      };
    } catch (error) {
      console.error('Error making prediction:', error);
      return this.getMockPrediction(data);
    }
  }

  /**
   * Simulate model prediction based on data characteristics
   */
  private simulateModelPrediction(features: number[], data: LightCurveData): number {
    // Analyze flux variations (transit-like features)
    const fluxVariations = this.analyzeFluxVariations(data.flux);
    
    // Analyze periodicity
    const periodicity = this.analyzePeriodicity(data.time, data.flux);
    
    // Analyze data quality
    const dataQuality = this.analyzeDataQuality(data);
    
    // Combine factors to get probability
    const baseProbability = (fluxVariations * 0.4 + periodicity * 0.3 + dataQuality * 0.3);
    
    // Add some randomness to simulate model uncertainty
    const noise = (Math.random() - 0.5) * 0.1;
    
    return Math.max(0, Math.min(1, baseProbability + noise));
  }

  /**
   * Analyze flux variations for transit-like features
   */
  private analyzeFluxVariations(flux: number[]): number {
    const mean = flux.reduce((a, b) => a + b, 0) / flux.length;
    const variance = flux.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / flux.length;
    const stdDev = Math.sqrt(variance);
    
    // Higher variation suggests potential transits
    return Math.min(stdDev * 10, 1);
  }

  /**
   * Analyze periodicity in the data
   */
  private analyzePeriodicity(time: number[], flux: number[]): number {
    // Simple periodicity analysis
    const timeSpan = Math.max(...time) - Math.min(...time);
    const fluxRange = Math.max(...flux) - Math.min(...flux);
    
    // Look for periodic patterns
    const normalizedVariation = fluxRange / (Math.max(...flux) + Math.min(...flux));
    
    return Math.min(normalizedVariation * 2, 1);
  }

  /**
   * Analyze data quality
   */
  private analyzeDataQuality(data: LightCurveData): number {
    const { time, flux, error } = data;
    
    // Check data completeness
    const completeness = flux.length / 1000; // Assume 1000 is ideal length
    
    // Check for gaps in time series
    const timeGaps = this.detectTimeGaps(time);
    const gapQuality = Math.max(0, 1 - timeGaps);
    
    // Check error levels
    const errorQuality = error ? 
      Math.max(0, 1 - (error.reduce((a, b) => a + b, 0) / error.length) * 100) : 1;
    
    return (completeness + gapQuality + errorQuality) / 3;
  }

  /**
   * Detect gaps in time series
   */
  private detectTimeGaps(time: number[]): number {
    if (time.length < 2) return 1;
    
    const intervals = [];
    for (let i = 1; i < time.length; i++) {
      intervals.push(time[i] - time[i-1]);
    }
    
    const medianInterval = intervals.sort((a, b) => a - b)[Math.floor(intervals.length / 2)];
    const largeGaps = intervals.filter(interval => interval > medianInterval * 3).length;
    
    return largeGaps / intervals.length;
  }

  /**
   * Classify planet type based on probability and data characteristics
   */
  private classifyPlanetType(probability: number, data: LightCurveData): string {
    if (probability > 0.9) return 'Super Earth';
    if (probability > 0.7) return 'Terrestrial';
    if (probability > 0.5) return 'Mini-Neptune';
    return 'Gas Giant';
  }

  /**
   * Estimate temperature based on probability and orbital characteristics
   */
  private estimateTemperature(probability: number, data: LightCurveData): number {
    // Base temperature estimation
    const baseTemp = 200 + (probability * 200);
    return Math.round(baseTemp);
  }

  /**
   * Estimate radius based on probability
   */
  private estimateRadius(probability: number, data: LightCurveData): number {
    // Estimate radius in Earth radii
    return 0.5 + (probability * 2.5);
  }

  /**
   * Estimate distance from star based on probability
   */
  private estimateDistance(probability: number, data: LightCurveData): number {
    // Estimate distance in AU
    return 0.02 + (probability * 0.5);
  }

  /**
   * Get mock prediction for development/fallback
   */
  private getMockPrediction(data: LightCurveData): ModelPrediction {
    const probability = 0.7 + Math.random() * 0.25;
    
    return {
      probability,
      confidence: probability * 0.9,
      planetType: this.classifyPlanetType(probability, data),
      isHabitable: probability > 0.7,
      hasAtmosphere: probability > 0.6,
      hasWater: probability > 0.8,
      temperature: this.estimateTemperature(probability, data),
      radius: this.estimateRadius(probability, data),
      distanceFromStar: this.estimateDistance(probability, data)
    };
  }

  /**
   * Check if model is loaded
   */
  isLoaded(): boolean {
    return this.isModelLoaded;
  }

  /**
   * Dispose of the model to free memory
   */
  dispose(): void {
    this.isModelLoaded = false;
    this.loadingPromise = null;
  }
}

// Export singleton instance
export const mlModelService = new MLModelService();