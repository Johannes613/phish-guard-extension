<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 1000px; margin: auto; padding: 20px;">
  <h1>PhishGuard: AI-Powered Real-Time Phishing Link Detector</h1>

  <div style="margin-bottom: 20px;">
    <img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript Badge">
    <img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB" alt="React Badge">
    <img src="https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white" alt="Vite Badge">
    <img src="https://img.shields.io/badge/MUI-%230081CB.svg?style=for-the-badge&logo=mui&logoColor=white" alt="Material-UI Badge">
    <img src="https://img.shields.io/badge/Google%20Chrome-4285F4?style=for-the-badge&logo=GoogleChrome&logoColor=white" alt="Chrome Badge">
    <img src="https://img.shields.io/badge/Gemini_API-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Gemini API Badge">
  </div>

  <p><strong>PhishGuard</strong> is an intelligent Chrome browser extension that provides real-time protection against phishing attacks. It automatically scans every link on a webpage, using a powerful dual-layer system that checks against known threat databases and leverages the Google Gemini AI for nuanced, dynamic analysis of unknown URLs. When a risky link is clicked, PhishGuard presents a professional, AI-generated warning, empowering users to make informed decisions before proceeding.</p>

  <hr/>

  <h2>Live Demo</h2>
  <p><em>As a browser extension, PhishGuard is installed directly into your browser. The demo below shows it in action on a webpage.</em></p>
  
  <h3>Application Demo</h3>
 <img src="https://i.imgur.com/mJ2N92X.gif" 
       alt="PhishGuard in action, showing a warning modal when a risky link is clicked." 
       style="max-width: 100%; height: auto; border: 1px solid #ccc; border-radius: 8px;" />


  <hr/>

  <h2>The Problem</h2>
  <ul>
    <li><strong>Sophisticated Phishing Attacks:</strong> Malicious links are often disguised to look like legitimate URLs from trusted sources, making them difficult for users to identify.</li>
    <li><strong>Information Overload:</strong> Modern webpages contain dozens or hundreds of links, and it's impractical for a user to manually vet each one.</li>
    <li><strong>Hidden Dangers:</strong> The malicious intent of a URL is not obvious from its text. Attackers use redirects and complex subdomains to hide their tracks.</li>
    <li><strong>Slow Blacklist Updates:</strong> Traditional blacklist-based protectors can be slow to update, leaving users vulnerable to newly created phishing sites.</li>
  </ul>
  <p><strong>PhishGuard</strong> addresses these problems by providing an automated, intelligent, and real-time analysis shield directly within the browser.</p>

  <hr/>

  <h2>Core Features</h2>

  <h3>1. Real-Time & Dynamic Link Scanning</h3>
  <ul>
    <li><strong>Automatic Analysis:</strong> Scans all hyperlinks as soon as a page loads.</li>
    <li><strong>Dynamic Content Support:</strong> Uses a `MutationObserver` to detect and analyze links that are added to the page after the initial load (e.g., in infinite scroll feeds).</li>
  </ul>

  <h3>2. Dual-Layer Threat Analysis</h3>
  <ul>
    <li><strong>Instant Blacklist Check:</strong> First, every URL is checked against Google's Web Risk API, a massive, real-time database of known threats.</li>
    <li><strong>AI-Powered Heuristic Analysis:</strong> If a URL is not a known threat, it is sent to the Google Gemini API for deep analysis of phishing patterns, domain characteristics, and suspicious keywords.</li>
  </ul>

  <h3>3. Interactive Warning System</h3>
  <ul>
    <li><strong>Custom Warning Modal:</strong> When a user clicks on a risky link, a professional Material-UI modal appears, preventing immediate navigation.</li>
    <li><strong>AI-Generated Descriptions:</strong> The modal displays the risk level and a concise, AI-generated reason for the warning, explaining why the link is considered dangerous.</li>
    <li><strong>User Control:</strong> The user is given clear options to "Go Back" to safety, "Proceed Anyway" if they trust the link, or "Report Phishing".</li>
  </ul>

  <hr/>

  <h2>Tech Stack</h2>
  <table border="1" cellspacing="0" cellpadding="8" style="width: 100%; border-collapse: collapse;">
    <tr style="background-color: #f2f2f2;">
      <th style="text-align: left;">Layer</th>
      <th style="text-align: left;">Technologies Used</th>
    </tr>
    <tr><td><strong>Frontend (Content & Popup)</strong></td><td>React, TypeScript, Material-UI, Vite</td></tr>
    <tr><td><strong>Extension Framework</strong></td><td>CRXJS Vite Plugin</td></tr>
    <tr><td><strong>AI & Threat Intelligence</strong></td><td>Google Gemini API, Google Web Risk API</td></tr>
  </table>

  <hr/>

  <h2>Getting Started Locally</h2>

  <h3>Prerequisites</h3>
  <ul>
    <li>Node.js (v18+) & npm</li>
    <li>Google Chrome</li>
  </ul>

  <h3>Installation & Setup</h3>
  <ol>
    <li>
      <strong>Clone the repository:</strong>
      <pre><code>git clone https://github.com/your-username/phishguard-extension.git
cd phishguard-extension</code></pre>
    </li>
    <li>
      <strong>Install dependencies:</strong>
      <pre><code>npm install</code></pre>
    </li>
    <li>
      <strong>Set up API Keys:</strong>
      <p>Create a file named <code>.env</code> in the root of the project and add your API keys:</p>
      <pre><code>VITE_WEB_RISK_API_KEY="your_google_web_risk_api_key_here"
VITE_GEMINI_API_KEY="your_google_gemini_api_key_here"</code></pre>
    </li>
  </ol>

  <h3>Running the Extension</h3>
  <ol>
    <li>
      <strong>Build the extension:</strong>
      <pre><code>npm run build</code></pre>
      <p>This will create a <code>dist</code> folder with the final extension files.</p>
    </li>
    <li>
      <strong>Load the extension in Chrome:</strong>
      <ul>
          <li>Open Chrome and navigate to <code>chrome://extensions</code>.</li>
          <li>Enable <strong>"Developer mode"</strong> in the top right corner.</li>
          <li>Click the <strong>"Load unpacked"</strong> button.</li>
          <li>Select the <code>dist</code> folder from your project.</li>
      </ul>
      <p>The PhishGuard extension is now active and will protect you as you browse.</p>
    </li>
  </ol>

</body>
</html>
