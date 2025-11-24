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

## 🔍 What This App Does

1. User uploads an image  
2. The image is processed and sent to **Gemini Vision model**
3. The model checks for:
   - texture/skin irregularities
   - lighting inconsistencies
   - facial symmetry distortions
   - metadata anomalies
4. App displays: Verdict: REAL / FAKE
Confidence Score
Explanation Reasoning

---

## 📂 Project Structure


Deepfake-Image-Detection/
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

---

## 🔧 Setup & Installation

### 1️⃣ Install dependencies
```bash
npm install

2️⃣ Add your Gemini API Key
Create a .env file in the project root and add:
VITE_GEMINI_API_KEY=your_gemini_api_key_here

You can generate an API key from Google AI Studio.
3️⃣ Run the app
npm run dev

Open the local URL shown in the terminal — usually:
http://localhost:5173

4️⃣ Build for production (optional)
npm run build


🖥️ Usage Flow
StepAction1Upload an image (JPG / PNG / JPEG / WEBP)2Click Analyze3Wait for Gemini model processing4See verdict + confidence + reasoning

🧭 Roadmap (Planned Enhancements)


🔥 Heatmap/overlay highlighting suspicious image regions


📑 Drag-and-drop image support


💾 History of previous checks stored locally


📊 Confidence score visual gauge


🎥 Video deepfake detection support


📱 Mobile-friendly UI



⚠️ Disclaimer
This tool is intended only for research, learning, and awareness.
Do not use it for:


Harassment


Surveillance


Misuse of personal images


Spreading misinformation


Discrimination or privacy violation


Model predictions may be imperfect — always pair automated checks with human judgment.

⭐ Support
If you find this project useful and want to support future development, please consider giving the repository a Star ⭐.
Made with ❤️ using React, TypeScript, Vite & Google Gemini API.

---

If you ever want:
🚀 badges • 🎨 banner • 🌓 dark theme README • 📹 GIF demo preview • 🔌 deploy button  
just tell me **“README upgrade”** and I’ll enhance it instantly.

