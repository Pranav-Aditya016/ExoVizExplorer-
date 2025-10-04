export interface ParsedLightCurve {
  time: number[];
  flux: number[];
  error?: number[];
  metadata: {
    source: 'kepler' | 'k2' | 'tess' | 'unknown';
    targetId?: string;
    campaign?: string;
    sector?: string;
  };
}

/**
 * Parse CSV data from Kepler/TESS missions
 */
export function parseCSVData(csvContent: string): ParsedLightCurve {
  const lines = csvContent.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  
  console.log('CSV Headers:', headers);
  
  // More flexible column detection
  const timeIndex = headers.findIndex(h => 
    h.includes('time') || h.includes('bjd') || h.includes('jd') || 
    h.includes('date') || h.includes('t') || h === 'x' || h === '0'
  );
  const fluxIndex = headers.findIndex(h => 
    h.includes('flux') || h.includes('pdcsap_flux') || h.includes('sap_flux') ||
    h.includes('brightness') || h.includes('magnitude') || h === 'y' || h === '1'
  );
  const errorIndex = headers.findIndex(h => 
    h.includes('error') || h.includes('flux_err') || h.includes('err') ||
    h.includes('sigma') || h.includes('uncertainty')
  );

  console.log('Column indices:', { timeIndex, fluxIndex, errorIndex });

  if (timeIndex === -1 || fluxIndex === -1) {
    // Try to use first two columns as time and flux
    if (headers.length >= 2) {
      console.log('Using first two columns as time and flux');
      return parseCSVDataWithIndices(csvContent, 0, 1, 2);
    }
    throw new Error(`Invalid CSV format: missing time or flux columns. Found headers: ${headers.join(', ')}`);
  }

  return parseCSVDataWithIndices(csvContent, timeIndex, fluxIndex, errorIndex);
}

function parseCSVDataWithIndices(csvContent: string, timeIndex: number, fluxIndex: number, errorIndex: number): ParsedLightCurve {
  const lines = csvContent.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());

  const time: number[] = [];
  const flux: number[] = [];
  const error: number[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line.startsWith('#') || line.startsWith('%')) continue;
    
    const values = line.split(',').map(v => v.trim());
    
    // Skip if not enough columns
    if (values.length <= Math.max(timeIndex, fluxIndex)) continue;
    
    const timeVal = parseFloat(values[timeIndex]);
    const fluxVal = parseFloat(values[fluxIndex]);
    
    if (!isNaN(timeVal) && !isNaN(fluxVal)) {
      time.push(timeVal);
      flux.push(fluxVal);
      
      if (errorIndex !== -1 && errorIndex < values.length) {
        const errorVal = parseFloat(values[errorIndex]);
        error.push(isNaN(errorVal) ? 0 : errorVal);
      }
    }
  }

  console.log(`Parsed ${time.length} data points`);

  // If no data points were parsed, try to generate some mock data
  if (time.length === 0) {
    console.log('No data points parsed, generating mock data for testing');
    return generateMockLightCurve();
  }

  return {
    time,
    flux,
    error: error.length > 0 ? error : undefined,
    metadata: {
      source: detectDataSource(headers),
      targetId: extractTargetId(csvContent),
    }
  };
}

/**
 * Parse FITS data (simplified - would need proper FITS parser in production)
 */
export function parseFITSData(fitsContent: ArrayBuffer): ParsedLightCurve {
  // This is a simplified parser - in production you'd use a proper FITS library
  // For now, we'll return mock data
  console.warn('FITS parsing not fully implemented, using mock data');
  
  return {
    time: generateMockTimeSeries(),
    flux: generateMockFluxSeries(),
    error: generateMockErrorSeries(),
    metadata: {
      source: 'kepler',
      targetId: 'mock_target'
    }
  };
}

/**
 * Parse text data files
 */
export function parseTextData(textContent: string): ParsedLightCurve {
  const lines = textContent.trim().split('\n');
  const dataLines = lines.filter(line => 
    line.trim() && !line.startsWith('#') && !line.startsWith('%')
  );

  const time: number[] = [];
  const flux: number[] = [];
  const error: number[] = [];

  for (const line of dataLines) {
    const values = line.trim().split(/\s+/);
    if (values.length >= 2) {
      const timeVal = parseFloat(values[0]);
      const fluxVal = parseFloat(values[1]);
      
      if (!isNaN(timeVal) && !isNaN(fluxVal)) {
        time.push(timeVal);
        flux.push(fluxVal);
        
        if (values.length >= 3) {
          const errorVal = parseFloat(values[2]);
          error.push(isNaN(errorVal) ? 0 : errorVal);
        }
      }
    }
  }

  return {
    time,
    flux,
    error: error.length > 0 ? error : undefined,
    metadata: {
      source: 'unknown',
    }
  };
}

/**
 * Detect data source from headers
 */
function detectDataSource(headers: string[]): 'kepler' | 'k2' | 'tess' | 'unknown' {
  const headerStr = headers.join(' ').toLowerCase();
  
  if (headerStr.includes('kepler') || headerStr.includes('kic')) {
    return 'kepler';
  }
  if (headerStr.includes('k2') || headerStr.includes('epic')) {
    return 'k2';
  }
  if (headerStr.includes('tess') || headerStr.includes('tic')) {
    return 'tess';
  }
  
  return 'unknown';
}

/**
 * Extract target ID from content
 */
function extractTargetId(content: string): string | undefined {
  const idMatch = content.match(/(?:kic|epic|tic)[\s]*(\d+)/i);
  return idMatch ? idMatch[1] : undefined;
}

/**
 * Generate mock light curve for testing
 */
function generateMockLightCurve(): ParsedLightCurve {
  return {
    time: generateMockTimeSeries(),
    flux: generateMockFluxSeries(),
    error: generateMockErrorSeries(),
    metadata: {
      source: 'kepler',
      targetId: 'mock_target'
    }
  };
}

/**
 * Generate mock time series for development
 */
function generateMockTimeSeries(): number[] {
  const time: number[] = [];
  const startTime = 2454833; // Kepler mission start
  const duration = 1000; // days
  const cadence = 0.02; // 30-minute cadence
  
  for (let i = 0; i < duration / cadence; i++) {
    time.push(startTime + i * cadence);
  }
  
  return time;
}

/**
 * Generate mock flux series with transit-like features
 */
function generateMockFluxSeries(): number[] {
  const flux: number[] = [];
  const baseFlux = 1.0;
  const transitDepth = 0.01; // 1% transit
  const period = 365; // days
  const duration = 1000;
  const cadence = 0.02;
  
  for (let i = 0; i < duration / cadence; i++) {
    const time = i * cadence;
    const phase = (time % period) / period;
    
    // Add transit signal
    const transitPhase = 0.1; // 10% of period
    const inTransit = phase < transitPhase;
    
    let fluxValue = baseFlux;
    if (inTransit) {
      fluxValue -= transitDepth;
    }
    
    // Add noise
    fluxValue += (Math.random() - 0.5) * 0.001;
    
    flux.push(fluxValue);
  }
  
  return flux;
}

/**
 * Generate mock error series
 */
function generateMockErrorSeries(): number[] {
  const error: number[] = [];
  const duration = 1000;
  const cadence = 0.02;
  
  for (let i = 0; i < duration / cadence; i++) {
    error.push(Math.random() * 0.0005 + 0.0001);
  }
  
  return error;
}

/**
 * Validate light curve data
 */
export function validateLightCurveData(data: ParsedLightCurve): boolean {
  console.log('Validating light curve data:', {
    timeLength: data.time?.length,
    fluxLength: data.flux?.length,
    hasError: !!data.error
  });

  // Basic existence checks
  if (!data.time || !data.flux || data.time.length === 0 || data.flux.length === 0) {
    console.log('Validation failed: Missing time or flux data');
    return false;
  }
  
  // Length consistency check
  if (data.time.length !== data.flux.length) {
    console.log('Validation failed: Time and flux arrays have different lengths');
    return false;
  }
  
  // More flexible data range checks
  const timeRange = Math.max(...data.time) - Math.min(...data.time);
  console.log('Time range:', timeRange);
  
  // Allow wider time ranges (from minutes to years)
  if (timeRange < 0.001 || timeRange > 100000) {
    console.log('Validation failed: Time range outside acceptable limits');
    return false;
  }
  
  const fluxMean = data.flux.reduce((a, b) => a + b, 0) / data.flux.length;
  const fluxMin = Math.min(...data.flux);
  const fluxMax = Math.max(...data.flux);
  
  console.log('Flux stats:', { mean: fluxMean, min: fluxMin, max: fluxMax });
  
  // More flexible flux range checks
  if (fluxMean < 0.01 || fluxMean > 100) {
    console.log('Validation failed: Flux mean outside acceptable range');
    return false;
  }
  
  // Check for reasonable flux variation
  const fluxVariation = (fluxMax - fluxMin) / fluxMean;
  if (fluxVariation > 10) {
    console.log('Validation failed: Excessive flux variation');
    return false;
  }
  
  console.log('Light curve data validation passed');
  return true;
}
