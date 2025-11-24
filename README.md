# 🧠 AI Deepfake Image Detector — React + TypeScript + Vite + Gemini API

Detect whether an image is **REAL** or **AI-generated/manipulated** using **Google Gemini Vision API**, wrapped inside a fast and modern **React + TypeScript + Vite** frontend.

---

## 🚀 Tech Stack

| Layer        | Technology                          |
|-------------|--------------------------------------|
| Framework   | React + TypeScript                   |
| Build Tool  | Vite                                 |
| AI Model    | Google Gemini Vision API             |
| Services    | `/services/geminiService.ts`         |
| Utilities   | `/utils/dataGenerator.ts`            |
| Typing      | `/types.ts`                          |
| Metadata    | `metadata.json`                      |

---



<h2>🔍 What This App Does</h2>

<ol>
  <li>User uploads an image</li>
  <li>The image is processed and sent to the <b>Gemini Vision model</b></li>
  <li>The model checks for:
    <ul>
      <li>texture / skin irregularities</li>
      <li>lighting inconsistencies</li>
      <li>facial symmetry distortions</li>
      <li>metadata anomalies</li>
    </ul>
  </li>
  <li>The app displays:
    <pre><code>Verdict: REAL / FAKE
Confidence Score
Explanation Reasoning
</code></pre>
  </li>
</ol>

<hr />

<h2>📂 Project Structure</h2>

<pre><code>Deepfake-Image-Detection/
├─ components/                 # UI components
├─ services/
│   └─ geminiService.ts        # Gemini API caller
├─ utils/
│   └─ dataGenerator.ts        # helper utilities
├─ types.ts                    # shared interfaces
├─ App.tsx                     # main UI screen
├─ index.tsx                   # app entry point
├─ index.html                  # HTML template
├─ metadata.json               # model metadata
├─ package.json
├─ tsconfig.json
└─ vite.config.ts
</code></pre>

<hr />

<h2>🔧 Setup & Installation</h2>

<h3>1️⃣ Install dependencies</h3>
<pre><code>npm install
</code></pre>

<h3>2️⃣ Add your Gemini API Key</h3>
<p>Create a <code>.env</code> file in the project root and add:</p>
<pre><code>VITE_GEMINI_API_KEY=your_gemini_api_key_here
</code></pre>
<p>You can generate an API key from <b>Google AI Studio</b>.</p>

<h3>3️⃣ Run the app</h3>
<pre><code>npm run dev
</code></pre>
<p>Open the local URL shown in the terminal — usually:</p>
<pre><code>http://localhost:5173
</code></pre>

<h3>4️⃣ Build for production (optional)</h3>
<pre><code>npm run build
</code></pre>

<hr />

<h2>🖥️ Usage Flow</h2>

<table>
  <thead>
    <tr>
      <th>Step</th>
      <th>Action</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td>Upload an image (JPG / PNG / JPEG / WEBP)</td>
    </tr>
    <tr>
      <td>2</td>
      <td>Click <b>Analyze</b></td>
    </tr>
    <tr>
      <td>3</td>
      <td>Wait for Gemini model processing</td>
    </tr>
    <tr>
      <td>4</td>
      <td>See verdict + confidence + reasoning</td>
    </tr>
  </tbody>
</table>

<hr />

<h2>🧭 Roadmap (Planned Enhancements)</h2>
<ul>
  <li>🔥 Heatmap / overlay highlighting suspicious image regions</li>
  <li>📑 Drag-and-drop image support</li>
  <li>💾 History of previous checks stored locally</li>
  <li>📊 Confidence score visual gauge</li>
  <li>🎥 Video deepfake detection support</li>
  <li>📱 Mobile-friendly UI</li>
</ul>

<hr />

<h2>⚠️ Disclaimer</h2>
<p>
  This tool is intended <b>only for research, learning, and awareness</b>.<br />
  Do not use it for:
</p>
<ul>
  <li>Harassment</li>
  <li>Surveillance</li>
  <li>Misuse of personal images</li>
  <li>Spreading misinformation</li>
  <li>Discrimination or privacy violation</li>
</ul>
<p>
  Model predictions may be imperfect — always pair automated checks with human judgment.
</p>

<hr />

<h2>⭐ Support</h2>
<p>
  If you find this project useful and want to support future development, please consider giving the repository a
  <b>Star ⭐</b>.
</p>
<p>
  Made with ❤️ using <b>React, TypeScript, Vite &amp; Google Gemini API</b>.
</p>

