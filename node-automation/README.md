# 🤖 Node Automation – AI Blog Enhancement Engine

This module is responsible for **automatically enhancing blog articles using AI**.

It fetches original articles from the Laravel backend, attempts to gather reference content from the web, rewrites the article using OpenAI, and stores the AI-enhanced version back into the backend.

---

## 🎯 Responsibilities

- Fetch original articles from Laravel API
- Search Google for relevant reference articles
- Scrape reference article content
- Rewrite original article using OpenAI
- Save enhanced articles back to the backend
- Gracefully handle failures without breaking the pipeline

---

## 🧰 Tech Stack

- Node.js
- Axios (HTTP requests)
- OpenAI API
- Cheerio (HTML parsing)
- dotenv (environment variables)

---

## 📂 Folder Structure

node-automation/
│
├── index.js # Main automation script
├── package.json
├── package-lock.json
├── .env # Environment variables (ignored in Git)
└── README.md

yaml
Copy code

---

## 🔑 Environment Variables

Create a `.env` file inside `node-automation/`:

```env
LARAVEL_API=http://127.0.0.1:8000/api
OPENAI_API_KEY=your_openai_api_key
SERPER_API_KEY=your_serper_api_key
⚠️ Do NOT commit .env to GitHub

🧠 Automation Workflow
Fetch all articles where type = original

For each article:

Attempt Google search for reference articles

Scrape reference content (if available)

Send content to OpenAI for rewriting

If AI or Google fails:

Use original content as fallback

Save enhanced article with:

(Updated) in title

type = updated

Continue processing remaining articles

⚠️ Fault Tolerance (Important)
This automation is designed to never fail completely.

If any of the following fail:

Google Search API

Reference article scraping

OpenAI API request

The system:

Logs a warning

Uses original content

Still creates an updated article

This behavior demonstrates real-world production readiness.

▶️ How to Run
bash
Copy code
npm install
node index.js
✅ Output
AI-Enhanced articles stored in backend

Articles visible in frontend under AI-Enhanced Articles

Original articles remain unchanged
