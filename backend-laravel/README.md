# 🧩 Backend – Laravel API & Scraper

This backend handles:
- Storing blog articles
- Serving articles via REST API
- Scraping BeyondChats blog content

---

## ⚙️ Tech Stack

- Laravel
- PHP 8+
- MySQL
- REST APIs

---

## 📦 Features

- Articles CRUD API
- Clean article storage
- Command-based scraper
- Duplicate prevention
- Article type handling (`original`, `updated`)

---

## 🗄️ Database Schema

**articles table**

| Column | Type |
|------|------|
| id | bigint |
| title | string |
| content | longText |
| source_url | string |
| type | enum(original, updated) |
| created_at | timestamp |
| updated_at | timestamp |

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|-----|--------|------------|
| GET | /api/articles | Fetch all articles |
| GET | /api/articles/{id} | Fetch single article |
| POST | /api/articles | Create article |
| PUT | /api/articles/{id} | Update article |
| DELETE | /api/articles/{id} | Delete article |

---

## 🧹 Scraping Command

The scraper fetches **specific BeyondChats blog articles** and extracts:
- Clean title
- Only article body paragraphs

### Run Scraper
php artisan scrape:beyondchats
The scraper:

Avoids tags & categories

Skips duplicates

Ensures meaningful content length

▶️ Run Backend

composer install
php artisan migrate
php artisan serve
Server runs at:


http://127.0.0.1:8000
✅ Output
After scraping:

5 original articles stored

Accessible via API

Ready for AI automation

---

# 📘 NODE AUTOMATION README  
📍 **File:** `/node-automation/README.md`

```md
# 🤖 Node.js AI Automation

This module enhances original articles using AI.

---

## 🎯 Purpose

- Fetch original articles from backend
- Search web for reference content
- Use OpenAI to rewrite articles
- Save AI-enhanced versions back to backend

---

## ⚙️ Tech Stack

- Node.js
- Axios
- OpenAI API
- Cheerio (HTML parsing)

---

## 🔑 Environment Variables

Create `.env` file:

```env
LARAVEL_API=http://127.0.0.1:8000/api
OPENAI_API_KEY=your_openai_key
SERPER_API_KEY=your_serper_key
🧠 AI Workflow
Fetch original articles

Attempt Google search for references

Attempt AI rewrite using OpenAI

If AI fails → fallback to original content

Save as updated article

⚠️ Fault Tolerance
If:

Google search fails

Scraping fails

OpenAI API fails

The script:

Logs a warning

Uses original content

Continues execution

This ensures pipeline stability.

▶️ Run Automation

npm install
node index.js
✅ Output
Updated articles saved

Titles marked with (Updated)

Articles visible in frontend