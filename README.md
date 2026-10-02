# N8N-Data-Analyst-Agent
Autonomous Telegram data analyst bot powered by n8n, JavaScript data profiling, and Google Gemini. Zero hallucinations, 100% accurate metrics.

# Autonomous Data Quality & Analysis Agent (n8n + Gemini + Telegram)

An automated, hallucination-resistant data analysis workflow built with n8n, JavaScript data profiling, and Google Gemini.

The system ingests tabular files (`.csv` or `.xlsx`) directly from a Telegram chat, computes exact descriptive statistics deterministically through code, and leverages Google Gemini to synthesize executive-level data quality audits and cleaning plans delivered back as downloadable document reports.

---

# Overview & Architecture

The Problem: LLMs Cannot Calculate
When an LLM is directly prompted to analyze raw CSV or spreadsheet data with instructions like "count missing values" or "calculate mean salary", it inevitably hallucinates:
- Token Prediction vs. Arithmetic: LLMs predict plausible text strings rather than executing deterministic arithmetic or complete row scans.
- Context Truncation: Large tabular files either exceed token limits or get truncated, forcing the model to invent sample headers and fabricated distributions.

#The Solution: Decoupled Architecture

This workflow cleanly separates computation from interpretation:

1. Deterministic Execution (Code Node): A JavaScript node parses the tabular input to compute row counts, null counts, distinct value rates, boundary extremes, and central tendencies with zero hallucination.
   
2. Qualitative Synthesis (Google Gemini): Gemini receives the pre-calculated metrics in structured JSON format and focuses solely on business logic, anomaly diagnosis, risk assessment, and document formatting.

[ Telegram Ingest ]
      │ 
      ▼
[ Branch: CSV vs. XLSX ]
      │
      ▼
[ Python / JS Profiler ] ──► Exact metric computation (Rows, Columns, Nulls, Min/Max/Mean)
      │
      ▼
[ Google Gemini Agent ]  ──► Contextual reasoning, anomaly detection, cleaning actions
      │
      ▼
[ Binary File Converter ]
      │
      ▼
[ Telegram Send Document ]


#Workflow Step-by-Step

1. Telegram Trigger (`On Message`):Listens for incoming documents uploaded to the bot.
2. Telegram (`Get a File`): Fetches the file buffer from Telegram’s API.
3. Format Switch (`If Node`): Checks the file extension (`.csv` vs. `.xlsx`) and routes the payload to the appropriate extraction node.
4. Extraction Nodes:
   - `Extract from CSV` parses delimited text into JSON objects.
   - `Extract from File` reads `.xlsx` sheets with header recognition enabled.
5. Deterministic Profiler (`Code Node`): Computes:
   - Total rows and columns.
   - Column types (Numeric vs. Text/Categorical).
   - Non-null, null, blank, and unique counts.
   - Numeric distributions (min, max, mean, median).
6. AI Agent (`Google Gemini Chat Model`): Receives the JSON statistical object and generates an audit report covering overview, column breakdowns, anomalies, and cleaning steps.
7. File Converter (`Code / Binary Node`): Converts the output text into a downloadable `.txt` or `.docx` file buffer.
8. Telegram Action (`Send Document`): Delivers the final report back to the user's chat.

#Quickstart & Setup

Prerequisites
- An active [n8n](https://n8n.io/) instance (Cloud or self-hosted).
- A Google Gemini API Key.
- A Telegram Bot Token generated via [@BotFather](https://t.me/BotFather).
