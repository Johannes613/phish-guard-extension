
export type RiskLevel = 'SAFE' | 'LOW' | 'MEDIUM' | 'HIGH';

export interface AnalysisResult {
  url: string;
  riskLevel: RiskLevel;
  reason: string;
}

export interface AnalyzeUrlRequest {
  type: 'ANALYZE_URLS';
  urls: string[];
}

export interface AnalysisResponse {
  type: 'ANALYSIS_RESULT';
  results: AnalysisResult[];
}

export type Message = AnalyzeUrlRequest | AnalysisResponse;