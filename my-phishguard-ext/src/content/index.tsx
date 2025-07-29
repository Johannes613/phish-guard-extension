import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import ReactDOM from 'react-dom/client';
import ConfirmationModal from '@popup/components/ConfirmationModal';
import { AnalysisResult, AnalyzeUrlRequest, Message } from "@shared/types";

let reactRoot: ReactDOM.Root | null = null;
let modalHost: HTMLElement | null = null;

// The setup function is now simpler as it doesn't need to handle CSS
function setupModalContainer() {
  if (document.getElementById('phishguard-modal-root')) return;

  modalHost = document.createElement('div');
  modalHost.id = 'phishguard-modal-root';
  document.body.appendChild(modalHost);

  reactRoot = ReactDOM.createRoot(modalHost);
}

// This function now unmounts the component and removes the host element
function hideModal() {
  reactRoot?.unmount();
  if (modalHost) {
    modalHost.remove();
    modalHost = null;
    reactRoot = null;
  }
}

// The showModal function remains the same
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

// The rest of the file (listeners, scanners, etc.) is exactly the same
chrome.runtime.onMessage.addListener((message: Message) => {
  if (message.type === 'ANALYSIS_RESULT') {
    applyAnalysisResults(message.results);
  }
});

function scanLinks() {
  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('a'));
  const urls = links.map(link => link.href).filter(href => href.startsWith('http'));
  if (urls.length === 0) return;
  const uniqueUrls = [...new Set(urls)];
  const request: AnalyzeUrlRequest = { type: 'ANALYZE_URLS', urls: uniqueUrls };
  chrome.runtime.sendMessage(request);
}

function applyAnalysisResults(results: AnalysisResult[]) {
  const resultsMap = new Map(results.map(r => [r.url, r]));
  document.querySelectorAll('a').forEach(link => {
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

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', scanLinks);
} else {
  scanLinks();
}