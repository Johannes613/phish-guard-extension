// src/content/index.ts
import { AnalysisResult, AnalyzeUrlRequest } from "@shared/types"; // <-- Cleaned import

// ... (The rest of the file is the same)
function scanLinks() {
  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('a'));
  const urls = links
    .map(link => link.href)
    .filter(href => href.startsWith('http'));
  
  if (urls.length === 0) return;

  const uniqueUrls = [...new Set(urls)];

  console.log(`[Content] Found ${uniqueUrls.length} unique links to analyze.`);

  const request: AnalyzeUrlRequest = {
    type: 'ANALYZE_URLS',
    urls: uniqueUrls,
  };

  chrome.runtime.sendMessage(request, (results: AnalysisResult[]) => {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError.message);
      return;
    }
    applyAnalysisResults(results);
  });
}

function applyAnalysisResults(results: AnalysisResult[]) {
  for (const result of results) {
    if (result.riskLevel === 'SAFE') continue;

    const linksToUpdate = document.querySelectorAll<HTMLAnchorElement>(`a[href="${result.url}"]`);

    linksToUpdate.forEach(link => {
      link.style.borderBottom = `2px solid ${getRiskColor(result.riskLevel)}`;
      link.title = `[PhishGuard Warning: ${result.riskLevel}] ${result.reason}`;
    });
  }
}

function getRiskColor(riskLevel: AnalysisResult['riskLevel']): string {
  switch (riskLevel) {
    case 'HIGH': return '#FF4136'; // Red
    case 'MEDIUM': return '#FF851B'; // Orange
    case 'LOW': return '#FFDC00'; // Yellow
    default: return 'transparent';
  }
}
scanLinks();