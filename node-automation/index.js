require("dotenv").config();
const axios = require("axios");
const cheerio = require("cheerio");
const OpenAI = require("openai");

const LARAVEL_API = process.env.LARAVEL_API;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/* ------------------ FETCH ORIGINAL ARTICLES ------------------ */
async function getOriginalArticles() {
  const res = await axios.get(`${LARAVEL_API}/articles`, { timeout: 10000 });
  return res.data.filter((a) => a.type === "original");
}

/* ------------------ GOOGLE SEARCH ------------------ */
async function googleSearch(query) {
  try {
    const res = await axios.post(
      "https://google.serper.dev/search",
      { q: query },
      {
        timeout: 20000,
        headers: {
          "X-API-KEY": process.env.SERPER_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    return res.data.organic
      .filter((r) => r.link && !r.link.includes("beyondchats.com"))
      .slice(0, 2);
  } catch (err) {
    console.error("⚠️ Google search failed, skipping references");
    return [];
  }
}

/* ------------------ SCRAPE REFERENCE CONTENT ------------------ */
async function scrapeArticleContent(url) {
  try {
    const response = await axios.get(url, {
      timeout: 15000,
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    const $ = cheerio.load(response.data);
    let content = "";

    $("p").each((_, el) => {
      const text = $(el).text().trim();
      if (text.length > 60) content += text + "\n\n";
    });

    return content.slice(0, 4000);
  } catch (err) {
    console.error("⚠️ Failed to scrape:", url);
    return "";
  }
}

/* ------------------ OPENAI REWRITE ------------------ */
async function rewriteWithOpenAI(originalArticle, referenceArticles) {
  try {
    const prompt = `
You are a professional content writer.

ORIGINAL ARTICLE:
${originalArticle.content}

REFERENCE ARTICLES:
${referenceArticles
  .map((r, i) => `Article ${i + 1}:\n${r.content}`)
  .join("\n\n")}

TASK:
Rewrite the original article so that:
- It matches the quality of reference articles
- Uses proper headings and structure
- Has a professional, SEO-friendly tone
- Is suitable for business readers

Add a "References" section at the end.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      timeout: 30000,
    });

    return response.choices[0].message.content;
  } catch (err) {
    console.error("⚠️ OpenAI failed, using original content");
    return originalArticle.content;
  }
}

/* ------------------ SAVE UPDATED ARTICLE ------------------ */
async function saveUpdatedArticle(originalArticle, updatedContent, refs) {
  try {
    await axios.post(
      `${LARAVEL_API}/articles`,
      {
        title: originalArticle.title + " (Updated)",
        content:
          updatedContent +
          "\n\nReferences:\n" +
          refs.map((r) => r.url).join("\n"),
        source_url: originalArticle.source_url,
        type: "updated",
      },
      { timeout: 10000 }
    );
  } catch (err) {
    console.error("⚠️ Failed to save updated article");
  }
}

/* ------------------ MAIN EXECUTION ------------------ */
(async () => {
  const originalArticles = await getOriginalArticles();

  for (const article of originalArticles) {
    try {
      console.log("Processing:", article.title);

      const searchResults = await googleSearch(article.title);

      const referenceArticles = [];
      for (const result of searchResults) {
        const content = await scrapeArticleContent(result.link);
        referenceArticles.push({ url: result.link, content });
      }

      const updatedContent = await rewriteWithOpenAI(
        article,
        referenceArticles
      );

      await saveUpdatedArticle(article, updatedContent, referenceArticles);

      console.log("Updated:", article.title);
    } catch (err) {
      console.error("⚠️ Skipped article due to error:", article.title);
    }
  }

  console.log("✅ AI automation finished (partial success allowed)");
})();
