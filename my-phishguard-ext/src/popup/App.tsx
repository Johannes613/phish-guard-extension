import './index.css'; 

function App() {
  const handleRescan = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0].id) {
        console.log("Re-scan button clicked. Implement listener in content.ts");
        alert("Re-scan initiated! (See console for log)");
      }
    });
  };

  return (
    <div style={{ width: '250px', padding: '16px', textAlign: 'center' }}>
      <h1 style={{ fontSize: '1.2em', margin: '0 0 8px 0' }}>PhishGuard</h1>
      <p style={{ fontSize: '0.9em', margin: '0 0 16px 0' }}>Actively protecting you from phishing.</p>
      <button onClick={handleRescan}>
        Re-Scan Page
      </button>
    </div>
  );
}

export default App;