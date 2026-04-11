# SIGMA - Sistem Intelijen Governance & Monitoring Anggaran

> **Satu Platform AI. Dua Kekuatan. Satu Misi: Pemerintahan Bersih.**

SIGMA is an unprecedented, unified intelligence platform designed to eradicate corruption and ensure optimal local government performance. By merging APBD Forensics (Money Intelligence) with Regulation Genome (Regulatory Intelligence), SIGMA doesn't just detect anomalous spending—it automatically cross-references financial anomalies with the exact legal statutes being violated.

Built for the Hackathon addressing **Theme #4 (Kepatuhan Regulasi & Keamanan Data), #16 (Digitalisasi Keuangan Daerah), and #26 (AI & Otomasi Layanan)**.

---

## 🌟 The "Why" - Mengapa Gabung Lebih Baik?

Standalone solutions only tell half the story.

- A standard forensic tool might say: _"Pengeluaran Kab. X tampak markup 200%"._
- A standard legal tool might say: _"PP baru tentang pengadaan terbit"._

**SIGMA connects the dots:** _"Pengeluaran Kab. X markup 200% MELANGGAR Perpres 16/2018 Pasal 24. Vendor memiliki 78% DNA match dengan kasus korupsi terdahulu. REKOMENDASI: perkuat enforcement + selidiki vendor."_

---

## 🏗️ Core Architecture (5 Integrated Modules)

SIGMA is built on a unified pipeline featuring 5 distinct, highly interconnected modules:

1. **Money Intelligence (APBD Forensik):** Extracts data from LKPD/APBD, runs 12 anomaly detection algorithms, tracks follow-the-money pathways, and builds Corruption DNA profiling.
2. **Regulation Intelligence:** Powered by a Regulatory Knowledge Graph mapping over 160,000+ rules to detect contradictions and analyze ripple effects of new policies.
3. **Cross-Check Engine:** The synergy hub where money meets rules. Features the automated matching of financial anomalies to regulatory violations.
4. **Citizen Engagement:** Public transparency dashboard, Smart Whistleblower system, and Budget Photography for on-the-ground infrastructure validation.
5. **Dashboard & Intelligence:** Executive government view featuring the Indonesia Risk Map, Pre-Crime Predictor, and Trend Analytics.

---

## 🔥 Killer Synergy Features

Because SIGMA is a unified platform, it unlocks capabilities impossible in siloed systems:

- **Auto Legal Case Builder:** When an anomaly is detected (e.g., Rp 25M laptop procurement), the AI automatically searches the Regulation Genome, matches the violated rules (e.g., Perpres 16/2018), and generates a ready-to-use legal brief in seconds.
- **Regulation-Corruption Heatmap:** Overlays corruption risks with regulatory burden maps to prove that weak enforcement directly causes high anomaly rates, providing data-driven policy recommendations.
- **Smart Whistleblower:** When citizens report suspicious projects (e.g., via the Budget Photography feature), SIGMA cross-checks the APBD claims against required legal documents (like AMDAL) and outputs a severity score sent directly to inspectors.

---

## 💻 Technology Stack

This prototype leverages a modern, serverless architecture tightly integrated with the Azure ecosystem to process complex NLP, image classification, and graph relationships.

### Frontend & Middleware

- **Framework:** Next.js (App Router) for unified UI and serverless API routing.
- **Styling:** Tailwind CSS, `clsx`, `tailwind-merge` for a clean, minimalist interface.
- **Visualizations:** `Recharts` (Dashboards) and `React Flow` (Vendor Social Graph / Knowledge Graph).

### Database & Cloud (Azure Native)

- **Hosting:** Azure Static Web Apps (Seamless Next.js integration).
- **Database:** Azure Cosmos DB for Apache Gremlin (Graph DB for Vendor/Regulation mapping).
- **Serverless Compute:** Azure Functions (Python) for heavy data manipulation and pattern matching.

### AI & Intelligence Engines

- **Azure AI Document Intelligence:** Parsing LKPD PDFs, regulations, and tender documents.
- **Azure AI Language:** Custom Text Classification, NER, Anomaly Detection, and Regulatory Contradiction Analysis.
- **Azure Custom Vision:** Classifying citizen-uploaded infrastructure photos.
- **Azure Bot Service & Content Safety:** Powering the _Tanya SIGMA_ investigative chatbot and filtering sensitive citizen reports.

---

## 🚀 Getting Started (Development Setup)

### Prerequisites

- Node.js 18+
- Active Azure Subscription (for Cosmos DB and AI Cognitive Services)

### Installation

1. Clone the repository:
   ```bash
   git clone [https://github.com/henrysalim/sigma-sistem-intelijen-governance-monitoring-anggaran](https://github.com/henrysalim/sigma-sistem-intelijen-governance-monitoring-anggaran)
   cd sigma
   ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Set up your `.env.local` file with your Azure credentials:
    ```bash
    AZURE_COSMOS_ENDPOINT="your_endpoint"
    AZURE_COSMOS_KEY="your_key"
    AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT="your_endpoint"
    ```
4. Run the development server:
    ```Bash
    npm run dev
    ```
5. Open http://localhost:3000 with your browser to see the result.

Developed for the 2026 Hackathon.
