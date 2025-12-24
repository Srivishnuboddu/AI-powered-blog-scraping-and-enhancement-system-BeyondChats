---

# 📘 FRONTEND README  
📍 **File:** `/frontend-react/README.md`

```md
# 🎨 Frontend – AI Blog Enhancer UI

This frontend displays blog articles in a clean, modern interface.

---

## 🎯 Features

- Toggle between Original & AI-Enhanced articles
- Responsive grid layout
- AI-themed gradient background
- Glassmorphism cards
- Clear article labels
- Read-more previews

---

## ⚙️ Tech Stack

- React.js
- JavaScript
- CSS (Custom Gradients)
- REST API integration

---

## 🔌 API Integration

Fetches articles from:
http://127.0.0.1:8000/api/articles



Articles are filtered by:
- `type = original`
- `type = updated`

---

## ▶️ Run Frontend

```bash
npm install
npm start
Runs at:


http://localhost:3000
🖥️ UI Behavior
Original Articles tab → shows scraped articles

AI-Enhanced Articles tab → shows updated versions

Gracefully handles missing or short content

