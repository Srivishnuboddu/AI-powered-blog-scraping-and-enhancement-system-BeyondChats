import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://127.0.0.1:8000/api/articles";

function App() {
  const [articles, setArticles] = useState([]);
  const [activeTab, setActiveTab] = useState("original");

  useEffect(() => {
    axios.get(API_URL).then((res) => {
      setArticles(res.data);
    });
  }, []);

  const originalArticles = articles.filter((a) => a.type === "original");
  const updatedArticles = articles.filter((a) => a.type === "updated");

  return (
    <div className="app">
      <header className="header">
        <h1>🤖 AI Blog Enhancer</h1>
        <p>Original vs AI-Enhanced Articles</p>
      </header>

      <div className="tabs">
        <button
          className={activeTab === "original" ? "active" : ""}
          onClick={() => setActiveTab("original")}
        >
          📝 Original Articles
        </button>
        <button
          className={activeTab === "updated" ? "active" : ""}
          onClick={() => setActiveTab("updated")}
        >
          ✨ AI-Enhanced Articles
        </button>
      </div>

      <div className="articles">
        {(activeTab === "original" ? originalArticles : updatedArticles).map(
          (article) => (
            <ArticleCard key={article.id} article={article} />
          )
        )}
      </div>
    </div>
  );
}

function ArticleCard({ article }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="card">
      <h2>{article.title}</h2>
      <span className={`badge ${article.type}`}>
        {article.type === "updated" ? "AI Enhanced" : "Original"}
      </span>

      <p>
        {open ? article.content : article.content.substring(0, 300) + "..."}
      </p>

      <button onClick={() => setOpen(!open)}>
        {open ? "Show Less" : "Read More"}
      </button>
    </div>
  );
}

export default App;
