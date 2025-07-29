import { analyzeUrl } from '@shared/api/scanner';
import { AnalysisResult, Message } from '@shared/types';

const cache = new Map<string, AnalysisResult>();
const CACHE_DURATION_MS = 10 * 60 * 1000;

// The 'sender' parameter is now important
chrome.runtime.onMessage.addListener((message: Message, sender) => {
  if (message.type === 'ANALYZE_URLS') {
    // We now handle the response inside this function
    handleUrlAnalysisRequest(message.urls, sender);
  }
  // No need to return true anymore
});

async function handleUrlAnalysisRequest(urls: string[], sender: chrome.runtime.MessageSender) {
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

  console.log('[Background] Analysis complete. Sending response to tab:', sender.tab?.id);

  // --- KEY CHANGE ---
  // Send a new message back to the content script in the specific tab
  if (sender.tab?.id) {
    chrome.tabs.sendMessage(sender.tab.id, {
      type: 'ANALYSIS_RESULT',
      results: results,
    });
  }
}