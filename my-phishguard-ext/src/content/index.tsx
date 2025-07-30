import ReactDOM from 'react-dom/client';
import ConfirmationModal from '@popup/components/ConfirmationModal';
import { AnalysisResult, AnalyzeUrlRequest, Message } from "@shared/types";
import modalCSS from '@popup/components/ConfirmationModal.css?inline';

let reactRoot: ReactDOM.Root | null = null;
let modalHost: HTMLElement | null = null;

// --- All of the modal and event listener code is the same ---

function setupModalContainer() {
  if (document.getElementById('phishguard-modal-root')) return;
  modalHost = document.createElement('div');
  modalHost.id = 'phishguard-modal-root';
  document.body.appendChild(modalHost);
  const shadowRoot = modalHost.attachShadow({ mode: 'open' });
  const styleElement = document.createElement('style');
  styleElement.textContent = modalCSS;
  shadowRoot.appendChild(styleElement);
  const reactRenderDiv = document.createElement('div');
  shadowRoot.appendChild(reactRenderDiv);
  reactRoot = ReactDOM.createRoot(reactRenderDiv);
}

function hideModal() {
  reactRoot?.unmount();
  if (modalHost) {
    modalHost.remove();
    modalHost = null;
    reactRoot = null;
  }
}

function showModal(link: HTMLAnchorElement, riskLevel: string, riskReason: string) {
  setupModalContainer();
  const onConfirm = () => {
    hideModal();
    window.location.href = link.href;
  };
  const onCancel = () => hideModal();
  const onReport = () => {
    alert(`Thank you for reporting ${link.href} as a potential phishing site.`);
    hideModal();
  };

  reactRoot?.render(
    <ConfirmationModal 
      isOpen={true}
      riskLevel={riskLevel}
      riskReason={riskReason}
      onConfirm={onConfirm}
      onCancel={onCancel}
      onReport={onReport}
    />
  );
}

chrome.runtime.onMessage.addListener((message: Message) => {
  if (message.type === 'ANALYSIS_RESULT') {
    applyAnalysisResults(message.results);
  }
});

// --- UPDATED SCAN FUNCTION ---
// The scanLinks function will now only scan links that haven't been processed yet.
function scanLinks() {
  // Select only anchor tags that do NOT have a 'data-risk-level' attribute
  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('a:not([data-risk-level])'));

  const urls = links
    .map(link => link.href)
    .filter(href => href.startsWith('http'));

  if (urls.length === 0) return;
  const uniqueUrls = [...new Set(urls)];
  console.log(`[Content] Found ${uniqueUrls.length} new links to analyze.`);
  const request: AnalyzeUrlRequest = { type: 'ANALYZE_URLS', urls: uniqueUrls };
  chrome.runtime.sendMessage(request);
}

function applyAnalysisResults(results: AnalysisResult[]) {
  const resultsMap = new Map(results.map(r => [r.url, r]));
  // We still query all links here to apply the data attributes
  document.querySelectorAll('a').forEach(link => {
    // Only update links that we just got a result for
    const result = resultsMap.get(link.href);
    if (result) {
      link.dataset.riskLevel = result.riskLevel;
      link.dataset.riskReason = result.reason;
    }
  });
}

document.body.addEventListener('click', (event) => {
  const link = (event.target as HTMLElement).closest('a');
  if (!link || !link.dataset.riskLevel || link.dataset.riskLevel === 'SAFE') return;
  event.preventDefault();
  showModal(link, link.dataset.riskLevel, link.dataset.riskReason || 'No reason provided.');
}, true);

// --- NEW MUTATION OBSERVER ---
// This is the key to detecting new links added to the page.
const observer = new MutationObserver((mutations) => {
  // We use a debounce timer to avoid scanning too frequently if the page changes rapidly
  let timer;
  clearTimeout(timer);
  timer = setTimeout(() => {
    scanLinks();
  }, 500);
});

// Start observing the entire document body for changes
observer.observe(document.body, {
  childList: true,
  subtree: true,
});

// Run the initial scan
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', scanLinks);
} else {
  scanLinks();
}