// src/App.tsx
import './index.css'; // Make sure to create/use some basic styles

function App() {
  const handleRescan = () => {
    // This is an example of how the popup can communicate with the content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0].id) {
        // Note: For this to work, you'd need to set up a message listener
        // in content.ts to handle a 'RESCAN_PAGE' message.
        // For now, this is a placeholder.
        console.log("Re-scan button clicked. Implement listener in content.ts");
        alert("Re-scan initiated! (See console for log)");
      }
    });
  };

  return (
    <div style={{ width: '250px', padding: '16px', textAlign: 'center' }}>
      <img src="/icon128.png" alt="PhishGuard Logo" style={{ width: '60px', marginBottom: '12px' }}/>
      <h1 style={{ fontSize: '1.2em', margin: '0 0 8px 0' }}>PhishGuard</h1>
      <p style={{ fontSize: '0.9em', margin: '0 0 16px 0' }}>Actively protecting you from phishing.</p>
      <button onClick={handleRescan}>
        Re-Scan Page
      </button>
    </div>
  );
}

export default App;