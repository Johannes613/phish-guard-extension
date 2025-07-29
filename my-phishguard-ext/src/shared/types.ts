// src/types.ts

export type RiskLevel = 'SAFE' | 'LOW' | 'MEDIUM' | 'HIGH';

// The result of a URL analysis
export interface AnalysisResult {
  url: string;
  riskLevel: RiskLevel;
  reason: string;
}

// Message sent from the Content Script to the Background Script
export interface AnalyzeUrlRequest {
  type: 'ANALYZE_URLS';
  urls: string[];
}

// Message sent from the Background Script back to the Content Script
export interface AnalysisResponse {
  type: 'ANALYSIS_RESULT';
  results: AnalysisResult[];
}

// Union type for all possible messages
export type Message = AnalyzeUrlRequest | AnalysisResponse;