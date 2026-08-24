# ControlFlow AI — Intelligent Finance Controller

> **Autonomous AI-Powered Financial Control, Multi-Factor Anomaly Detection, Cash Runway Forecasting, and Scenario Stress Testing for High-Growth Enterprises.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://controlflow-ai.vercel.app/)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Rakshanda-05/controlflow-ai)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

---

## 🌐 Live Deployment & Links

- 🔗 **Live Web Application**: [https://controlflow-ai.vercel.app/](https://controlflow-ai.vercel.app/)
- 🐙 **GitHub Repository**: [https://github.com/Rakshanda-05/controlflow-ai](https://github.com/Rakshanda-05/controlflow-ai)
- 📦 **Downloadable Project ZIP**: `controlflow-ai.zip`

---

## 📌 Problem Statement

Fast-growing startups and scaling enterprises frequently face critical financial blindspots:
1. **Unmonitored Burn Acceleration**: Sudden cost surges in cloud infrastructure (e.g. AWS compute/RDS unindexed queries) and frontloaded paid marketing can silently deplete cash reserves months ahead of expectations.
2. **Delayed Anomaly Identification**: High-risk wires, unexpected annual SaaS auto-renewals, duplicate flight charges, and out-of-policy expenses are often caught weeks after settlement during month-end reconciliation.
3. **Passive Financial Dashboards**: Traditional accounting software displays historical charts but provides zero predictive insights or contextual recommendations in plain business language.
4. **Complex Scenario Modeling**: Financial modeling for hiring, market downturns, or marketing budget adjustments typically requires brittle, manual spreadsheets that are disconnected from real-time ledger data.

---

## 💡 Solution: ControlFlow AI

**ControlFlow AI** acts as an autonomous AI Finance Controller. Rather than presenting static historical charts, it continuously monitors ledger inflows and outflows to proactively detect anomalies, forecast cash depletion milestones, enforce departmental budget discipline, and provide real-time interactive "What-If" scenario simulations in **Indian Rupees (₹ / INR)**.

---

## ✨ Key Features & Capabilities

### 1. Executive Financial Dashboard
- **Dynamic AI Executive Summary**: Real-time narrative synthesis diagnosing financial health, burn trajectory, and core expense drivers.
- **Key Financial Indicators**: Period-over-period delta tracking for Total Revenue, Operating Expenses, Net Cash Flow, Cash Reserves, Monthly Burn Rate, and Cash Runway formatted in **₹ Lakhs** and **₹ Crores**.
- **Composite Financial Health Score**: 0–100 index weighted across runway adequacy, spending velocity, budget adherence, and anomaly density.
- **Interactive Visualizations**: High-precision Recharts for Revenue vs. Expenses, Cash Trajectory curves, Net Cash Flow bars, and Expense Category breakdowns.

### 2. Transaction Intelligence & Anomaly Detection
- **Multi-Dimensional Anomaly Engine**: Combines **Isolation Forest (Scikit-Learn)**, **Z-Score statistical distance**, and **Interquartile Range (IQR)** to identify unusual spending spikes.
- **Risk Categorization**: Transactions classified into *Critical*, *High*, *Medium*, and *Low* risk tiers.
- **Anomaly Diagnostic Inspector**: Click-to-inspect modal displaying exact statistical deviation, baseline mean, expected corridor (₹min - ₹max) vs. actual spend, and 1-click remediation actions.
- **Ledger Controls**: Advanced filtering by Category, Department, Status, Risk Level, and multi-column sorting.

### 3. Predictive Cash Flow Forecasting
- **Multi-Horizon Econometric Projections**: Predicts revenue, expenses, and cash balance trajectories over 3, 6, or 12-month horizons using Holt-Winters exponential smoothing and linear trend regressions.
- **Safety Reserve Floor**: Visual benchmark line (₹40.0L default) calculating the exact projected date of reserve breach.
- **Confidence Intervals**: Displays upper and lower bounds to capture market and spending variance.

### 4. Department Budget Intelligence
- **Departmental Ledger Tracking**: Engineering, Marketing, Sales, Operations, HR & People, and Executive/Legal.
- **Burn Velocity & Pacing Alerts**: Compares % of budget consumed against % of month elapsed to predict overruns before month-end.
- **Interactive Reallocation Simulator**: Allows immediate departmental ceiling adjustments.

### 5. Prioritized AI Recommendations Feed
- **Ranked Action Feed**: Critical, High, Medium, and Low priority optimization opportunities.
- **Quantified Financial Impact**: Displays estimated monthly and annualized savings (e.g. +₹1,48,000/mo AWS optimization, +₹18,580/mo dormant SaaS deprovisioning).
- **Interactive Action System**: One-click "Execute Recommendation", "Mark Resolved", or "Dismiss".

### 6. 4-Pillar Risk Monitor & Stress Testing
- **Composite 0–100 Risk Score**: Evaluates 4 distinct risk pillars:
  1. *Cash Flow & Runway Risk*
  2. *Spending Velocity Risk*
  3. *Budget Compliance Risk*
  4. *Anomaly & Fraud Exposure Risk*
- **Root-Cause Drivers**: Attribution cards linking directly to mitigation actions.
- **Macroeconomic Stress Tests**: Simulates downside scenarios (e.g. Revenue Slowdown -25%, Cloud Infrastructure Drift +40%, Aggressive Hiring).

### 7. Conversational AI Finance Assistant
- **Context-Aware Analytics**: Answers complex queries using the real-time financial database.
  - *"Why did expenses increase this month?"*
  - *"What is our biggest financial risk?"*
  - *"Which department is overspending?"*
  - *"How can we extend our runway to 12 months?"*
- **Structured Financial Responses**: Returns metric cards, data breakdowns, and recommended follow-up queries.

### 8. What-If Scenario Simulator
- **Interactive Sliders**: Real-time adjustment of Revenue Growth (-50% to +100%), Expense Inflation (-30% to +50%), Marketing Spend Delta (-₹4.0L to +₹5.0L), and New Headcount additions.
- **Side-by-Side Impact Matrix**: Instant live recalculation of Simulated Runway, Monthly Burn Delta, 6-Month Reserve Delta, and Projected Risk Score.
- **One-Click Stress Presets**: "Bear Market / Recession", "Hypergrowth Expansion", "Conservative Bootstrap", and "Runway Extension".

---

## 🏗️ Architecture Overview

```
                          ┌─────────────────────────────────────────┐
                          │   Client: React 18 + TS + Tailwind CSS  │
                          │   Vite • Recharts • Framer Motion       │
                          └────────────────────┬────────────────────┘
                                               │
                                      REST API │ JSON
                                               ▼
                          ┌─────────────────────────────────────────┐
                          │   Backend Server: Node.js + Express.js  │
                          │   TypeScript REST API (Port 5000)       │
                          └──────┬─────────────┬─────────────┬──────┘
                                 │             │             │
                    ┌────────────┴─────┐ ┌─────┴───────────┐ ┌┴────────────────────┐
                    │ Anomaly Engine   │ │ Forecast Engine │ │ Financial Risk      │
                    │ Z-Score & IQR    │ │ Holt-Winters    │ │ Multi-Pillar Radar  │
                    └──────────────────┘ └─────────────────┘ └─────────────────────┘
                                               │
                                 ┌─────────────┴───────────┐
                                 │ Python ML Service       │
                                 │ Scikit-Learn Isolation  │
                                 │ Forest & Time-Series    │
                                 └─────────────────────────┘
```

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Recharts, Framer Motion |
| **Backend API** | Node.js, Express.js, TypeScript, TSX, Cors, Dotenv, Archiver |
| **AI / ML Engine** | Python 3, Scikit-Learn (`IsolationForest`), Pandas, NumPy, SciPy |
| **Styling & Theme** | Deep Slate/Navy fintech dark theme, Glassmorphism, Responsive CSS Grid/Flexbox |

---

## 📁 Project Directory Structure

```
controlflow-ai/
├── client/                     # Vite + React 18 + TypeScript Frontend
│   ├── src/
│   │   ├── components/         # Layout, Header, Sidebar, Toasts, Modals
│   │   ├── pages/              # 8 Core Views (Dashboard, Ledger, Cash Flow, Budgets, etc.)
│   │   ├── context/            # FinancialContext.tsx (Global React State & INR Formatting)
│   │   ├── services/           # api.ts (REST client with resilient fallback)
│   │   ├── types/              # TypeScript interfaces & definitions
│   │   ├── App.tsx             # Root Application Router & ErrorBoundary
│   │   └── main.tsx            # React DOM Entrypoint
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
├── server/                     # Node.js + Express + TypeScript Backend
│   ├── src/
│   │   ├── data/               # Master Financial Ledger (INR) & Benchmarks
│   │   ├── routes/             # REST Routers (dashboard, transactions, forecast, budgets, risks, etc.)
│   │   ├── services/           # AnomalyService, ForecastService, RiskService, SummaryService, AssistantService
│   │   ├── types/              # Server Type Definitions
│   │   └── index.ts            # Express Server Entrypoint (Port 5000)
│   ├── package.json
│   └── tsconfig.json
├── ml-service/                 # Standalone Python AI/ML Module
│   ├── anomaly_detector.py     # Scikit-Learn Isolation Forest & Z-Score Implementation
│   ├── cashflow_forecaster.py  # Time-Series Forecasting Script
│   └── requirements.txt        # Python ML Dependencies
├── scripts/
│   ├── generate_zip.js         # Automated Standalone ZIP Archiver
│   ├── run_all.bat             # Windows 1-Click Startup Script
│   └── run.sh                  # Linux/macOS 1-Click Startup Script
├── README.md                   # Comprehensive Technical Documentation
└── package.json                # Monorepo Workspace Configuration
```

---

## 🚀 Installation & Local Setup

### Prerequisites
- **Node.js** (v18.0 or higher)
- **npm** (v9.0 or higher)
- **Python 3.9+** (optional, for standalone ML scripts)

---

### Method 1: One-Click Quickstart (Recommended)

#### On Windows:
```bash
scripts\run_all.bat
```

#### On Linux / macOS:
```bash
chmod +x scripts/run.sh
./scripts/run.sh
```

---

### Method 2: Manual Installation & Launch

1. **Clone or Extract the Project Archive:**
   ```bash
   cd controlflow-ai
   ```

2. **Install Root and Subproject Dependencies:**
   ```bash
   npm run install:all
   ```

3. **Start Frontend and Backend Concurrently:**
   ```bash
   npm run dev
   ```

   - **Frontend App**: `http://localhost:3000`
   - **Backend API**: `http://localhost:5000`

---

## 📡 REST API Documentation

| Endpoint | Method | Description |
|---|---|---|
| `/api/dashboard` | `GET` | Returns executive KPIs, AI summary, historical charts, category breakdowns, and health score. |
| `/api/transactions` | `GET` | Queries financial transactions with search, category/risk filters, sorting, and pagination. |
| `/api/transactions/:id` | `GET` | Returns single transaction details, Z-score, and expected corridor bounds. |
| `/api/transactions` | `POST` | Logs a new transaction and runs immediate real-time anomaly evaluation. |
| `/api/transactions/:id/status` | `PATCH` | Updates status (`cleared`, `pending`, `flagged`) and risk level. |
| `/api/anomalies` | `GET` | Returns all active anomalous and flagged transactions. |
| `/api/cashflow` | `GET` | Returns historical series + 3/6/12-month predictive forecast with confidence intervals. |
| `/api/budgets` | `GET` | Returns department allocations, actual spend, pacing percentage, and AI recommendations. |
| `/api/budgets/:id` | `PATCH` | Updates department budget allocation ceiling. |
| `/api/insights` | `GET` | Returns prioritized AI recommendations feed with potential cost savings. |
| `/api/insights/:id/status` | `PATCH` | Updates recommendation status (`resolved`, `dismissed`, `active`). |
| `/api/risks` | `GET` | Returns overall risk score, 4-pillar scores, root-cause factors, and stress tests. |
| `/api/assistant` | `POST` | Natural language AI query endpoint returning analytical answers, metrics, and follow-ups. |
| `/api/simulator/calculate` | `POST` | Computes What-If stress test simulation based on user slider parameters. |
| `/api/export/zip` | `GET` | Streams the complete downloadable project ZIP archive. |
| `/api/health` | `GET` | Backend system health check. |

---

## 🧠 AI / ML Implementation Details

### 1. Isolation Forest Anomaly Detection (`ml-service/anomaly_detector.py`)
- Fits an ensemble of 100 Isolation Trees on multi-dimensional transaction feature vectors:
  $$\mathbf{x} = \left[ \log(1 + \text{amount}), \mathbb{I}_{\text{recurring}}, \frac{\text{amount}}{\mu_{\text{category}}} \right]$$
- Isolates anomalous spending patterns and scores them in a normalized $[0.0, 1.0]$ severity range.

### 2. Statistical Z-Score & Interquartile Range (IQR)
- Calculates rolling mean $\mu$ and standard deviation $\sigma$ per merchant category:
  $$z = \frac{|x - \mu|}{\sigma}$$
- Outliers exceeding $z \ge 2.2$ or $x > Q_3 + 1.5 \times \text{IQR}$ trigger automated controller review.

### 3. Predictive Cash Flow & Runway Forecasting
- Computes trend momentum using multi-variable regression with seasonal smoothing:
  $$R_{t} = \alpha_r + \beta_r t, \quad E_{t} = \alpha_e + \beta_e t$$
  $$\text{Balance}_t = \text{Balance}_{t-1} + R_t - E_t$$
- Calculates exact milestone dates when cash balance dips below the safety boundary ($\text{₹}40\text{L}$).

---

## 🎁 How to Generate the Project ZIP

Run the included automated archiver to package the entire project into a clean, ready-to-distribute `.zip` file:

```bash
npm run zip
```
*Output: `controlflow-ai.zip` in the root project directory.*

---

## 🔮 Future Enhancements
- Direct OAuth2 bank account integrations (Plaid & Stripe Connect).
- Automated ERP synchronization (QuickBooks Online, NetSuite, Xero).
- OCR receipt and invoice ingestion with automatic tax line-item parsing.
- Slack & Microsoft Teams real-time webhook alert dispatching.
