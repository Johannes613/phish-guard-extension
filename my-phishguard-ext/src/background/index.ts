// src/background/index.ts
import { analyzeUrl } from '@shared/api/scanner';
import { AnalysisResult, Message } from '@shared/types'; // <-- Cleaned import

// ... (cache definition is the same)
const cache = new Map<string, AnalysisResult>();
const CACHE_DURATION_MS = 10 * 60 * 1000;

chrome.runtime.onMessage.addListener((message: Message, _sender, sendResponse) => { // <-- Renamed sender
  if (message.type === 'ANALYZE_URLS') {
    handleUrlAnalysisRequest(message.urls).then(sendResponse);
    return true; 
  }
});

// ... (handleUrlAnalysisRequest function is the same)
async function handleUrlAnalysisRequest(urls: string[]): Promise<AnalysisResult[]> {
  const results: AnalysisResult[] = [];
  const urlsToFetch: string[] = [];

  for (const url of urls) {
    if (cache.has(url)) {
      results.push(cache.get(url)!);
    } else {
      urlsToFetch.push(url);
    }
  }

  if (urlsToFetch.length > 0) {
    const analysisPromises = urlsToFetch.map(analyzeUrl);
    const newResults = await Promise.all(analysisPromises);
    
    for (const result of newResults) {
      cache.set(result.url, result);
      results.push(result);
      setTimeout(() => cache.delete(result.url), CACHE_DURATION_MS);
    }
  }
  
  console.log('[Background] Analysis complete.', results);
  return results;
}