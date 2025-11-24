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
4. App displays:
