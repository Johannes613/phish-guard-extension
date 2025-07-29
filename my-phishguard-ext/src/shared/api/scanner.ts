// src/shared/api/scanner.ts
import { AnalysisResult } from '@shared/types'; // <-- Corrected path and cleaned import

/**
 * Simulates analyzing a URL, first with a mock Google Web Risk check, then with a mock Gemini AI check.
 * @param url The URL to analyze.
 * @returns A promise that resolves with the simulated analysis result.
 */
export async function analyzeUrl(url: string): Promise<AnalysisResult> {
  // ... (The rest of the function is the same)
  console.log(`[Mock API] Analyzing: ${url}`);
  
  await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));

  if (url.includes('known-malware-site.com')) {
    return {
      url,
      riskLevel: 'HIGH',
      reason: 'This URL is flagged by Google for containing MALWARE.',
    };
  }
  if (url.includes('bank-of-your-name.secure-login.com')) {
    return {
      url,
      riskLevel: 'HIGH',
      reason: 'This URL uses deceptive subdomains to impersonate a financial institution.',
    };
  }
  if (url.includes('update-your-account.info')) {
    return {
      url,
      riskLevel: 'MEDIUM',
      reason: 'URL contains suspicious keywords ("update", "account") and a generic TLD.',
    };
  }
  if (url.includes('123.45.67.89')) {
    return {
        url,
        riskLevel: 'LOW',
        reason: 'Linking directly to an IP address can be risky, but is not confirmed to be malicious.',
    }
  }

  return {
    url,
    riskLevel: 'SAFE',
    reason: 'No threats detected by our analysis.',
  };
}