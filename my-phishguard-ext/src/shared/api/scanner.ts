import { AnalysisResult, RiskLevel } from '@shared/types';

interface ApiKeys {
  webRisk: string;
  gemini: string;
}

export async function analyzeUrl(url: string, keys: ApiKeys): Promise<AnalysisResult> {
  const webRiskResult = await checkGoogleWebRisk(url, keys.webRisk);
  if (webRiskResult.riskLevel === 'HIGH') {
    return webRiskResult;
  }
  return await analyzeWithGemini(url, keys.gemini);
}

async function checkGoogleWebRisk(url: string, apiKey: string): Promise<AnalysisResult> {
  const apiUrl = `https://webrisk.googleapis.com/v1/uris:search?key=${apiKey}&threatTypes=MALWARE&threatTypes=SOCIAL_ENGINEERING&uri=${encodeURIComponent(url)}`;
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    if (data.threat) {
      return {
        url,
        riskLevel: 'HIGH',
        reason: `This URL is on Google's blacklist for: ${data.threat.threatTypes.join(', ')}.`,
      };
    }
    return { url, riskLevel: 'SAFE', reason: 'Passed Google Web Risk check.' };
  } catch (error) {
    console.error('Web Risk API Error:', error);
    return { url, riskLevel: 'SAFE', reason: 'Could not verify with Google Web Risk.' };
  }
}

async function analyzeWithGemini(url: string, apiKey: string): Promise<AnalysisResult> {
  // --- THE ONLY CHANGE IS HERE ---
  // Changed "gemini-1.0-pro" back to "gemini-pro"
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

  const prompt = `
    As a cybersecurity expert, analyze the following URL for phishing indicators: "${url}".
    Consider domain age, subdomains, suspicious keywords (login, secure, account, verify), TLD, and character substitution.
    Respond ONLY with a valid JSON object with two keys: "riskLevel" (string: "SAFE", "LOW", "MEDIUM", or "HIGH") and "reason" (string: a concise, one-sentence explanation of your finding).
  `;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const jsonString = data.candidates[0].content.parts[0].text;
    const aiResult: { riskLevel: RiskLevel; reason: string } = JSON.parse(jsonString);
    return { url, ...aiResult };
  } catch (error) {
    console.error('Gemini API Error:', error);
    return { url, riskLevel: 'SAFE', reason: 'AI analysis could not be completed.' };
  }
}