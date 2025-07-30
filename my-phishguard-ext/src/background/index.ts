import { analyzeUrl } from '@shared/api/scanner';
import { AnalysisResult, Message } from '@shared/types';

const apiKeys = {
  webRisk: import.meta.env.VITE_WEB_RISK_API_KEY,
  gemini: import.meta.env.VITE_GEMINI_API_KEY,
};

const cache = new Map<string, AnalysisResult>();
const CACHE_DURATION_MS = 10 * 60 * 1000;

chrome.runtime.onMessage.addListener((message: Message, sender) => {
  if (message.type === 'ANALYZE_URLS') {
    if (!apiKeys.webRisk || !apiKeys.gemini) {
      console.error("[Background] API keys are missing. Please check your .env file.");
      return;
    }
    handleUrlAnalysisRequest(message.urls, sender);
  }
});

async function handleUrlAnalysisRequest(urls: string[], sender: chrome.runtime.MessageSender) {
  const urlsToFetch: string[] = [];
  const cachedResults: AnalysisResult[] = [];

  for (const url of urls) {
    if (cache.has(url)) {
      cachedResults.push(cache.get(url)!);
    } else {
      urlsToFetch.push(url);
    }
  }

  const analysisPromises = urlsToFetch.map(url => analyzeUrl(url, apiKeys));
  const newResults = await Promise.all(analysisPromises);

  newResults.forEach(result => {
    cache.set(result.url, result);
    setTimeout(() => cache.delete(result.url), CACHE_DURATION_MS);
  });

  const allResults = [...cachedResults, ...newResults];
  console.log('[Background] Analysis complete. Preparing to send response...');

  if (sender.tab?.id) {
    try {
      chrome.tabs.sendMessage(sender.tab.id, {
        type: 'ANALYSIS_RESULT',
        results: allResults,
      });
      console.log('[Background] Successfully sent response to tab:', sender.tab.id); // <-- New success log
    } catch (error) {
      // This will now log any error, not just the bfcache one
      console.error('[Background] Failed to send message:', error); // <-- New error log
    }
  } else {
    console.warn('[Background] Cannot send response, sender tab ID is missing.'); // <-- New warning log
  }
}